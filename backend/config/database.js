const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ✅ CORRECT: Forces it to look for the Cloud URL from Render
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Stop the app if database fails
  }
};

module.exports = connectDB;