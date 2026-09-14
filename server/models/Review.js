const mongoose = require('mongoose');

/**
 * Review Schema
 * Stores Fiverr 5-star review screenshots uploaded to Cloudinary.
 */
const reviewSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      trim: true,
      default: '',
    },
    platform: {
      type: String,
      default: 'Direct Client',
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    // Cloudinary secure URL of the review screenshot
    image: {
      type: String,
      required: [true, 'Review image (screenshot) is required'],
    },
    // Cloudinary public_id for deletion
    imagePublicId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
