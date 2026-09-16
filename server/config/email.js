const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'support@pawnear.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'sample_app_password'
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send an OTP Email using HTML brand template
 */
const sendOtpEmail = async (toEmail, otp, purpose = 'Verification') => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'PAW NEAR'}" <${process.env.EMAIL_USER || 'support@pawnear.com'}>`,
    to: toEmail,
    subject: `🐾 PAW NEAR - Your ${purpose} One-Time Passcode: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #FAF7F2; padding: 24px; color: #1E293B;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0F172A; font-size: 22px; font-weight: 900; margin: 0;">🐾 PAW NEAR</h1>
            <p style="color: #64748B; font-size: 12px; margin-top: 4px;">Everything Your Pet Needs, Near You</p>
          </div>

          <div style="background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <span style="color: #92400E; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
              ${purpose} Passcode
            </span>
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #0F172A; font-family: monospace;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
            This one-time passcode is valid for <strong>10 minutes</strong>. Please do not share this passcode with anyone, including PAW NEAR support personnel.
          </p>

          <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 24px 0;" />

          <p style="font-size: 11px; color: #94A3B8; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} PAW NEAR Technologies Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    `
  };

  try {
    // If running in development with placeholder credentials, log the OTP safely to console
    const pass = process.env.EMAIL_APP_PASSWORD || '';
    const isPlaceholder = !pass || pass.includes('your_') || pass.includes('sample') || pass === 'your_16_digit_gmail_app_password';

    if (isPlaceholder) {
      console.log(`\n📧 [DEV SIMULATED EMAIL] To: ${toEmail} | OTP: ${otp} | Purpose: ${purpose}\n`);
      return { messageId: 'simulated_dev_email', status: 'simulated' };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Real Email Sent: ${info.messageId} to ${toEmail}`);
    return info;
  } catch (error) {
    console.error(`❌ Email Send Failed: ${error.message}`);
    // Safe dev fallback
    return { status: 'failed_or_simulated', error: error.message };
  }
};

/**
 * Send Order Confirmation & Live Tracking Email
 */
const sendOrderConfirmationEmail = async (toEmail, order) => {
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'PAW NEAR'}" <${process.env.EMAIL_USER || 'support@pawnear.com'}>`,
    to: toEmail,
    subject: `🎉 Order Confirmed #${order.orderId || order._id} - PAW NEAR`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #FAF7F2; padding: 24px; color: #1E293B;">
        <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #E2E8F0;">
          <h2 style="color: #0F172A; font-size: 20px; font-weight: 900; margin-top: 0;">🎉 Your Pet's Order is Confirmed!</h2>
          <p style="font-size: 13px; color: #64748B;">Order #${order.orderId || order._id} • ${order.paymentMethod || 'Online Payment'}</p>
          
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="font-size: 13px; font-weight: bold; margin: 0 0 8px 0; color: #0F172A;">Delivery Address:</p>
            <p style="font-size: 12px; color: #475569; margin: 0;">${order.shippingAddress?.address || 'Your saved address'}, ${order.shippingAddress?.city || 'Hyderabad'}</p>
            <p style="font-size: 14px; font-weight: 900; color: #D97706; margin-top: 12px;">Total Paid: ₹${order.totalAmount || order.pricing?.total || 0}</p>
          </div>

          <p style="font-size: 12px; color: #64748B;">You can track your rider in real time on the PAW NEAR app map.</p>
        </div>
      </div>
    `
  };

  try {
    if (!process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_APP_PASSWORD.includes('sample')) {
      console.log(`\n📧 [DEV SIMULATED EMAIL] Order Confirmation for ${toEmail}\n`);
      return { messageId: 'simulated_order_email' };
    }
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

module.exports = {
  transporter,
  sendOtpEmail,
  sendOrderConfirmationEmail
};
