const mongoose = require('mongoose');

// Global cache to maintain connection across warm Vercel serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const DEFAULT_MONGO_URI = 'mongodb+srv://hrzewotech:zewotech@zewo.yo2htvx.mongodb.net/pawstreet?retryWrites=true&w=majority';

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO_URI;
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      autoIndex: false
    };

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((conn) => {
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.warn('⚠️ MongoDB connection could not be established immediately.');
    return null;
  }
};

module.exports = connectDB;
