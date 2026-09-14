const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Settings = require('./models/Settings');

async function updateTeam() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: { teamName: 'Dont Worry' } },
      { upsert: true, new: true }
    );
    console.log('Settings teamName updated in Atlas DB:', updated.teamName);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateTeam();
