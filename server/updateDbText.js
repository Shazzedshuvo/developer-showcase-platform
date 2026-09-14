const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Review = require('./models/Review');

async function updateDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const result = await Review.updateMany(
      { $or: [
        { platform: { $regex: /fiverr/i } },
        { platform: { $regex: /top rated/i } }
      ]},
      { $set: { platform: 'Agency Partner' } }
    );
    console.log('Updated reviews count:', result.modifiedCount);
    
    // Also let's set any null or default platform reviews to 'Verified Client'
    const result2 = await Review.updateMany(
      { platform: { $in: [null, '', 'Fiverr'] } },
      { $set: { platform: 'Verified Client' } }
    );
    console.log('Fixed empty platform reviews:', result2.modifiedCount);
    
    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updateDb();
