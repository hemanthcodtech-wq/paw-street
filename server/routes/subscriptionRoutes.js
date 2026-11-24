const express = require('express');
const router = express.Router();
const VendorSubscription = require('../models/VendorSubscription');
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/authMiddleware');

const SELLER_PLANS = [
  {
    id: 'basic',
    name: 'Starter Pet Seller',
    tagline: 'Ideal for local neighborhood pet shops & home breeders starting out',
    monthlyPrice: 0,
    yearlyPrice: 0,
    commissionRate: 12,
    maxProducts: 20,
    isVerifiedBadge: false,
    priorityListing: false,
    features: [
      'List up to 20 Pet Products or Services',
      'Hyperlocal 15-Minute Delivery Integration',
      'Standard Vendor Dashboard & Inventory Sync',
      '12% Platform Transaction Fee',
      'Weekly Automated Payouts'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Verified Pet Store',
    tagline: 'Best for growing retail stores, pet pharmacies & busy grooming salons',
    monthlyPrice: 1499,
    yearlyPrice: 14999,
    commissionRate: 7,
    maxProducts: 150,
    isVerifiedBadge: true,
    priorityListing: true,
    popular: true,
    features: [
      'List up to 150 Products / Healthcare Spares',
      'Reduced 7% Platform Commission (Save 40%)',
      '🌟 "Verified Pro Seller" Golden Trust Badge',
      'Priority Placement on Customer Nearby Searches',
      'Daily 24-Hour Settlement Disbursement',
      'Direct WhatsApp Customer Chat Support'
    ]
  },
  {
    id: 'elite',
    name: 'Elite Superstore & Kennel Franchise',
    tagline: 'For high-volume pet brands, certified kennel clubs & veterinary hospitals',
    monthlyPrice: 2999,
    yearlyPrice: 29999,
    commissionRate: 3,
    maxProducts: 9999,
    isVerifiedBadge: true,
    priorityListing: true,
    features: [
      'Unlimited Catalog Products & Services',
      'Ultra-Low 3% Platform Commission Rate',
      '👑 Homepage "Featured Brand of the Week" Banner',
      'Dedicated Account Manager & Bulk Order Leads',
      'Custom Delivery Radius Expansion (up to 30km)',
      'Free Marketing SMS Blasts to Local Pet Parents'
    ]
  }
];

// @route   GET /api/subscriptions/plans
// @desc    Get all available seller plans
router.get('/plans', (req, res) => {
  res.json({ success: true, count: SELLER_PLANS.length, plans: SELLER_PLANS });
});

// @route   POST /api/subscriptions/upgrade
// @desc    Upgrade or renew vendor subscription plan
router.post('/upgrade', async (req, res) => {
  try {
    const { vendorId, planId, billingInterval, paymentMethod } = req.body;
    const plan = SELLER_PLANS.find(p => p.id === planId) || SELLER_PLANS[1];

    let vendor = null;
    if (vendorId) {
      vendor = await Vendor.findById(vendorId);
    } else {
      vendor = await Vendor.findOne();
    }

    const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const months = billingInterval === 'yearly' ? 12 : 1;
    const endDate = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

    const subscription = await VendorSubscription.create({
      vendor: vendor?._id || new require('mongoose').Types.ObjectId(),
      storeName: vendor?.storeName || 'My Pet Store',
      planId: plan.id,
      planName: plan.name,
      price,
      interval: billingInterval || 'monthly',
      commissionRate: plan.commissionRate,
      maxProducts: plan.maxProducts,
      isVerifiedSellerBadge: plan.isVerifiedBadge,
      priorityListing: plan.priorityListing,
      features: plan.features,
      endDate,
      status: 'active',
      paymentDetails: {
        razorpayOrderId: `sub_ord_${Date.now()}`,
        razorpayPaymentId: `pay_${Date.now()}`,
        amountPaid: price,
        paidAt: new Date()
      }
    });

    if (vendor) {
      vendor.commissionRate = plan.commissionRate;
      await vendor.save();
    }

    res.status(201).json({
      success: true,
      message: `🎉 Store successfully upgraded to ${plan.name}! Commission reduced to ${plan.commissionRate}%.`,
      subscription
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/subscriptions/current
// @desc    Get active subscription for vendor
router.get('/current', async (req, res) => {
  try {
    const vendorId = req.query.vendorId;
    let query = { status: 'active' };
    if (vendorId) query.vendor = vendorId;

    let sub = await VendorSubscription.findOne(query).sort({ createdAt: -1 });
    if (!sub) {
      sub = {
        planId: 'basic',
        planName: 'Starter Pet Seller (Default)',
        commissionRate: 12,
        maxProducts: 20,
        isVerifiedSellerBadge: false,
        status: 'active',
        features: SELLER_PLANS[0].features
      };
    }
    res.json({ success: true, subscription: sub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
