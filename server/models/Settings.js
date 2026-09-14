const mongoose = require('mongoose');

/**
 * Settings Schema
 * Stores global portfolio configuration including brand logo and profile details.
 */
const settingsSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      default: '',
    },
    logoPublicId: {
      type: String,
      default: '',
    },
    siteName: {
      type: String,
      default: 'Shazzed Shuvo',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Web Specialist & Web Developer',
      trim: true,
    },
    teamName: {
      type: String,
      default: 'Dont Worry',
      trim: true,
    },
    email: {
      type: String,
      default: 'shazzedshuvo@gmail.com',
      trim: true,
    },
    availableForHire: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
