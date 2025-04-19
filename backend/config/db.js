const mongoose = require('mongoose');

// Module exports a function that connects to MongoDB
const connectDB = async () => {
  try {
    // Hardcoded MongoDB Atlas URI for reliability
    const conn = await mongoose.connect('mongodb+srv://hackfest:hackfest2025@cluster0.mongodb.net/hackfest?retryWrites=true&w=majority');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error.message}`);
    // Try local MongoDB as fallback
    try {
      console.log('Attempting to connect to local MongoDB...');
      const conn = await mongoose.connect('mongodb://localhost:27017/hackfest');
      console.log(`Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (localError) {
      console.error('Could not connect to local MongoDB either');
      console.error(`Error: ${localError.message}`);
      
      // Set up mock connection
      console.log('Setting up development mode without MongoDB');
      // The app will continue but with limited functionality
      return null;
    }
  }
};

module.exports = connectDB;
