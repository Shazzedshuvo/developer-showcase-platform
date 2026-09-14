const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLogo } = require('../middleware/uploadMiddleware');

// Public route to get site settings & logo
router.get('/', getSettings);

// Protected admin route to update settings & logo
router.put('/', protect, uploadLogo, updateSettings);

module.exports = router;
