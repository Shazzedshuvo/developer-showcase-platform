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

  const {
    siteName,
    logoName,
    siteTitle,
    tagline,
    teamName,
    email,
    availableForHire,
    removeLogo,
    removeFavicon,
  } = req.body;

  if (siteName !== undefined) settings.siteName = siteName.trim();
  if (logoName !== undefined) settings.logoName = logoName.trim();
  if (siteTitle !== undefined) settings.siteTitle = siteTitle.trim();
  if (tagline !== undefined) settings.tagline = tagline.trim();
  if (teamName !== undefined) settings.teamName = teamName.trim();
  if (email !== undefined) settings.email = email.trim();
  if (availableForHire !== undefined) {
    settings.availableForHire = availableForHire === 'true' || availableForHire === true;
  }

  // Handle remove logo
  if (removeLogo === 'true' || removeLogo === true) {
    if (settings.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.logoPublicId);
      } catch (err) {
        console.error('Logo deletion error:', err);
      }
    }
    settings.logo = '';
    settings.logoPublicId = '';
  }

  // Handle remove favicon
  if (removeFavicon === 'true' || removeFavicon === true) {
    if (settings.faviconPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.faviconPublicId);
      } catch (err) {
        console.error('Favicon deletion error:', err);
      }
    }
    settings.favicon = '';
    settings.faviconPublicId = '';
  }

  // Check if new logo file is uploaded (via req.files['logo'] or req.file)
  const logoFile = req.files?.logo?.[0] || req.file;
  if (logoFile) {
    if (settings.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.logoPublicId);
      } catch (err) {
        console.error('Old logo deletion error:', err);
      }
    }

    const uploadResult = await uploadToCloudinary(
      logoFile.buffer,
      'portfolio/branding'
    );
    settings.logo = uploadResult.secure_url;
    settings.logoPublicId = uploadResult.public_id;
  }

  // Check if new favicon file is uploaded
  const faviconFile = req.files?.favicon?.[0];
  if (faviconFile) {
    if (settings.faviconPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.faviconPublicId);
      } catch (err) {
        console.error('Old favicon deletion error:', err);
      }
    }

    const uploadResult = await uploadToCloudinary(
      faviconFile.buffer,
      'portfolio/branding'
    );
    settings.favicon = uploadResult.secure_url;
    settings.faviconPublicId = uploadResult.public_id;
  }

  const updated = await settings.save();
  res.json(updated);
});

module.exports = { getSettings, updateSettings };
