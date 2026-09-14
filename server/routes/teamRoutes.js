const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const {
  getTeamData,
  getAllTeamDataAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  updateTeamInfo,
} = require('../controllers/teamController');

// Public route to view team details & members
router.get('/', getTeamData);

// Admin routes
router.get('/admin/all', protect, getAllTeamDataAdmin);
router.put('/info', protect, updateTeamInfo);
router.post('/members', protect, upload.single('avatar'), createTeamMember);
router.put('/members/:id', protect, upload.single('avatar'), updateTeamMember);
router.delete('/members/:id', protect, deleteTeamMember);

module.exports = router;
