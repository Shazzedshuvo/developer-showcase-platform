const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Settings = require('./models/Settings');

async function updateTagline() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: { tagline: 'Web Specialist & Web Developer' } },
      { upsert: true, new: true }
    );
    console.log('Settings tagline updated in Atlas DB:', updated.tagline);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateTagline();
