const db = require('../config/db');
const { extractText, extractSkills } = require('../services/resumeParser');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    // Check if already applied
    const [existing] = await db.execute(
      'SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?',
      [jobId, candidateId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a resume file' });
    }

    const resumePath = req.file.path;
    
    // Parse resume asynchronously
    const extractedText = await extractText(resumePath);
    const candidateSkills = extractSkills(extractedText);

    // Save application
    const [result] = await db.execute(
      'INSERT INTO applications (job_id, candidate_id, resume_path, extracted_text, status) VALUES (?, ?, ?, ?, ?)',
      [jobId, candidateId, resumePath, extractedText, 'pending']
    );

    // Save extracted skills
    for (let skill of candidateSkills) {
      await db.execute(
        'INSERT INTO extracted_skills (application_id, skill_name) VALUES (?, ?)',
        [result.insertId, skill]
      );
    }

    res.status(201).json({ message: 'Application submitted successfully', applicationId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during application' });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my
// @access  Private (Candidate)
const getMyApplications = async (req, res) => {
  try {
    const [applications] = await db.execute(`
      SELECT a.*, j.title as jobTitle, j.company, 
             r.total_score as score
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN rankings r ON r.application_id = a.id
      WHERE a.candidate_id = ?
    `, [req.user.id]);

    const formatted = applications.map(app => ({
      id: app.id,
      jobId: app.job_id.toString(),
      jobTitle: app.jobTitle,
      company: app.company,
      appliedDate: app.applied_at.toISOString().split('T')[0],
      status: app.status,
      score: app.score || 0
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (HR)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify ownership (optional based on your needs, skipping for now)

    const [applications] = await db.execute(`
      SELECT a.*, u.name as candidateName, u.email as candidateEmail,
             r.total_score as score
      FROM applications a
      JOIN users u ON a.candidate_id = u.id
      LEFT JOIN rankings r ON r.application_id = a.id
      WHERE a.job_id = ?
    `, [jobId]);

    // Fetch skills for each application
    for (let app of applications) {
      const [skills] = await db.execute('SELECT skill_name FROM extracted_skills WHERE application_id = ?', [app.id]);
      app.candidateSkills = skills.map(s => s.skill_name);
    }

    const formatted = applications.map(app => ({
      id: app.id.toString(),
      jobId: app.job_id.toString(),
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      appliedDate: app.applied_at.toISOString().split('T')[0],
      status: app.status,
      score: app.score || 0,
      candidateSkills: app.candidateSkills,
      missingSkills: [] // In a real app, calculate this by comparing with job_skills
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (HR)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateStatus
};
