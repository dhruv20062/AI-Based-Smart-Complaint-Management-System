const express = require('express');
const router = express.Router();
const { analyzeComplaint, analyzeAllComplaints } = require('../controllers/aiController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/ai/analyze
router.post('/analyze', analyzeComplaint);

// POST /api/ai/analyze-all  (Admin only)
router.post('/analyze-all', protect, adminOnly, analyzeAllComplaints);

module.exports = router;
