const Razorpay = require('razorpay');

let razorpayInstance = null;

try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_pawnear_sample_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_pawnear_sample_secret'
  });
} catch (error) {
  console.warn('⚠️ Razorpay initialization warning:', error.message);
}

module.exports = razorpayInstance;
