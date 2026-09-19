const mongoose = require('mongoose');

const platformCmsSchema = new mongoose.Schema({
  // Announcement Top Bar
  topAnnouncement: {
    text: { type: String, default: '⚡ Lightning 30-Min Delivery on all pet essentials in your neighborhood!' },
    badge: { type: String, default: 'INSTANT' },
    linkText: { type: String, default: 'Shop Now' },
    link: { type: String, default: '/products' },
    isActive: { type: Boolean, default: true }
  },
  // Promotional Hero Banners
  heroBanners: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    subTitle: { type: String, default: '' },
    tag: { type: String, default: 'TRENDING' },
    image: { type: String, default: '/images/hero_pets.jpg' },
    link: { type: String, default: '/products' },
    ctaText: { type: String, default: 'Explore' },
    bgColor: { type: String, default: 'from-amber-400 to-amber-500' },
    isActive: { type: Boolean, default: true }
  }],
  featuredSections: {
    flashDealsEnabled: { type: Boolean, default: true },
    popularNearYouEnabled: { type: Boolean, default: true },
    homeServicesFeaturedEnabled: { type: Boolean, default: true },
    trendingCategoriesEnabled: { type: Boolean, default: true },
    emergencyVetBannerEnabled: { type: Boolean, default: true }
  },
  // Category Commissions Matrix (Section 3.2)
  categoryCommissions: {
    type: Map,
    of: Number,
    default: {
      'Pet Food & Nutrition': 10,
      'Pet Accessories & Toys': 15,
      'Pet Grooming & Spa': 18,
      'Veterinary Clinic & Health': 12,
      'Pet Boarding & Daycare': 15,
      'Pharmacy & Medicines': 8
    }
  },
  // Delivery Fee Rules
  deliveryPricing: {
    baseFee: { type: Number, default: 49 },
    freeDeliveryThreshold: { type: Number, default: 499 },
    perKmExtraFee: { type: Number, default: 12 },
    rainSurgeMultiplier: { type: Number, default: 1.2 }
  },
  // Onboarding Fees
  onboardingPricing: {
    vendorDepositFee: { type: Number, default: 2499 },
    verificationFee: { type: Number, default: 499 },
    waiveForFirstMonth: { type: Boolean, default: false }
  },
  // Active Coupons
  coupons: [{
    code: { type: String, required: true, uppercase: true },
    discountPercent: { type: Number, required: true },
    minOrderValue: { type: Number, default: 299 },
    maxDiscount: { type: Number, default: 150 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PlatformCMS', platformCmsSchema);
