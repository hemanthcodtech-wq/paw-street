const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const { sendOtpEmail } = require('./config/email');

const testForgotFlow = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB for forgot password testing\n');

  const testEmail = 'customer@thepawstreet.com';
  const user = await User.findOne({ email: testEmail });

  if (!user) {
    console.error('User not found:', testEmail);
    process.exit(1);
  }

  // 1. Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  user.otp = { code: otpCode, expiresAt };
  await user.save();

  console.log(`1. Generated 6-digit OTP for ${testEmail}: ${otpCode}`);

  // 2. Trigger Nodemailer
  const mailResult = await sendOtpEmail(testEmail, otpCode, 'Password Reset');
  console.log('2. Nodemailer dispatch status:', mailResult?.status || 'dispatched');

  // 3. Test Reset Password
  const newPass = 'CustomerNewPassword@2026';
  user.password = newPass;
  user.otp = { code: null, expiresAt: null };
  await user.save();

  // 4. Verify new password matches
  const updatedUser = await User.findOne({ email: testEmail }).select('+password');
  const isMatch = await updatedUser.matchPassword(newPass);
  console.log(`3. Verified updated password match: ${isMatch ? '✅ SUCCESS' : '❌ FAILED'}`);

  // Restore original password for stability
  updatedUser.password = 'CustomerPassword@123';
  await updatedUser.save();
  console.log('4. Restored default password for Customer test account.');

  process.exit(0);
};

testForgotFlow();
