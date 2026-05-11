const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connection SUCCESSFUL! MongoDB is ready.');
    process.exit(0);
  } catch (err) {
    console.error('Database connection FAILED!');
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testConnection();
