const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const Settings = require('../models/Settings');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({
      siteName: 'Shazzed Shuvo',
      tagline: 'Web Specialist & Web Developer',
      teamName: 'Dont Worry',
      email: 'shazzedshuvo@gmail.com',
      availableForHire: true,
    });
  }
  res.json(settings);
});

/**
 * @route   PUT /api/settings
 * @access  Admin
 */
const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings();
  }

  const { siteName, tagline, teamName, email, availableForHire } = req.body;

  if (siteName) settings.siteName = siteName;
  if (tagline !== undefined) settings.tagline = tagline;
  if (teamName !== undefined) settings.teamName = teamName;
  if (email) settings.email = email;
  if (availableForHire !== undefined) {
    settings.availableForHire = availableForHire === 'true' || availableForHire === true;
  }

  // Check if new logo file is uploaded
  if (req.file) {
    // Delete old logo from Cloudinary if exists
    if (settings.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.logoPublicId);
      } catch (err) {
        console.error('Old logo deletion error:', err);
      }
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'portfolio/branding'
    );
    settings.logo = uploadResult.secure_url;
    settings.logoPublicId = uploadResult.public_id;
  }

  const updated = await settings.save();
  res.json(updated);
});

module.exports = { getSettings, updateSettings };
