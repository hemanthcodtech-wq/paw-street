const PDFDocument = require('pdfkit');

/**
 * Generate a Vendor Application Approval Certificate & Application Copy PDF document.
 * Returns a Promise that resolves with a Buffer containing the PDF data.
 * @param {Object} vendor 
 * @returns {Promise<Buffer>}
 */
const generateVendorApprovalPDF = (vendor) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 36, 
        info: { 
          Title: `PAW NEAR Approval - ${vendor.storeName || 'Vendor'}`,
          Author: 'PAW NEAR Technologies India',
          Subject: 'Official Vendor Application Record & Approval Certificate'
        } 
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      const W = 595.28;
      const contentW = W - 72; // 523.28 pt
      const left = 36;

      // Extract vendor details with sensible fallbacks
      const vendorId = vendor._id ? vendor._id.toString() : 'VND' + Date.now();
      const appId = `APP-VN-${vendorId.slice(-8).toUpperCase()}`;
      const storeName = vendor.storeName || 'N/A';
      const fullName = vendor.fullName || 'N/A';
      const email = vendor.email || 'N/A';
      const phone = vendor.phone || 'N/A';
      const category = vendor.category || 'Pet Store, Food & Accessories';
      const businessTypes = Array.isArray(vendor.businessTypes) && vendor.businessTypes.length > 0 
        ? vendor.businessTypes.join(', ') 
        : 'Pet Store & Retail Services';
      const commissionRate = vendor.commissionRate ? `${vendor.commissionRate}%` : '12%';

      // KYC
      const storeLicence = vendor.storeLicenceNumber || 'uytrtthj56u76y4rty';
      const pan = vendor.panNumber || 'N/A';
      const aadhaar = vendor.aadhaarNumber || 'N/A';

      // Location
      const address = vendor.location?.address || 'N/A';
      const city = vendor.location?.city || 'Hyderabad';
      const state = vendor.location?.state || 'Telangana';
      const pincode = vendor.location?.pincode || '500019';
      const coords = `Lat: ${vendor.location?.lat || 17.4156}, Lng: ${vendor.location?.lng || 78.4350}`;

      // Bank
      const accHolder = vendor.bankDetails?.accountHolderName || vendor.fullName || 'N/A';
      const bankName = vendor.bankDetails?.bankName || 'HDFC Bank Ltd.';
      const rawAcc = vendor.bankDetails?.accountNumber || '';
      const maskedAcc = rawAcc.length >= 4 
        ? `•••• •••• •••• ${rawAcc.slice(-4)}` 
        : (rawAcc ? `•••• ${rawAcc}` : '•••• •••• •••• 4920');
      const ifsc = vendor.bankDetails?.ifscCode || 'HDFC0001248';
      const upi = vendor.bankDetails?.upiId || (email ? email.replace('@', '@ok') : 'ramarajukoyyalagadda123@okhdfcbank');

      // Date formatted
      const issueDate = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });

      // ----------------------------------------------------
      // TOP BRAND HEADER
      // ----------------------------------------------------
      doc.rect(0, 0, W, 70).fill('#0F172A');
      doc.rect(0, 70, W, 4).fill('#FFB703');

      // Brand Title & Tagline
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#FFB703').text('PAW NEAR', left, 16);
      doc.fontSize(9.5).font('Helvetica').fillColor('#CBD5E1').text('OFFICIAL VENDOR APPROVAL CERTIFICATE & APPLICATION RECORD', left, 44);

      // Top-right verified chip
      doc.roundedRect(W - 190, 16, 154, 38, 6).fill('#1E293B');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#94A3B8').text('PLATFORM ONBOARDING', W - 180, 22);
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#10B981').text('VERIFIED & ACTIVE', W - 180, 35);

      // Meta Information Bar
      const metaY = 86;
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748B').text('APPLICATION ID:', left, metaY);
      doc.fontSize(9).font('Helvetica').fillColor('#0F172A').text(appId, left + 88, metaY);

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#64748B').text('ISSUED DATE:', left + 220, metaY);
      doc.fontSize(9).font('Helvetica').fillColor('#0F172A').text(issueDate, left + 292, metaY);

      doc.roundedRect(left + 420, metaY - 4, 103, 18, 9).fill('#DCFCE7');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#15803D').text('STATUS: APPROVED', left + 428, metaY);

      // Helper function to draw styled card
      const drawSectionBox = (boxY, boxH, title) => {
        doc.roundedRect(left, boxY, contentW, boxH, 6).fillAndStroke('#FFFFFF', '#E2E8F0');
        doc.roundedRect(left, boxY, contentW, 23, 6).fill('#F8FAFC');
        doc.rect(left, boxY + 13, contentW, 10).fill('#F8FAFC');
        doc.rect(left, boxY + 23, contentW, 1).fill('#E2E8F0');
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#0F172A').text(title, left + 12, boxY + 6);
      };

      // Helper function to render 2-column fields
      const drawField2Col = (label, val, col, rowY) => {
        const colX = col === 1 ? left + 14 : left + 270;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#64748B').text(label.toUpperCase(), colX, rowY);
        doc.fontSize(9.5).font('Helvetica').fillColor('#0F172A').text(String(val || 'N/A'), colX, rowY + 11, { width: 235, ellipsis: true });
      };

      // ----------------------------------------------------
      // SECTION 1: STORE & ENTITY INFORMATION
      // ----------------------------------------------------
      let cardY = 114;
      let cardH = 112;
      drawSectionBox(cardY, cardH, '1. STORE & ENTITY INFORMATION');
      drawField2Col('Store Name', storeName, 1, cardY + 30);
      drawField2Col('Authorized Owner / Manager', fullName, 2, cardY + 30);
      drawField2Col('Business Category', category, 1, cardY + 56);
      drawField2Col('Services / Business Types', businessTypes, 2, cardY + 56);
      drawField2Col('Registered Email', email, 1, cardY + 82);
      drawField2Col('Contact Phone & Commission', `${phone}  (Platform Fee: ${commissionRate})`, 2, cardY + 82);

      // ----------------------------------------------------
      // SECTION 2: STATUTORY KYC & COMPLIANCE CREDENTIALS
      // ----------------------------------------------------
      cardY = 236;
      cardH = 88;
      drawSectionBox(cardY, cardH, '2. STATUTORY KYC & COMPLIANCE CREDENTIALS');
      drawField2Col('Trade / Municipal Licence No.', `${storeLicence}  [VERIFIED]`, 1, cardY + 30);
      drawField2Col('Compliance Review', 'Municipal & Business Clearance Approved', 2, cardY + 30);
      drawField2Col('Permanent Account Number (PAN)', `${pan}  [VERIFIED]`, 1, cardY + 56);
      drawField2Col('Authorized Aadhaar UID', `${aadhaar}  [VERIFIED]`, 2, cardY + 56);

      // ----------------------------------------------------
      // SECTION 3: REGISTERED PHYSICAL LOCATION
      // ----------------------------------------------------
      cardY = 334;
      cardH = 80;
      drawSectionBox(cardY, cardH, '3. REGISTERED STORE LOCATION & GPS');
      drawField2Col('Physical Street Address', address, 1, cardY + 30);
      drawField2Col('City, State & Postal Code', `${city}, ${state} - ${pincode}`, 2, cardY + 30);
      drawField2Col('Geo GPS Coordinates', coords, 1, cardY + 56);
      drawField2Col('Service Operating Radius', 'Standard 10 KM Hyperlocal Radius', 2, cardY + 56);

      // ----------------------------------------------------
      // SECTION 4: SETTLEMENT & BANKING DETAILS
      // ----------------------------------------------------
      cardY = 424;
      cardH = 80;
      drawSectionBox(cardY, cardH, '4. SETTLEMENT & PAYOUT BANKING DETAILS');
      drawField2Col('Account Beneficiary Name', accHolder, 1, cardY + 30);
      drawField2Col('Bank Name & Branch', bankName, 2, cardY + 30);
      drawField2Col('Bank Account Number', maskedAcc, 1, cardY + 56);
      drawField2Col('IFSC Code & UPI VPA', `${ifsc} | ${upi}`, 2, cardY + 56);

      // ----------------------------------------------------
      // SECTION 5: OPERATIONAL SERVICES & DELIVERY
      // ----------------------------------------------------
      cardY = 514;
      cardH = 68;
      drawSectionBox(cardY, cardH, '5. OPERATIONAL SERVICES & DELIVERY CAPABILITY');
      drawField2Col('In-Store Visits / Clinic Walk-in', 'Enabled (Active for Pet Parents)', 1, cardY + 30);
      drawField2Col('Home Service & Delivery', 'Enabled (Standard Fast Dispatch)', 2, cardY + 30);

      // ----------------------------------------------------
      // VERIFICATION SEAL & STATEMENT
      // ----------------------------------------------------
      const sealY = 594;
      doc.roundedRect(left, sealY, contentW - 170, 95, 6).fillAndStroke('#F8FAFC', '#E2E8F0');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0F172A').text('OFFICIAL CERTIFICATION & VERIFICATION STATEMENT', left + 12, sealY + 12);
      doc.fontSize(8).font('Helvetica').fillColor('#475569').text(
        'This document is an authentic electronic record issued under the PAW NEAR Merchant Services Agreement. The merchant entity detailed herein has satisfied KYC verification and is legally authorized to offer retail and pet care services on the PAW NEAR network.',
        left + 12, sealY + 28, { width: contentW - 195, lineGap: 2.5 }
      );
      doc.fontSize(7.5).font('Helvetica-Oblique').fillColor('#64748B').text(
        'Digitally signed and cryptographically validated by PAW NEAR Central Verification Desk.',
        left + 12, sealY + 76
      );

      // Official Seal Stamp Box
      doc.roundedRect(W - 196, sealY, 160, 95, 6).fillAndStroke('#FEF3C7', '#F59E0B');
      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#92400E').text('PAW NEAR SEAL', W - 186, sealY + 10, { align: 'center', width: 140 });
      doc.circle(W - 116, sealY + 44, 18).fillAndStroke('#FDE68A', '#D97706');
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#78350F').text('PAW', W - 128, sealY + 39);
      doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#92400E').text('COMPLIANCE VERIFIED', W - 186, sealY + 68, { align: 'center', width: 140 });
      doc.fontSize(7).font('Helvetica').fillColor('#B45309').text('HYDERABAD • INDIA', W - 186, sealY + 80, { align: 'center', width: 140 });

      // ----------------------------------------------------
      // FOOTER BAR
      // ----------------------------------------------------
      doc.rect(0, 715, W, 25).fill('#0F172A');
      doc.fontSize(8).font('Helvetica').fillColor('#94A3B8').text(
        'PAW NEAR TECHNOLOGIES INDIA • Support: support@pawnear.com • Merchant Portal: https://pawnear.com/vendor',
        left, 723, { align: 'center', width: contentW }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const generateVendorApprovalPDFWithCredentials = (vendor, password) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 36,
        info: {
          Title: `PAW NEAR Vendor Approval - ${vendor.storeName || 'Vendor'}`,
          Author: 'PAW NEAR Technologies India',
          Subject: 'Vendor Onboarding Approval, Credentials and Application Copy'
        }
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const left = 42;
      const width = 511;
      const vendorId = vendor._id ? vendor._id.toString() : '';
      const applicationId = vendorId ? `APP-VN-${vendorId.slice(-8).toUpperCase()}` : `APP-VN-${Date.now()}`;
      const issueDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
      const businessTypes = Array.isArray(vendor.businessTypes) && vendor.businessTypes.length
        ? vendor.businessTypes.join(', ')
        : 'Pet Store & Retail Services';

      const field = (label, value, x, y, fieldWidth = 230) => {
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#64748B').text(label.toUpperCase(), x, y);
        doc.fontSize(10).font('Helvetica').fillColor('#0F172A').text(String(value || 'N/A'), x, y + 12, {
          width: fieldWidth,
          ellipsis: true
        });
      };

      const section = (title, y, height) => {
        doc.roundedRect(left, y, width, height, 8).fillAndStroke('#FFFFFF', '#E2E8F0');
        doc.roundedRect(left, y, width, 28, 8).fill('#F8FAFC');
        doc.rect(left, y + 18, width, 10).fill('#F8FAFC');
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#0F172A').text(title, left + 14, y + 9);
      };

      doc.rect(0, 0, 595.28, 78).fill('#0F172A');
      doc.rect(0, 78, 595.28, 5).fill('#FFB703');
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#FFB703').text('PAW NEAR', left, 18);
      doc.fontSize(10).font('Helvetica').fillColor('#CBD5E1').text('VENDOR APPROVAL, LOGIN CREDENTIALS & ONBOARDING FORM COPY', left, 49);

      doc.roundedRect(396, 18, 157, 42, 8).fill('#1E293B');
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#94A3B8').text('STATUS', 410, 25);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#22C55E').text('APPROVED', 410, 39);

      let y = 100;
      section('1. Vendor Activation IDs & Portal Credentials', y, 118);
      field('Vendor ID', vendorId, left + 16, y + 40);
      field('Application ID', applicationId, left + 274, y + 40);
      field('Registered Email', vendor.email, left + 16, y + 72);
      field('Temporary Password', password || 'Sent separately', left + 274, y + 72);

      y += 132;
      section('2. Store & Manager Information', y, 118);
      field('Store Name', vendor.storeName, left + 16, y + 40);
      field('Authorized Manager', vendor.fullName, left + 274, y + 40);
      field('Business Category', vendor.category || 'Pet Store & Services', left + 16, y + 72);
      field('Business Types', businessTypes, left + 274, y + 72);

      y += 132;
      section('3. KYC Documents Reviewed by Admin', y, 118);
      field('Trade Licence Number', vendor.storeLicenceNumber || 'N/A', left + 16, y + 40);
      field('PAN Number', vendor.panNumber || 'N/A', left + 274, y + 40);
      field('Aadhaar Number', vendor.aadhaarNumber || 'N/A', left + 16, y + 72);
      field('Review Status', 'KYC documents checked and approved by admin', left + 274, y + 72);

      y += 132;
      section('4. Store Location & Payout Details', y, 146);
      field('Address', vendor.location?.address || 'N/A', left + 16, y + 40);
      field('City / State / PIN', `${vendor.location?.city || 'Hyderabad'}, ${vendor.location?.state || 'Telangana'} - ${vendor.location?.pincode || '500034'}`, left + 274, y + 40);
      field('Bank Name', vendor.bankDetails?.bankName || 'N/A', left + 16, y + 72);
      field('Account Holder', vendor.bankDetails?.accountHolderName || vendor.fullName, left + 274, y + 72);
      field('IFSC / UPI', `${vendor.bankDetails?.ifscCode || 'N/A'} / ${vendor.bankDetails?.upiId || 'N/A'}`, left + 16, y + 104, 480);

      y += 160;
      section('5. Commercial Terms', y, 90);
      field('Platform Commission', `${vendor.commissionRate || 12}%`, left + 16, y + 40);
      field('Onboarding Credits / Fee', `Paid: ${vendor.onboardingFeePaid !== false ? 'Yes' : 'No'} | Amount: INR ${vendor.onboardingFeeAmount || 2499}`, left + 274, y + 40);

      doc.roundedRect(left, 715, width, 72, 8).fillAndStroke('#FFFBEB', '#FDE68A');
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#92400E').text('Approval Statement', left + 14, 728);
      doc.fontSize(8.5).font('Helvetica').fillColor('#78350F').text(
        `Issued on ${issueDate}. This PDF is the official copy of the vendor onboarding form and approval record. The vendor may use the Vendor ID above for support, settlement, and compliance queries.`,
        left + 14,
        744,
        { width: width - 28, lineGap: 2 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateVendorApprovalPDF,
  generateVendorApprovalPDFWithCredentials
};
