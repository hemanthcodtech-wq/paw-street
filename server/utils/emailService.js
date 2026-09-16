const nodemailer = require('nodemailer');

// =========================================================
// Shared transporter – reads from .env (EMAIL_* variables)
// =========================================================
const createTransporter = async () => {
  const hasRealSmtp =
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_APP_PASSWORD;

  if (hasRealSmtp) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,            // smtp.gmail.com
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true', // false for 587
      auth: {
        user: process.env.EMAIL_USER,              // Gmail address
        pass: process.env.EMAIL_APP_PASSWORD       // Gmail App Password
      }
    });
  }

  // Ethereal fallback (dev only – not a real inbox)
  const testAccount = await nodemailer.createTestAccount();
  console.warn('[emailService] No real SMTP configured – using Ethereal test account');
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
};

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'PAW NEAR Pet Care';
const FROM_EMAIL = process.env.EMAIL_USER || 'admin@pawnear.com';
const FROM = `"${FROM_NAME}" <${FROM_EMAIL}>`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// =========================================================
// 1. Vendor Approval Email (Includes Complete Application Form Copy)
// =========================================================
const sendVendorWelcomeEmail = async (vendor, password, pdfUrl, pdfBuffer) => {
  const transporter = await createTransporter();
  const loginUrl = `${CLIENT_URL}/vendor/login`;

  // Bank details extraction
  const bankAcc = vendor.bankDetails?.accountNumber || '';
  const maskedAcc = bankAcc.length >= 4 
    ? `•••• •••• •••• ${bankAcc.slice(-4)}` 
    : (bankAcc ? `•••• ${bankAcc}` : '••••••••4920');

  const businessTypes = Array.isArray(vendor.businessTypes) && vendor.businessTypes.length > 0
    ? vendor.businessTypes.join(', ')
    : 'Pet Store & Retail Services';

  const html = `
    <div style="font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif;max-width:650px;margin:0 auto;color:#1e293b;background:#f8fafc;padding:24px;border-radius:24px;">
      
      <!-- Top Brand Header -->
      <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:36px 30px;border-radius:18px 18px 0 0;text-align:center;box-shadow:0 10px 25px rgba(15,23,42,0.15);">
        <h1 style="color:#FFB703;margin:0;font-size:30px;font-weight:900;letter-spacing:2px;">PAW NEAR</h1>
        <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;font-weight:600;letter-spacing:0.5px;">Merchant Onboarding &amp; Store Activation Certificate</p>
      </div>

      <!-- Main Body Container -->
      <div style="background:#ffffff;padding:36px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 18px 18px;">
        
        <!-- Welcome Banner -->
        <div style="background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:1.5px solid #6ee7b7;border-radius:14px;padding:22px 24px;margin-bottom:28px;text-align:center;">
          <span style="background:#10b981;color:#ffffff;font-size:11px;font-weight:900;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;display:inline-block;margin-bottom:8px;">KYC Approved &amp; Active</span>
          <h2 style="color:#065f46;margin:4px 0 0;font-size:22px;font-weight:900;">Congratulations, ${vendor.fullName}!</h2>
          <p style="color:#047857;margin:8px 0 0;font-size:14.5px;line-height:1.5;">Your store <strong style="color:#064e3b;">${vendor.storeName}</strong> has been officially approved. You are now authorized to manage inventory, accept pet orders, and deliver services on PAW NEAR.</p>
        </div>

        <!-- Temporary Login Credentials Box -->
        <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:14px;padding:22px;margin-bottom:28px;">
          <h3 style="margin:0 0 14px;color:#92400e;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:900;">Your Vendor Portal Credentials</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#78350f;width:150px;"><strong>Registered Email:</strong></td>
              <td style="padding:6px 0;font-size:14px;color:#0284c7;font-weight:800;">${vendor.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:14px;color:#78350f;"><strong>Temporary Password:</strong></td>
              <td style="padding:6px 0;">
                <code style="background:#fef08a;padding:5px 14px;border-radius:8px;font-weight:900;color:#78350f;font-size:16px;border:1px dashed #f59e0b;letter-spacing:1px;">${password}</code>
              </td>
            </tr>
          </table>
          <p style="margin:14px 0 0;font-size:12.5px;color:#b45309;line-height:1.5;">Tip: Please sign in below using this temporary password. You can reset or update your permanent password anytime inside your vendor profile.</p>
        </div>

        <!-- Action Button -->
        <div style="text-align:center;margin:32px 0;">
          <a href="${loginUrl}" style="background:#FFB703;color:#0f172a;text-decoration:none;padding:16px 40px;font-weight:900;border-radius:12px;display:inline-block;font-size:15px;box-shadow:0 6px 20px rgba(255,183,3,0.45);letter-spacing:0.5px;">Log in to Vendor Dashboard &rarr;</a>
        </div>

        <!-- Attached File Notice -->
        <div style="background:#f1f5f9;border:1.5px solid #cbd5e1;border-radius:12px;padding:16px 20px;margin-bottom:28px;display:flex;align-items:center;">
          <div>
            <p style="margin:0;font-size:13.5px;font-weight:800;color:#0f172a;">Official Application &amp; Approval Certificate (Attached)</p>
            <p style="margin:4px 0 0;font-size:12.5px;color:#64748b;">We have attached a PDF copy of your approved application form and certificate directly to this email for your records.</p>
            ${pdfUrl ? `<p style="margin:8px 0 0;"><a href="${pdfUrl}" target="_blank" style="color:#0284c7;font-weight:800;font-size:13px;text-decoration:underline;">Click here to View / Download Certificate Online &rarr;</a></p>` : ''}
          </div>
        </div>

        <!-- FULL APPLICATION FORM COPY EMBEDDED -->
        <div style="border:1.5px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-bottom:28px;">
          <div style="background:#0f172a;padding:14px 20px;">
            <h3 style="margin:0;color:#ffffff;font-size:14px;font-weight:800;letter-spacing:0.5px;">📄 COPY OF SUBMITTED APPLICATION FORM</h3>
          </div>

          <div style="padding:20px;background:#ffffff;">
            <!-- Store Details -->
            <p style="margin:0 0 10px;font-size:12px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:1px;">1. Store &amp; Manager Information</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;width:40%;">Store Name:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.storeName}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Authorized Manager:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.fullName}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Business Category:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.category || 'Pet Store & Services'}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Services / Business Types:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${businessTypes}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Primary Phone:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.phone}</td>
              </tr>
              <tr>
                <td style="padding:7px 0;color:#64748b;">Platform Commission:</td>
                <td style="padding:7px 0;font-weight:700;color:#059669;">${vendor.commissionRate || 12}%</td>
              </tr>
            </table>

            <!-- KYC Details -->
            <p style="margin:0 0 10px;font-size:12px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:1px;">2. Statutory KYC Information</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;width:40%;">Trade Licence Number:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.storeLicenceNumber || 'uytrtthj56u76y4rty'} <span style="color:#059669;font-size:11px;font-weight:800;">[VERIFIED]</span></td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">PAN Card Number:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.panNumber || '3ERTG4R5T5'} <span style="color:#059669;font-size:11px;font-weight:800;">[VERIFIED]</span></td>
              </tr>
              <tr>
                <td style="padding:7px 0;color:#64748b;">Aadhaar UID Number:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.aadhaarNumber || '34t5t6656ty6y5t66y65'} <span style="color:#059669;font-size:11px;font-weight:800;">[VERIFIED]</span></td>
              </tr>
            </table>

            <!-- Location Details -->
            <p style="margin:0 0 10px;font-size:12px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:1px;">3. Store Physical Location</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;width:40%;">Store Address:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.location?.address || 'lingampally'}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">City, State &amp; PIN:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.location?.city || 'Hyderabad'}, ${vendor.location?.state || 'Telangana'} - ${vendor.location?.pincode || '500019'}</td>
              </tr>
              <tr>
                <td style="padding:7px 0;color:#64748b;">Hyperlocal Coverage:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">10 KM Delivery Radius</td>
              </tr>
            </table>

            <!-- Banking Details -->
            <p style="margin:0 0 10px;font-size:12px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:1px;">4. Payout &amp; Bank Settlement Details</p>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;width:40%;">Account Holder:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.bankDetails?.accountHolderName || vendor.fullName}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Bank Name:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.bankDetails?.bankName || 'HDFC Bank Ltd.'}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">Account Number:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${maskedAcc}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:7px 0;color:#64748b;">IFSC Code:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.bankDetails?.ifscCode || 'HDFC0001248'}</td>
              </tr>
              <tr>
                <td style="padding:7px 0;color:#64748b;">UPI VPA ID:</td>
                <td style="padding:7px 0;font-weight:700;color:#0f172a;">${vendor.bankDetails?.upiId || 'ramarajukoyyalagadda123@okhdfcbank'}</td>
              </tr>
            </table>

          </div>
        </div>

        <!-- Footer -->
        <div style="padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
          <p style="margin:0;">Have questions or need assistance? Reach out to <a href="mailto:support@pawnear.com" style="color:#0284c7;font-weight:700;">support@pawnear.com</a></p>
          <p style="margin:6px 0 0;font-weight:700;color:#64748b;">PAW NEAR Merchant Governance &amp; Compliance Network</p>
        </div>

      </div>
    </div>
  `;

  const attachments = [];
  if (pdfBuffer) {
    const safeName = (vendor.storeName || 'Vendor').replace(/[^a-zA-Z0-9_-]/g, '_');
    attachments.push({
      filename: `PAW_NEAR_Application_${safeName}_Approval.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf'
    });
  }

  const mailOptions = {
    from: FROM,
    to: vendor.email,
    subject: `Approved! Your PAW NEAR Store "${vendor.storeName}" is Now Live [Application Copy Attached]`,
    html,
    attachments
  };

  const info = await transporter.sendMail(mailOptions);

  if (!process.env.EMAIL_HOST) {
    console.log('Ethereal Preview URL:', nodemailer.getTestMessageUrl(info));
  } else {
    console.log(`Approval email sent to ${vendor.email} (${info.messageId}) with application copy attached.`);
  }
  return info;
};

// =========================================================
// 2. Vendor Rejection Email
// =========================================================
const sendVendorRejectionEmail = async (vendor, reason) => {
  const transporter = await createTransporter();
  const reapplyUrl = `${CLIENT_URL}/vendor/onboarding`;

  const html = `
    <div style="font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif;max-width:620px;margin:0 auto;color:#1e293b;background:#f8fafc;padding:20px;border-radius:20px;">
      <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:32px 28px;border-radius:16px 16px 0 0;text-align:center;">
        <h1 style="color:#FFB703;margin:0;font-size:28px;font-weight:900;letter-spacing:2px;">PAW NEAR</h1>
        <p style="color:#94a3b8;margin:8px 0 0;font-size:13px;font-weight:600;">Vendor Application Review Update</p>
      </div>
      <div style="background:#ffffff;padding:36px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;">
        <h2 style="color:#0f172a;margin-top:0;font-size:19px;">Hello, ${vendor.fullName}</h2>
        <p style="color:#475569;font-size:14px;line-height:1.7;">Thank you for applying to become a PAW NEAR vendor partner with <strong>${vendor.storeName}</strong>. After careful review of your KYC documents, we are unable to approve your application at this time.</p>
        <div style="background:#fff1f2;border:1.5px solid #fecdd3;border-left:5px solid #f43f5e;border-radius:12px;padding:20px;margin:24px 0;">
          <h3 style="margin:0 0 10px;color:#9f1239;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:900;">Reason for Rejection</h3>
          <p style="margin:0;color:#881337;font-size:14px;font-weight:700;line-height:1.6;">${reason || 'Compliance documentation was incomplete or could not be verified.'}</p>
        </div>
        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:18px;margin-bottom:24px;">
          <h3 style="margin:0 0 10px;color:#075985;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:900;">What You Can Do</h3>
          <ul style="margin:0;padding-left:18px;color:#0c4a6e;font-size:13px;line-height:2;">
            <li>Review the rejection reason above carefully</li>
            <li>Gather correct and up-to-date KYC documents (Trade Licence, PAN, Aadhaar)</li>
            <li>Ensure all documents are legible and valid</li>
            <li>Submit a new application with corrected information</li>
          </ul>
        </div>
        <div style="text-align:center;margin:28px 0;">
          <a href="${reapplyUrl}" style="background:#1e293b;color:#FFB703;text-decoration:none;padding:14px 32px;font-weight:900;border-radius:12px;display:inline-block;font-size:14px;">Submit a New Application</a>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:16px;font-size:13px;color:#475569;margin-bottom:24px;">
          Store: <strong>${vendor.storeName}</strong> | Licence: <strong>${vendor.storeLicenceNumber || 'N/A'}</strong> | PAN: <strong>${vendor.panNumber || 'N/A'}</strong>
        </div>
        <div style="padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
          <p style="margin:0;">Questions? Write to <a href="mailto:support@pawnear.com" style="color:#0284c7;">support@pawnear.com</a></p>
          <p style="margin:6px 0 0;font-weight:700;color:#64748b;">PAW NEAR Compliance &amp; KYC Team</p>
        </div>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: FROM,
    to: vendor.email,
    subject: `Update on Your PAW NEAR Vendor Application – ${vendor.storeName}`,
    html
  });

  if (!process.env.EMAIL_HOST) {
    console.log('Ethereal Preview URL:', nodemailer.getTestMessageUrl(info));
  } else {
    console.log(`Rejection email sent to ${vendor.email} (${info.messageId})`);
  }
  return info;
};

module.exports = {
  sendVendorWelcomeEmail,
  sendVendorRejectionEmail
};
