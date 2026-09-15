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
    logoName: {
      type: String,
      default: 'SS',
      trim: true,
    },
    favicon: {
      type: String,
      default: '',
    },
    faviconPublicId: {
      type: String,
      default: '',
    },
    siteName: {
      type: String,
      default: 'Shazzed Shuvo',
      trim: true,
    },
    siteTitle: {
      type: String,
      default: '',
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
    teamTagline: {
      type: String,
      default: 'Collaborative Excellence in Web Development & CMS Solutions',
      trim: true,
    },
    teamDescription: {
      type: String,
      default: 'A multidisciplinary team of dedicated web engineers, designers, and CMS specialists delivering bespoke digital experiences with 100% precision.',
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
