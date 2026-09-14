const mongoose = require('mongoose');

/**
 * Admin Schema
 * Single admin user — seeded once via seed.js.
 * No registration endpoint is exposed publicly.
 */
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
