const db = require('../config/db');
const { calculateRankingScore } = require('../services/rankingService');
const { estimateExperience, detectEducationLevel } = require('../services/resumeParser');

// @desc    Generate rankings for a job
// @route   POST /api/rankings/job/:jobId
// @access  Private (HR)
const generateRankings = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get Job Requirements
    const [jobs] = await db.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (jobs.length === 0) return res.status(404).json({ error: 'Job not found' });
    const job = jobs[0];

    const [jobSkillsRows] = await db.execute('SELECT skill_name FROM job_skills WHERE job_id = ?', [jobId]);
    const requiredSkills = jobSkillsRows.map(row => row.skill_name.toLowerCase());
    
    const jobRequirements = {
      requiredSkills,
      minExp: job.min_experience || 0
    };

    // 2. Get all applications for this job
    const [applications] = await db.execute('SELECT * FROM applications WHERE job_id = ?', [jobId]);

    // 3. Process each application
    for (let app of applications) {
      // Get candidate skills
      const [appSkillsRows] = await db.execute('SELECT skill_name FROM extracted_skills WHERE application_id = ?', [app.id]);
      const candidateSkills = appSkillsRows.map(row => row.skill_name.toLowerCase());

      // Parse exp and edu from extracted_text
      const candidateExp = estimateExperience(app.extracted_text || '');
      const candidateEduLevel = detectEducationLevel(app.extracted_text || '');

      const candidateData = {
        candidateSkills,
        candidateExp,
        candidateEduLevel
      };

      // 4. Calculate Score
      const scores = calculateRankingScore(candidateData, jobRequirements);

      // 5. Store/Update in rankings table
      const [existingRanking] = await db.execute('SELECT id FROM rankings WHERE application_id = ?', [app.id]);
      
      if (existingRanking.length > 0) {
        await db.execute(`
          UPDATE rankings 
          SET skills_score = ?, experience_score = ?, education_score = ?, total_score = ?
          WHERE application_id = ?
        `, [scores.skillsScore, scores.experienceScore, scores.educationScore, scores.totalScore, app.id]);
      } else {
        await db.execute(`
          INSERT INTO rankings (application_id, skills_score, experience_score, education_score, total_score)
          VALUES (?, ?, ?, ?, ?)
        `, [app.id, scores.skillsScore, scores.experienceScore, scores.educationScore, scores.totalScore]);
      }
    }

    // 6. Update rank_position based on total_score
    const [allRankings] = await db.execute(`
      SELECT r.id, r.total_score 
      FROM rankings r
      JOIN applications a ON r.application_id = a.id
      WHERE a.job_id = ?
      ORDER BY r.total_score DESC
    `, [jobId]);

    for (let i = 0; i < allRankings.length; i++) {
      await db.execute('UPDATE rankings SET rank_position = ? WHERE id = ?', [i + 1, allRankings[i].id]);
    }

    res.json({ message: 'Rankings generated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during ranking generation' });
  }
};

// @desc    Get rankings for a job
// @route   GET /api/rankings/job/:jobId
// @access  Private (HR)
const getRankings = async (req, res) => {
  try {
    const { jobId } = req.params;

    const [rankings] = await db.execute(`
      SELECT r.*, a.status, u.name as candidateName, u.email as candidateEmail
      FROM rankings r
      JOIN applications a ON r.application_id = a.id
      JOIN users u ON a.candidate_id = u.id
      WHERE a.job_id = ?
      ORDER BY r.rank_position ASC
    `, [jobId]);

    res.json(rankings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateRankings,
  getRankings
};
