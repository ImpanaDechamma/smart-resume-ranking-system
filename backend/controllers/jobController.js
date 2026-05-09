const db = require('../config/db');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const [jobs] = await db.execute(`
      SELECT j.*, 
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicants 
      FROM jobs j 
      ORDER BY j.created_at DESC
    `);
    
    // Process skills into arrays
    const formattedJobs = jobs.map(job => ({
      ...job,
      skills: job.required_skills ? job.required_skills.split(',').map(s => s.trim()) : [],
      posted: job.created_at.toISOString().split('T')[0]
    }));

    res.json(formattedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const [jobs] = await db.execute(`
      SELECT j.*, 
        (SELECT COUNT(*) FROM applications WHERE job_id = j.id) as applicants 
      FROM jobs j 
      WHERE j.id = ?
    `, [req.params.id]);

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = jobs[0];
    res.json({
      ...job,
      skills: job.required_skills ? job.required_skills.split(',').map(s => s.trim()) : [],
      posted: job.created_at.toISOString().split('T')[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (HR/Admin)
const createJob = async (req, res) => {
  try {
    const { title, company, description, skills } = req.body;
    
    const requiredSkillsStr = Array.isArray(skills) ? skills.join(',') : skills;

    const [result] = await db.execute(
      'INSERT INTO jobs (recruiter_id, title, company, description, required_skills) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, title, company, description, requiredSkillsStr]
    );

    // Insert into job_skills table
    if (Array.isArray(skills)) {
      for (let skill of skills) {
        await db.execute(
          'INSERT INTO job_skills (job_id, skill_name) VALUES (?, ?)',
          [result.insertId, skill.trim().toLowerCase()]
        );
      }
    }

    res.status(201).json({ id: result.insertId, message: 'Job created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob
};
