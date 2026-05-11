const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume_path: { type: String },
  extracted_text: { type: String },
  status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
  skills: [String],
  ranking: {
    skills_score: { type: Number, default: 0 },
    experience_score: { type: Number, default: 0 },
    education_score: { type: Number, default: 0 },
    total_score: { type: Number, default: 0 },
    rank_position: { type: Number }
  },
  applied_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);
