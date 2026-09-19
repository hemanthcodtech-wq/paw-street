const express = require('express');
const router = express.Router();
const PlatformCMS = require('../models/PlatformCMS');

const defaultCms = {
  topAnnouncement: {
    text: 'PAW FEST 2026: Flat 20% OFF on pet food and services!',
    badge: 'OFFER',
    linkText: 'Claim Offer',
    link: '/products',
    isActive: true
  },
  heroBanners: [
    {
      id: 'BNR-01',
      title: 'Everything Your Pet Needs, Near You!',
      subTitle: 'Food, accessories, medicines and services delivered fast.',
      tag: 'FLASH DELIVERY',
      image: '/images/hero_pets.jpg',
      link: '/products',
      ctaText: 'Explore',
      bgColor: 'from-amber-400 to-amber-500',
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
  coupons: [
    {
      code: 'PAWFEST20',
      discountPercent: 20,
      minOrderValue: 799,
      maxDiscount: 300,
      description: '20% off on pet food and services',
      isActive: true
    }
  ]
};

router.get('/cms', async (req, res) => {
  try {
    const cms = await PlatformCMS.findOne().lean();
    res.json({
      success: true,
      cms: cms || defaultCms
    });
  } catch (error) {
    res.json({
      success: true,
      cms: defaultCms,
      fallback: true
    });
  }
});

module.exports = router;
