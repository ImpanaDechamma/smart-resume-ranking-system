const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('hr', 'admin'), createJob);

router.route('/:id')
  .get(getJob);

module.exports = router;
