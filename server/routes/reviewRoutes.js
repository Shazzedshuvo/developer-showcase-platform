const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getReviews);

// Admin-protected
router.post('/', protect, uploadSingle, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
