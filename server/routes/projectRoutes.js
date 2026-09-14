const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProjectImages } = require('../middleware/uploadMiddleware');

// Public
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

// Admin-protected
router.post('/', protect, uploadProjectImages, createProject);
router.put('/:id', protect, uploadProjectImages, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
