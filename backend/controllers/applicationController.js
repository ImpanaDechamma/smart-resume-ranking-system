const Job = require('../models/Job');
const Application = require('../models/Application');
const { extractText, extractSkills } = require('../services/resumeParser');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const candidateId = req.user.id;

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: candidateId });

    if (existing) {
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
    const application = await Application.create({
      job: jobId,
      candidate: candidateId,
      resume_path: resumePath,
      extracted_text: extractedText,
      status: 'pending',
      skills: candidateSkills
    });

    res.status(201).json({ message: 'Application submitted successfully', applicationId: application._id });
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
    const applications = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company')
      .sort({ applied_at: -1 })
      .lean();

    const formatted = applications.map(app => ({
      id: app._id,
      jobId: app.job?._id.toString(),
      jobTitle: app.job?.title,
      company: app.job?.company,
      appliedDate: app.applied_at.toISOString().split('T')[0],
      status: app.status,
      score: app.ranking?.total_score || 0
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

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email')
      .sort({ applied_at: -1 })
      .lean();

    const formatted = applications.map(app => ({
      id: app._id.toString(),
      jobId: app.job.toString(),
      candidateName: app.candidate?.name,
      candidateEmail: app.candidate?.email,
      appliedDate: app.applied_at.toISOString().split('T')[0],
      status: app.status,
      score: app.ranking?.total_score || 0,
      candidateSkills: app.skills || [],
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
    const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ message: 'Status updated', application });
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
