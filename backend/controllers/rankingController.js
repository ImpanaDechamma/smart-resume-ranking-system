const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateRankingScore } = require('../services/rankingService');
const { estimateExperience, detectEducationLevel } = require('../services/resumeParser');

// @desc    Generate rankings for a job
// @route   POST /api/rankings/job/:jobId
// @access  Private (HR)
const generateRankings = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Get Job Requirements
    const job = await Job.findById(jobId).lean();
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const jobRequirements = {
      requiredSkills: job.required_skills || [],
      minExp: job.min_experience || 0
    };

    // 2. Get all applications for this job
    const applications = await Application.find({ job: jobId });

    // 3. Process each application
    for (let app of applications) {
      const candidateSkills = app.skills || [];
      const candidateExp = estimateExperience(app.extracted_text || '');
      const candidateEduLevel = detectEducationLevel(app.extracted_text || '');

      const candidateData = {
        candidateSkills,
        candidateExp,
        candidateEduLevel
      };

      // 4. Calculate Score
      const scores = calculateRankingScore(candidateData, jobRequirements);

      // 5. Update application with rankings
      app.ranking = {
        skills_score: scores.skillsScore,
        experience_score: scores.experienceScore,
        education_score: scores.educationScore,
        total_score: scores.totalScore
      };
      
      await app.save();
    }

    // 6. Update rank_position based on total_score
    const allRankings = await Application.find({ job: jobId }).sort({ 'ranking.total_score': -1 });

    for (let i = 0; i < allRankings.length; i++) {
      allRankings[i].ranking.rank_position = i + 1;
      await allRankings[i].save();
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

    const rankings = await Application.find({ job: jobId })
      .populate('candidate', 'name email')
      .sort({ 'ranking.rank_position': 1 })
      .lean();

    const formatted = rankings.map(r => ({
      ...r.ranking,
      id: r._id,
      status: r.status,
      candidateName: r.candidate?.name,
      candidateEmail: r.candidate?.email
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateRankings,
  getRankings
};
