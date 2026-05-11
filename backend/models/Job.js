const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  required_skills: [String],
  min_experience: { type: Number, default: 0 },
  location: { type: String },
  salary: { type: String },
  logo: { type: String },
  banner: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
