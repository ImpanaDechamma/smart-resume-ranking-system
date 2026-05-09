const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getJobApplications, updateStatus } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), applyToJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('hr', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('hr', 'admin'), updateStatus);

module.exports = router;
