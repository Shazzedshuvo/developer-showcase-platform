require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

/**
 * Seed Script
 * Creates the initial admin user from environment variables.
 * Run once: node seed.js
 * ⚠️  Change ADMIN_PASSWORD in .env after running!
 */
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
    } else {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin@1234',
        12
      );

      await Admin.create({
        username: (process.env.ADMIN_USERNAME || 'admin').toLowerCase(),
        password: hashedPassword,
      });

      console.log(`✅ Admin user created — username: "${process.env.ADMIN_USERNAME || 'admin'}"`);
    }

    // Seed default categories if none exist
    const Category = require('./models/Category');
    const existingCats = await Category.countDocuments();
    if (existingCats === 0) {
      const defaultCategories = [
        { name: 'Wix', slug: 'wix' },
        { name: 'Squarespace', slug: 'squarespace' },
        { name: 'Custom Code', slug: 'custom-code' },
        { name: 'Shopify', slug: 'shopify' },
        { name: 'WordPress', slug: 'wordpress' },
      ];
      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories created (Wix, Squarespace, Custom Code, Shopify, WordPress)');
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
