const mongoose = require('mongoose');

// Prevent Mongoose from buffering queries indefinitely when database is offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pawnear', {
      serverSelectionTimeoutMS: 5000,
      autoIndex: false
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.warn('⚠️ Server will operate in mock-resilient mode until MongoDB is reachable.');
  }
};

module.exports = connectDB;
