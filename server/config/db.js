const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Global cache to maintain connection across invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to AWS Database (Amazon DocumentDB / AWS EC2 MongoDB)
 */
const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('❌ MONGO_URI is missing in server/.env');
      return null;
    }

    const isAwsDocumentDB = mongoUri.includes('docdb.amazonaws.com') || process.env.DATABASE_PROVIDER === 'AWS_DOCUMENTDB';

    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000,
      autoIndex: false,
    };

    // AWS DocumentDB TLS / Certificate support
    if (isAwsDocumentDB) {
      const caPath = process.env.AWS_DOCUMENTDB_CA_FILE || path.join(__dirname, '..', 'certs', 'global-bundle.pem');
      if (fs.existsSync(caPath)) {
        opts.tls = true;
        opts.tlsCAFile = caPath;
        console.log(`🔒 AWS DocumentDB: Loaded SSL CA certificate from ${caPath}`);
      }
    }

    cached.promise = mongoose.connect(mongoUri, opts)
      .then((conn) => {
        const dbHost = conn.connection.host || 'AWS Server';
        const dbName = conn.connection.name || 'pawstreet';
        console.log(`✅ AWS Database Connected Successfully: ${dbHost}/${dbName}`);
        return conn;
      })
      .catch((error) => {
        cached.promise = null;
        console.error(`❌ AWS Database Connection Failed: ${error.message}`);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.warn('⚠️ AWS Database connection could not be established immediately:', error.message);
    return null;
  }
};

module.exports = connectDB;
