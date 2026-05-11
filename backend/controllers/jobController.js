const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ created_at: -1 }).lean();
    
    // Process skills into arrays and add applicant counts
    const formattedJobs = await Promise.all(jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ job: job._id });
      return {
        ...job,
        id: job._id.toString(),
        skills: job.required_skills || [],
        posted: job.created_at.toISOString().split('T')[0],
        applicants: applicantCount
      };
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
    const job = await Job.findById(req.params.id).lean();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const applicantCount = await Application.countDocuments({ job: job._id });

    res.json({
      ...job,
      id: job._id.toString(),
      skills: job.required_skills || [],
      posted: job.created_at.toISOString().split('T')[0],
      applicants: applicantCount
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
    let { logo, banner } = req.body;

    // Handle file uploads if present
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        logo = `http://localhost:5000/uploads/images/${req.files.logo[0].filename}`;
      }
      if (req.files.banner && req.files.banner[0]) {
        banner = `http://localhost:5000/uploads/images/${req.files.banner[0].filename}`;
      }
    }
    
    const required_skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);

    const job = await Job.create({
      recruiter: req.user.id,
      title,
      company,
      description,
      logo,
      banner,
      required_skills: required_skills.map(s => s.toLowerCase())
    });

    res.status(201).json({ id: job._id, message: 'Job created successfully' });
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
