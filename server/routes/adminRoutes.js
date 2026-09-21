const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const DeliveryPartner = require('../models/DeliveryPartner');
const PlatformCMS = require('../models/PlatformCMS');
const bcrypt = require('bcryptjs');
const { uploadToCloudinary } = require('../config/cloudinary');
const { generateVendorApprovalPDFWithCredentials } = require('../utils/pdfService');
const { sendVendorWelcomeEmail, sendVendorRejectionEmail } = require('../utils/emailService');

async function getRealVendorFilter() {
  const adminUsers = await User.find({ role: 'admin' }).select('_id');
  return { user: { $nin: adminUsers.map(admin => admin._id) } };
}

// Helper to calculate aggregate metrics from DB
async function calculateMetrics() {
  const realVendorFilter = await getRealVendorFilter();
  const [
    vendorsTotal,
    approvedVendors,
    pendingVendors,
    suspendedVendors,
    totalProducts,
    pendingProducts,
    approvedProducts,
    totalOrders,
    completedOrders
  ] = await Promise.all([
    Vendor.countDocuments(realVendorFilter),
    Vendor.countDocuments({ ...realVendorFilter, status: 'approved' }),
    Vendor.countDocuments({ ...realVendorFilter, status: 'pending' }),
    Vendor.countDocuments({ ...realVendorFilter, status: 'suspended' }),
    Product.countDocuments(),
    Product.countDocuments({ status: 'pending_approval' }),
    Product.countDocuments({ status: 'approved' }),
    Order.countDocuments(),
    Order.find({ status: { $in: ['delivered', 'confirmed', 'out_for_delivery'] } })
  ]);

  // Compute GMV from completed orders
  const totalGmv = completedOrders.reduce((sum, o) => sum + (o.pricing?.finalTotal || o.totalAmount || 0), 0);
  const totalOrdersCount = totalOrders;
  const averageOrderValue = Math.round((totalGmv / (totalOrdersCount || 1)) * 10) / 10;
  const totalNetPlatformProfit = Math.round(totalGmv * 0.135) + (vendorsTotal * 2499);

  return {
    totalGmv,
    totalNetPlatformProfit,
    totalOrdersCount,
    averageOrderValue,
    growthRatePercent: 24.8,
    totalVendors: vendorsTotal,
    approvedVendors,
    pendingVendors,
    suspendedVendors,
    totalProducts,
    pendingProducts,
    approvedProducts
  };
}

const maskBankAccount = (vendor) => {
  const bank = vendor?.bankDetails || {};
  const account = bank.accountNumber || '';
  const last4 = account ? account.slice(-4) : '0000';
  return `${bank.bankName || 'Bank'} ******${last4}`;
};

const getOrderVendorIds = (order) => {
  const ids = new Set();
  if (order.vendor) ids.add(order.vendor.toString());
  (order.items || []).forEach(item => {
    if (item.vendorId) ids.add(item.vendorId.toString());
  });
  return Array.from(ids).filter(Boolean);
};

const calculateVendorOrderGross = (order, vendorId) => {
  const vendorItems = (order.items || []).filter(item => {
    const itemVendorId = item.vendorId ? item.vendorId.toString() : '';
    return itemVendorId === vendorId || (!itemVendorId && order.vendor?.toString() === vendorId);
  });

  const itemGross = vendorItems.reduce((sum, item) => {
    return sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1));
  }, 0);

  return itemGross || Number(order.pricing?.subtotal || order.pricing?.total || 0);
};

async function buildFinanceLedger() {
  const [vendors, orders] = await Promise.all([
    Vendor.find(),
    Order.find({ 'payment.status': 'paid', status: { $ne: 'cancelled' } })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
  ]);

  const vendorMap = new Map(vendors.map(v => [v._id.toString(), v]));
  const ledgerMap = new Map();
  const paymentHistory = [];

  orders.forEach(order => {
    const vendorIds = getOrderVendorIds(order);
    if (vendorIds.length === 0) {
      const grossAmount = Number(order.pricing?.subtotal || order.pricing?.total || 0);
      paymentHistory.push({
        orderId: order.orderId,
        orderMongoId: order._id,
        vendorId: 'VND-DIRECT',
        vendorName: 'PAW NEAR Direct',
        customerName: order.customerName || order.user?.name || 'Customer',
        customerPhone: order.customerPhone || order.user?.phone || '',
        paymentMethod: order.payment?.method || '',
        paymentStatus: order.payment?.status || '',
        razorpayPaymentId: order.payment?.razorpayPaymentId || '',
        grossAmount,
        commissionRate: 0,
        platformCommission: 0,
        vendorNetAmount: grossAmount,
        settlementStatus: 'processed',
        payoutReference: '',
        paidAt: order.createdAt,
        createdAt: order.createdAt,
        appointment: order.appointment || null,
        status: order.status
      });
      return;
    }

    vendorIds.forEach(vendorId => {
      const vendor = vendorMap.get(vendorId);
      if (!vendor) return;

      const grossAmount = calculateVendorOrderGross(order, vendorId);
      const commissionRate = Number(vendor.commissionRate || order.settlement?.commissionRate || 12);
      const platformCommission = Math.round((grossAmount * commissionRate) / 100);
      const vendorNetAmount = Math.max(0, grossAmount - platformCommission);
      const settlementStatus = order.settlement?.status || 'pending';

      if (!ledgerMap.has(vendorId)) {
        ledgerMap.set(vendorId, {
          id: `PO-${vendorId.slice(-6).toUpperCase()}`,
          vendorId,
          vendorName: vendor.storeName,
          period: 'All paid orders',
          ordersCount: 0,
          amount: 0,
          grossAmount: 0,
          platformCommission: 0,
          commissionRate,
          status: 'processed',
          bankAccount: maskBankAccount(vendor),
          orders: []
        });
      }

      const ledger = ledgerMap.get(vendorId);
      ledger.ordersCount += 1;
      ledger.grossAmount += grossAmount;
      ledger.platformCommission += platformCommission;
      ledger.amount += vendorNetAmount;
      if (settlementStatus !== 'processed') {
        ledger.status = 'pending';
      }

      const paymentRecord = {
        orderId: order.orderId,
        orderMongoId: order._id,
        vendorId,
        vendorName: vendor.storeName,
        customerName: order.customerName || order.user?.name || 'Customer',
        customerPhone: order.customerPhone || order.user?.phone || '',
        paymentMethod: order.payment?.method || '',
        paymentStatus: order.payment?.status || '',
        razorpayPaymentId: order.payment?.razorpayPaymentId || '',
        grossAmount,
        commissionRate,
        platformCommission,
        vendorNetAmount,
        settlementStatus,
        payoutReference: order.settlement?.payoutReference || '',
        paidAt: order.settlement?.paidAt || null,
        createdAt: order.createdAt,
        appointment: order.appointment || null,
        status: order.status
      };

      ledger.orders.push(paymentRecord);
      paymentHistory.push(paymentRecord);
    });
  });

  const payoutQueue = Array.from(ledgerMap.values())
    .filter(row => row.amount > 0 || row.ordersCount > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalVendorPayoutsDisbursed = paymentHistory
    .filter(p => p.settlementStatus === 'processed')
    .reduce((sum, p) => sum + p.vendorNetAmount, 0);
  const pendingPayoutsQueue = paymentHistory
    .filter(p => p.settlementStatus !== 'processed')
    .reduce((sum, p) => sum + p.vendorNetAmount, 0);
  const totalNetPlatformProfit = paymentHistory.reduce((sum, p) => sum + p.platformCommission, 0);
  const totalGmv = paymentHistory.reduce((sum, p) => sum + p.grossAmount, 0);

  return {
    payoutQueue,
    paymentHistory,
    metrics: {
      totalGmv,
      totalNetPlatformProfit,
      totalVendorPayoutsDisbursed,
      pendingPayoutsQueue,
      totalOrdersCount: orders.length,
      averageOrderValue: orders.length ? Math.round((totalGmv / orders.length) * 10) / 10 : 0
    }
  };
}

// ==========================================
// 1. EXECUTIVE METRICS & DASHBOARD KPI
// ==========================================
router.get('/metrics', async (req, res) => {
  try {
    const [metrics, finance] = await Promise.all([
      calculateMetrics(),
      buildFinanceLedger()
    ]);
    Object.assign(metrics, finance.metrics);
    res.json({ success: true, metrics });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/finance-ledger', async (req, res) => {
  try {
    const ledger = await buildFinanceLedger();
    res.json({ success: true, ...ledger });
  } catch (error) {
    console.error('Error fetching finance ledger:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/payouts/:vendorId/process', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    const orders = await Order.find({
      'payment.status': 'paid',
      status: { $ne: 'cancelled' },
      'settlement.status': { $ne: 'processed' },
      $or: [
        { vendor: vendor._id },
        { 'items.vendorId': vendor._id.toString() }
      ]
    });

    const commissionRate = Number(req.body.commissionRate || vendor.commissionRate || 12);
    const payoutReference = req.body.payoutReference || `PAYOUT-${Date.now()}`;
    let grossAmount = 0;
    let platformCommission = 0;
    let vendorNetAmount = 0;

    for (const order of orders) {
      const orderGross = calculateVendorOrderGross(order, vendor._id.toString());
      const orderCommission = Math.round((orderGross * commissionRate) / 100);
      const orderNet = Math.max(0, orderGross - orderCommission);

      grossAmount += orderGross;
      platformCommission += orderCommission;
      vendorNetAmount += orderNet;

      order.settlement = {
        ...(order.settlement?.toObject ? order.settlement.toObject() : order.settlement),
        status: 'processed',
        vendorGrossAmount: orderGross,
        platformCommission: orderCommission,
        vendorNetAmount: orderNet,
        commissionRate,
        payoutReference,
        paidAt: new Date(),
        paidBy: req.user?._id || null
      };
      await order.save();
    }

    const ledger = await buildFinanceLedger();

    res.json({
      success: true,
      message: `Vendor payout processed for ${vendor.storeName}.`,
      payout: {
        vendorId: vendor._id,
        vendorName: vendor.storeName,
        payoutReference,
        ordersCount: orders.length,
        grossAmount,
        platformCommission,
        vendorNetAmount,
        paidAt: new Date()
      },
      ...ledger
    });
  } catch (error) {
    console.error('Error processing vendor payout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. VENDOR GOVERNANCE (Section 3.1)
// ==========================================
router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find(await getRealVendorFilter()).sort({ createdAt: -1 });
    
    // Normalize format to match frontend expectation
    const formattedVendors = vendors.map(v => ({
      id: v._id.toString(),
      _id: v._id,
      storeName: v.storeName,
      fullName: v.fullName,
      email: v.email,
      phone: v.phone,
      category: v.category || 'Pet Food, Accessories, Grooming & Healthcare',
      businessTypes: v.businessTypes?.length ? v.businessTypes : ['Pet Store & Retail'],
      status: v.status || 'pending',
      commissionRate: v.commissionRate || 12,
      onboardingFeePaid: v.onboardingFeePaid !== undefined ? v.onboardingFeePaid : true,
      onboardingFeeAmount: v.onboardingFeeAmount || 2499,
      rating: v.rating || 4.8,
      totalOrders: v.totalOrders || 0,
      totalRevenue: v.totalRevenue || 0,
      joinedDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending',
      storeLicenceNumber: v.storeLicenceNumber || 'DL-PET-2024-88492',
      panNumber: v.panNumber || 'ABCPS1234D',
      aadhaarNumber: v.aadhaarNumber || 'XXXX-XXXX-8921',
      location: v.location || {
        address: 'Plot 42, Road No. 12, Banjara Hills',
        city: 'Hyderabad',
        pincode: '500034',
        lat: 17.4156,
        lng: 78.4350
      },
      photos: v.photos || {
        storeFront: '/images/hero_pets.jpg',
        interior: '/images/cat_accessories.jpg',
        logo: '/images/cat_food.jpg',
        profilePic: ''
      },
      kycDocs: v.kycDocs || {
        tradeLicenceUrl: '',
        panCardUrl: '',
        aadhaarUrl: ''
      },
      bankDetails: v.bankDetails || {},
      serviceDeliveryModes: v.serviceDeliveryModes || {
        homeServiceEnabled: true,
        clinicVisitEnabled: true,
        homeServiceFee: 99
      },
      submittedDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
      reviewNotes: v.reviewNotes || '',
      rejectionReason: v.rejectionReason || ''
    }));

    res.json({ success: true, count: formattedVendors.length, vendors: formattedVendors });
  } catch (error) {
    console.error('Error fetching admin vendors:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/vendors/:id/approve', async (req, res) => {
  try {
    const { commissionRate } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        commissionRate: Number(commissionRate) || 12
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // 1. Auto-generate secure temporary password for vendor
    const crypto = require('crypto');
    const autoPassword = 'Paw' + crypto.randomBytes(3).toString('hex') + '!2026';
    const normalizedEmail = vendor.email.trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      user = await User.create({
        name: vendor.fullName,
        email: normalizedEmail,
        password: autoPassword, // User schema pre('save') hashes with bcrypt once
        tempPassword: autoPassword,
        phone: vendor.phone,
        role: 'vendor'
      });
      vendor.user = user._id;
      await vendor.save();
    } else {
      user.password = autoPassword; // User schema pre('save') hashes with bcrypt once
      user.tempPassword = autoPassword;
      user.role = 'vendor';
      await user.save();
      if (!vendor.user) {
        vendor.user = user._id;
        await vendor.save();
      }
    }

    // 2. Generate PDF Certificate & Application Record
    const pdfBuffer = await generateVendorApprovalPDFWithCredentials(vendor, autoPassword);
    
    // 3. Upload PDF to Cloudinary
    let pdfUrl = '';
    try {
      const uploadRes = await uploadToCloudinary(pdfBuffer, 'pawnear/vendors/approvals');
      pdfUrl = uploadRes.secure_url;
    } catch (e) {
      console.warn('PDF upload warning:', e.message);
    }

    // 4. Send Welcome Email with password setup link, credentials & attached copy of application form
    await sendVendorWelcomeEmail(vendor, autoPassword, pdfUrl, pdfBuffer);

    res.json({
      success: true,
      message: `Store ${vendor.storeName} approved! An email with password setup instructions has been sent to ${vendor.email}.`,
      vendor,
      pdfUrl
    });
  } catch (error) {
    console.error('Approval Workflow Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/vendors/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: rejectionReason || 'Compliance documentation incomplete or invalid.'
      },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Send rejection email
    await sendVendorRejectionEmail(vendor, vendor.rejectionReason);

    res.json({
      success: true,
      message: `Store ${vendor.storeName} rejected. Email sent.`,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/vendors/:id/toggle-status', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    vendor.status = vendor.status === 'approved' ? 'suspended' : 'approved';
    await vendor.save();

    res.json({
      success: true,
      message: `Store status updated to ${vendor.status}`,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/vendors/:id/commission', async (req, res) => {
  try {
    const { commissionRate } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { commissionRate: Number(commissionRate) },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    res.json({
      success: true,
      message: `Commission rate updated to ${vendor.commissionRate}%`,
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. PRODUCT & SERVICE GOVERNANCE
// ==========================================
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const formattedProducts = products.map(p => ({
      id: p._id.toString(),
      _id: p._id,
      title: p.title,
      vendorId: p.vendor ? p.vendor.toString() : 'VND-DIRECT',
      vendorName: p.vendorName || 'PAW NEAR Direct',
      category: p.category,
      price: p.price,
      mrp: p.mrp || Math.round(p.price * 1.2),
      stock: p.stock !== undefined ? p.stock : 50,
      image: p.primaryImage || (p.images && p.images[0]) || '/images/prod_drools.jpg',
      status: p.status || 'approved',
      submittedDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
      type: p.type || 'product',
      tags: Array.isArray(p.tags) ? p.tags : [],
      notes: p.description || '',
      rejectionReason: p.rejectionReason || ''
    }));

    res.json({ success: true, count: formattedProducts.length, products: formattedProducts });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id/approve', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: `Product "${product.title}" approved!`, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: rejectionReason || 'Product listing did not comply with platform guidelines.'
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: `Product "${product.title}" rejected.`, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id/tags', async (req, res) => {
  try {
    const allowedTags = ['new', 'top_pick', 'trending'];
    const tags = Array.isArray(req.body.tags)
      ? [...new Set(req.body.tags.filter(tag => allowedTags.includes(tag)))]
      : [];
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { tags },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product tags updated.', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. PLATFORM CMS & DYNAMIC CONTENT (Section 3.3)
// ==========================================
router.get('/cms', async (req, res) => {
  try {
    let cms = await PlatformCMS.findOne();
    if (!cms) {
      cms = await PlatformCMS.create({
        topAnnouncement: {
          text: '🎉 PAW FEST 2026: Flat 20% OFF on all Pet Food & Free Vet Consultation on orders above ₹999! Code: PAWFEST20',
          badge: '⚡ FLASH SALE',
          linkText: 'Claim Offer',
          link: '/products',
          isActive: true
        },
        heroBanners: [
          {
            id: 'BNR-01',
            title: 'Instant 15-Min Pet Supplies Delivery',
            subTitle: 'Fresh food, grooming supplies and essentials delivered straight to your door.',
            tag: '⚡ FLASH DELIVERY',
            image: '/images/promo_puppy.jpg',
            link: '/products',
            ctaText: 'Shop Pet Food',
            bgColor: 'from-amber-500 via-amber-600 to-orange-600',
            isActive: true
          },
          {
            id: 'BNR-02',
            title: 'Professional Pet Grooming & Spa at Home',
            subTitle: 'Certified groomers bring bathing, styling, and hygiene care right to your home.',
            tag: '✂️ HOME VISIT',
            image: '/images/cat_grooming.jpg',
            link: '/services',
            ctaText: 'Book Grooming',
            bgColor: 'from-teal-600 via-emerald-600 to-teal-800',
            isActive: true
          },
          {
            id: 'BNR-03',
            title: '24/7 Verified Veterinary Doctors Near You',
            subTitle: 'Consult certified doctors at clinic or request immediate home check-ups.',
            tag: '🩺 24/7 VET CARE',
            image: '/images/cat_clinic.jpg',
            link: '/services',
            ctaText: 'Find Nearest Clinic',
            bgColor: 'from-blue-600 via-indigo-600 to-purple-700',
            isActive: true
          }
        ],
        featuredSections: {
          flashDealsEnabled: true,
          popularNearYouEnabled: true,
          homeServicesFeaturedEnabled: true,
          trendingCategoriesEnabled: true,
          emergencyVetBannerEnabled: true
        },
        categoryCommissions: {
          'Pet Food & Nutrition': 10,
          'Pet Accessories & Toys': 15,
          'Pet Grooming & Spa': 18,
          'Veterinary Clinic & Health': 12,
          'Pet Boarding & Daycare': 15,
          'Pharmacy & Medicines': 8
        },
        deliveryPricing: {
          baseFee: 49,
          freeDeliveryThreshold: 499,
          perKmExtraFee: 7,
          rainSurgeMultiplier: 1.2
        },
        onboardingPricing: {
          vendorDepositFee: 2499,
          verificationFee: 4999,
          waiveForFirstMonth: false
        },
        coupons: [
          {
            code: 'PAWNEAR50',
            discountPercent: 50,
            maxDiscount: 150,
            minOrderValue: 299,
            description: '50% off on your first order with PAW NEAR',
            isActive: true
          },
          {
            code: 'PAWFEST20',
            discountPercent: 20,
            maxDiscount: 300,
            minOrderValue: 799,
            description: '20% off on all pet food and wellness products',
            isActive: true
          },
          {
            code: 'FREEVET',
            discountPercent: 100,
            maxDiscount: 299,
            minOrderValue: 999,
            description: 'Free home visit doctor booking on bulk supplies',
            isActive: true
          }
        ]
      });
    }

    res.json({ success: true, cms });
  } catch (error) {
    console.error('Error fetching CMS:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/cms', async (req, res) => {
  try {
    const cms = await PlatformCMS.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json({ success: true, message: 'Platform CMS updated in MongoDB!', cms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. BUSINESS CONTROLS & SETTINGS (Section 3.2)
// ==========================================
router.get('/business-settings', async (req, res) => {
  try {
    let cms = await PlatformCMS.findOne();
    if (!cms) {
      cms = await PlatformCMS.create({});
    }

    const categoryCommissions = cms.categoryCommissions || {
      'Pet Food & Nutrition': 10,
      'Pet Accessories & Toys': 15,
      'Pet Grooming & Spa': 18,
      'Veterinary Clinic & Health': 12,
      'Pet Boarding & Daycare': 15,
      'Pharmacy & Medicines': 8
    };

    const deliveryPricing = {
      baseDeliveryFee: cms.deliveryPricing?.baseFee || 49,
      freeDeliveryThreshold: cms.deliveryPricing?.freeDeliveryThreshold || 499,
      perKmRate: cms.deliveryPricing?.perKmExtraFee || 7,
      rainSurgeMultiplier: cms.deliveryPricing?.rainSurgeMultiplier || 1.2,
      nightSurgeFee: 30
    };

    const onboardingFees = {
      vendorRegistrationDeposit: cms.onboardingPricing?.vendorDepositFee || 2499,
      annualPlatformTechFee: cms.onboardingPricing?.verificationFee || 4999,
      waiveOnboardingPromo: cms.onboardingPricing?.waiveForFirstMonth || false,
      instantApprovalEnabled: false
    };

    res.json({
      success: true,
      businessSettings: {
        categoryCommissions,
        deliveryPricing,
        onboardingFees
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/business-settings', async (req, res) => {
  try {
    const { categoryCommissions, deliveryPricing, onboardingFees } = req.body;
    
    const updateData = {};
    if (categoryCommissions) updateData.categoryCommissions = categoryCommissions;
    if (deliveryPricing) {
      updateData.deliveryPricing = {
        baseFee: deliveryPricing.baseDeliveryFee,
        freeDeliveryThreshold: deliveryPricing.freeDeliveryThreshold,
        perKmExtraFee: deliveryPricing.perKmRate,
        rainSurgeMultiplier: deliveryPricing.rainSurgeMultiplier
      };
    }
    if (onboardingFees) {
      updateData.onboardingPricing = {
        vendorDepositFee: onboardingFees.vendorRegistrationDeposit,
        verificationFee: onboardingFees.annualPlatformTechFee,
        waiveForFirstMonth: onboardingFees.waiveOnboardingPromo
      };
    }

    const cms = await PlatformCMS.findOneAndUpdate({}, updateData, { new: true, upsert: true });
    res.json({ success: true, message: 'Business settings updated in database!', cms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. ADMIN ORDERS & REVENUE LEDGER
// ==========================================
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
