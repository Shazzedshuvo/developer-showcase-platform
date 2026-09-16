const mongoose = require('mongoose');

/**
 * Project Schema
 * Core model representing a portfolio project entry.
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    // Cloudinary secure URL for the main thumbnail
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    coverImagePublicId: {
      type: String,
    },
    // Array of additional screenshot URLs from Cloudinary
    gallery: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    demoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    // Reference to the Category document
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    // Optional linked Fiverr review screenshot
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Pinned project flag (max 15 allowed system-wide)
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    // Recent project flag with 1 year validity
    isRecent: {
      type: Boolean,
      default: true,
    },
    recentUntil: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Valid for 1 year
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
