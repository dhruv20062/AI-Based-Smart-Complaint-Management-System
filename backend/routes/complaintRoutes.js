const express = require('express');
const router = express.Router();
const {
  addComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  searchByLocation,
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/complaints/search?location=Ghaziabad  (must be before /:id)
router.get('/search', searchByLocation);

// POST /api/complaints
router.post('/', addComplaint);

// GET /api/complaints
router.get('/', getAllComplaints);

// GET /api/complaints/:id
router.get('/:id', getComplaintById);

// PUT /api/complaints/:id  (Admin only)
router.put('/:id', protect, adminOnly, updateComplaintStatus);

// DELETE /api/complaints/:id  (Admin only)
router.delete('/:id', protect, adminOnly, deleteComplaint);

module.exports = router;
