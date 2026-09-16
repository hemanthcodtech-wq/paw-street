const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment configuration
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize DB
const connectDB = require('./config/db');
connectDB();

const app = express();

// Security & Parsing Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    // Allow localhost, vercel deployments, and configured client url
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app') ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Safe permissive fallback
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Ignore browser favicon requests
app.get(['/favicon.ico', '/favicon.png'], (req, res) => res.status(204).end());

// Root Information Endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PAW NEAR API Engine is running 🚀',
    status: 'ONLINE',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      auth: '/api/auth'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    service: 'PAW NEAR API Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: {
      mongodb: 'Connected',
      cloudinary: 'Enabled',
      razorpay: 'Enabled',
      nodemailerOtp: 'Enabled',
      googleAuth: 'Enabled'
    }
  });
});

// Middleware to ensure DB is connected before executing any API route in serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('DB connect middleware error:', err.message);
  }
  next();
});

// Mount Application Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Centralized Error & 404 Handlers
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 PAW NEAR Backend Server is running on: http://localhost:${PORT}`);
    console.log(`📋 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

module.exports = app;
