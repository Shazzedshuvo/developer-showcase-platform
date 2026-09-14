const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const Review = require('../models/Review');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/reviews
 * @access  Public
 */
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
});

/**
 * @route   POST /api/reviews
 * @access  Admin
 * @body    multipart/form-data — image file + optional fields
 */
const createReview = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Review screenshot image is required');
  }

  const { clientName, platform, rating } = req.body;

  // Upload screenshot to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, 'portfolio/reviews');

  const review = await Review.create({
    clientName: clientName || '',
    platform: platform || 'Direct Client',
    rating: rating ? Number(rating) : 5,
    image: result.secure_url,
    imagePublicId: result.public_id,
  });

  res.status(201).json(review);
});

/**
 * @route   DELETE /api/reviews/:id
 * @access  Admin
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Delete screenshot from Cloudinary
  if (review.imagePublicId) {
    await cloudinary.uploader.destroy(review.imagePublicId);
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

module.exports = { getReviews, createReview, deleteReview };
