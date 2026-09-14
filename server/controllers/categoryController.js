const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Category = require('../models/Category');

/**
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json(categories);
});

/**
 * @route   POST /api/categories
 * @access  Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const generatedSlug = slug
    ? slugify(slug, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  // Check for duplicate
  const existing = await Category.findOne({
    $or: [{ name }, { slug: generatedSlug }],
  });
  if (existing) {
    res.status(400);
    throw new Error('A category with this name or slug already exists');
  }

  const category = await Category.create({ name, slug: generatedSlug });
  res.status(201).json(category);
});

/**
 * @route   PUT /api/categories/:id
 * @access  Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (name) category.name = name;
  if (slug) category.slug = slugify(slug, { lower: true, strict: true });
  else if (name) category.slug = slugify(name, { lower: true, strict: true });

  const updated = await category.save();
  res.json(updated);
});

/**
 * @route   DELETE /api/categories/:id
 * @access  Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
