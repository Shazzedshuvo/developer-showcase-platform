const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const cloudinary = require('../config/cloudinary');
const Project = require('../models/Project');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

/**
 * @route   GET /api/projects
 * @access  Public
 * @query   category (slug), featured (boolean string)
 */
const getProjects = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  if (req.query.pinned === 'true') {
    filter.isPinned = true;
  }

  // Filter by category slug — resolve slug → ObjectId
  if (req.query.category) {
    const Category = require('../models/Category');
    const cat = await Category.findOne({ slug: req.query.category });
    if (cat) filter.category = cat._id;
  }

  const projects = await Project.find(filter)
    .populate('category', 'name slug')
    .populate('review', 'clientName platform rating image')
    .sort({ isPinned: -1, pinnedAt: -1, isRecent: -1, isFeatured: -1, createdAt: -1 });

  // Map to attach isRecentActive flag based on 1-year expiration
  const now = new Date();
  const processed = projects.map((p) => {
    const doc = p.toObject();
    doc.isRecentActive = Boolean(
      doc.isRecent && (!doc.recentUntil || new Date(doc.recentUntil) > now)
    );
    return doc;
  });

  // Sort: pinned first (newest pinned first), then recent active, then featured, then newest created
  processed.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isPinned && b.isPinned) {
      const timeA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : 0;
      const timeB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
    }
    if (a.isRecentActive && !b.isRecentActive) return -1;
    if (!a.isRecentActive && b.isRecentActive) return 1;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(processed);
});

/**
 * @route   GET /api/projects/:slug
 * @access  Public
 */
const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug })
    .populate('category', 'name slug')
    .populate('review', 'clientName platform rating image');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const doc = project.toObject();
  doc.isRecentActive = Boolean(
    doc.isRecent && (!doc.recentUntil || new Date(doc.recentUntil) > new Date())
  );

  res.json(doc);
});

/**
 * @route   POST /api/projects
 * @access  Admin
 * @body    multipart/form-data — fields + coverImage file + gallery files
 */
const createProject = asyncHandler(async (req, res) => {
  const { title, slug, description, demoUrl, category, review, isFeatured, isRecent, isPinned } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Title, description, and category are required');
  }

  // Check pin limit if pinning
  const wantsPin = isPinned === 'true' || isPinned === true;
  if (wantsPin) {
    const pinnedCount = await Project.countDocuments({ isPinned: true });
    if (pinnedCount >= 15) {
      res.status(400);
      throw new Error('Maximum 15 projects can be pinned. Please unpin a project first.');
    }
  }

  // Ensure coverImage was uploaded
  if (!req.files?.coverImage?.[0]) {
    res.status(400);
    throw new Error('Cover image is required');
  }

  // Auto-generate slug if not provided
  const projectSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(title, { lower: true, strict: true });

  // Upload cover image to Cloudinary
  const coverResult = await uploadToCloudinary(
    req.files.coverImage[0].buffer,
    'portfolio/projects'
  );

  // Upload gallery images (if any) in parallel
  let gallery = [];
  if (req.files?.gallery?.length) {
    const galleryUploads = req.files.gallery.map((f) =>
      uploadToCloudinary(f.buffer, 'portfolio/gallery')
    );
    const galleryResults = await Promise.all(galleryUploads);
    gallery = galleryResults.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  }

  // 1 year from now
  const oneYearExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const project = await Project.create({
    title,
    slug: projectSlug,
    description,
    coverImage: coverResult.secure_url,
    coverImagePublicId: coverResult.public_id,
    gallery,
    demoUrl: demoUrl || '',
    category,
    review: review || null,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isRecent: isRecent !== 'false' && isRecent !== false, // Defaults to true
    recentUntil: oneYearExpiry,
    isPinned: wantsPin,
    pinnedAt: wantsPin ? new Date() : null,
  });

  const populated = await project.populate(['category', 'review']);
  const doc = populated.toObject();
  doc.isRecentActive = true;
  res.status(201).json(doc);
});

/**
 * @route   PUT /api/projects/:id
 * @access  Admin
 */
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const { title, slug, description, demoUrl, category, review, isFeatured, isRecent, isPinned } = req.body;

  if (title) project.title = title;
  if (slug) project.slug = slugify(slug, { lower: true, strict: true });
  if (description) project.description = description;
  if (demoUrl !== undefined) project.demoUrl = demoUrl;
  if (category) project.category = category;
  if (review !== undefined) project.review = review || null;
  if (isFeatured !== undefined) project.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isRecent !== undefined) {
    project.isRecent = isRecent === 'true' || isRecent === true;
    if (project.isRecent && !project.recentUntil) {
      project.recentUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
  }

  if (isPinned !== undefined) {
    const wantsPin = isPinned === 'true' || isPinned === true;
    if (wantsPin && !project.isPinned) {
      const pinnedCount = await Project.countDocuments({ isPinned: true });
      if (pinnedCount >= 15) {
        res.status(400);
        throw new Error('Maximum 15 projects can be pinned. Please unpin a project first.');
      }
      project.isPinned = true;
      project.pinnedAt = new Date();
    } else if (!wantsPin && project.isPinned) {
      project.isPinned = false;
      project.pinnedAt = null;
    }
  }

  // Replace cover image if a new one was uploaded
  if (req.files?.coverImage?.[0]) {
    // Delete old image from Cloudinary
    if (project.coverImagePublicId) {
      await cloudinary.uploader.destroy(project.coverImagePublicId);
    }
    const result = await uploadToCloudinary(
      req.files.coverImage[0].buffer,
      'portfolio/projects'
    );
    project.coverImage = result.secure_url;
    project.coverImagePublicId = result.public_id;
  }

  // Append new gallery images if provided
  if (req.files?.gallery?.length) {
    const galleryUploads = req.files.gallery.map((f) =>
      uploadToCloudinary(f.buffer, 'portfolio/gallery')
    );
    const galleryResults = await Promise.all(galleryUploads);
    const newItems = galleryResults.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
    project.gallery.push(...newItems);
  }

  const updated = await project.save();
  await updated.populate(['category', 'review']);
  const doc = updated.toObject();
  const now = new Date();
  doc.isRecentActive = Boolean(
    doc.isRecent && (!doc.recentUntil || new Date(doc.recentUntil) > now)
  );
  res.json(doc);
});

/**
 * @route   PATCH /api/projects/:id/pin
 * @access  Admin
 */
const togglePinProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  if (!project.isPinned) {
    const pinnedCount = await Project.countDocuments({ isPinned: true });
    if (pinnedCount >= 15) {
      res.status(400);
      throw new Error('Maximum 15 projects can be pinned. Please unpin a project first.');
    }
    project.isPinned = true;
    project.pinnedAt = new Date();
  } else {
    project.isPinned = false;
    project.pinnedAt = null;
  }

  const updated = await project.save();
  await updated.populate(['category', 'review']);

  const now = new Date();
  const doc = updated.toObject();
  doc.isRecentActive = Boolean(
    doc.isRecent && (!doc.recentUntil || new Date(doc.recentUntil) > now)
  );

  res.json({
    message: project.isPinned ? 'Project pinned successfully' : 'Project unpinned successfully',
    project: doc,
  });
});

/**
 * @route   DELETE /api/projects/:id
 * @access  Admin
 */
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Clean up Cloudinary assets
  const destroyPromises = [];
  if (project.coverImagePublicId) {
    destroyPromises.push(cloudinary.uploader.destroy(project.coverImagePublicId));
  }
  project.gallery.forEach((img) => {
    if (img.publicId) destroyPromises.push(cloudinary.uploader.destroy(img.publicId));
  });
  await Promise.all(destroyPromises);

  await project.deleteOne();
  res.json({ message: 'Project deleted' });
});

module.exports = {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  togglePinProject,
};
