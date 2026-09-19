const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pawnear.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword@123';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() }).select('+password');
    let created = false;

    if (!admin) {
      admin = await User.create({
        name: process.env.SEED_ADMIN_NAME || 'PAW NEAR Super Admin',
        email: adminEmail.toLowerCase(),
        phone: process.env.SEED_ADMIN_PHONE || '+91 90000 00001',
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      created = true;
      console.log('Seed admin created.');
    } else {
      admin.name = process.env.SEED_ADMIN_NAME || admin.name || 'PAW NEAR Super Admin';
      admin.phone = process.env.SEED_ADMIN_PHONE || admin.phone || '+91 90000 00001';
      admin.role = 'admin';
      admin.isVerified = true;

      if (process.env.SEED_ADMIN_RESET_PASSWORD === 'true') {
        admin.password = adminPassword;
      }

      await admin.save();
      console.log('Seed admin already existed and was updated.');
    }

    console.log('Admin login:');
    console.log(`  Email:    ${adminEmail}`);
    console.log(`  Password: ${created || process.env.SEED_ADMIN_RESET_PASSWORD === 'true' ? adminPassword : '(unchanged if already existed)'}`);
    console.log('  Role:     admin');

    process.exit(0);
  } catch (error) {
    console.error('Seed admin failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
