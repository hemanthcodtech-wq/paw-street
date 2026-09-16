const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const testAuth = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for auth test\n');

  const accounts = [
    { role: 'admin', email: 'admin@pawnear.com', password: 'AdminPassword@123' },
    { role: 'vendor', email: 'vendor@pawnear.com', password: 'VendorPassword@123' },
    { role: 'delivery', email: 'rider@pawnear.com', password: 'RiderPassword@123' },
    { role: 'customer', email: 'customer@thepawstreet.com', password: 'CustomerPassword@123' }
  ];

  for (const acc of accounts) {
    const user = await User.findOne({ email: acc.email }).select('+password');
    if (!user) {
      console.error(`❌ User not found: ${acc.email}`);
      continue;
    }

    const isMatch = await user.matchPassword(acc.password);
    if (!isMatch) {
      console.error(`❌ Password mismatch for: ${acc.email}`);
      continue;
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Verify JWT Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(`✅ [${acc.role.toUpperCase()}] Login & JWT Verified:`);
    console.log(`   ID: ${user._id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${decoded.email}`);
    console.log(`   Role in JWT: ${decoded.role}`);
    console.log(`   Token (Preview): ${token.slice(0, 32)}...\n`);
  }

  // Count total users in database
  const userCount = await User.countDocuments();
  console.log(`📊 Total User records in MongoDB: ${userCount} (Target: Exactly 4)`);

  process.exit(0);
};

testAuth();
