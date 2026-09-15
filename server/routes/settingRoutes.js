const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { uploadBrandAssets } = require('../middleware/uploadMiddleware');

// Public route to get site settings & logo
router.get('/', getSettings);

// Protected admin route to update settings, logo & favicon
router.put('/', protect, uploadBrandAssets, updateSettings);

module.exports = router;
