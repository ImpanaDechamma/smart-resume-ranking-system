const express = require('express');
const router = express.Router();
const { generateRankings, getRankings } = require('../controllers/rankingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/job/:jobId', protect, authorize('hr', 'admin'), generateRankings);
router.get('/job/:jobId', protect, authorize('hr', 'admin'), getRankings);

module.exports = router;
