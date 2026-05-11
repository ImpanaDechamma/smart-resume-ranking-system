const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const uploadImages = require('../middleware/imageUploadMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('hr', 'admin'), uploadImages.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]), createJob);

router.route('/:id')
  .get(getJob);

module.exports = router;
