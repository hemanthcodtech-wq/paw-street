import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AdminContext = createContext();

const cmsToPlatformContent = (cms, fallback) => ({
  ...fallback,
  announcementBar: {
    enabled: cms?.topAnnouncement?.isActive !== false,
    text: cms?.topAnnouncement?.text || fallback.announcementBar.text,
    linkText: cms?.topAnnouncement?.linkText || cms?.topAnnouncement?.badge || fallback.announcementBar.linkText,
    linkUrl: cms?.topAnnouncement?.link || fallback.announcementBar.linkUrl
  },
  heroBanners: Array.isArray(cms?.heroBanners) && cms.heroBanners.length > 0
    ? cms.heroBanners.map((b, index) => ({
        id: b.id || `BNR-${String(index + 1).padStart(2, '0')}`,
        title: b.title || '',
        subtitle: b.subTitle || b.subtitle || '',
        badge: b.tag || b.badge || 'Featured',
        tagline: b.tagline || 'PAW PROMO',
        ctaText: b.ctaText || 'Explore',
        ctaLink: b.link || b.ctaLink || '/products',
        bgGradient: b.bgColor || b.bgGradient || 'from-amber-500 via-amber-600 to-orange-600',
        image: b.image || '/images/promo_puppy.jpg',
        isActive: b.isActive !== false,
        order: b.order || index + 1
      }))
    : fallback.heroBanners,
  featuredSections: {
    ...fallback.featuredSections,
    ...(cms?.featuredSections || {})
  },
  promoCoupons: Array.isArray(cms?.coupons)
    ? cms.coupons.map((c, index) => ({
        id: c._id || c.id || `CPN-${String(index + 1).padStart(2, '0')}`,
        code: c.code || '',
        discountPercent: Number(c.discountPercent) || 0,
        maxDiscount: Number(c.maxDiscount) || 0,
        minOrderValue: Number(c.minOrderValue) || 0,
        description: c.description || `${c.discountPercent || 0}% off on eligible orders`,
        isActive: c.isActive !== false
      }))
    : fallback.promoCoupons
});

const platformContentToCmsPayload = (content) => ({
  topAnnouncement: {
    text: content.announcementBar.text,
    badge: content.announcementBar.linkText || 'Claim Offer',
    linkText: content.announcementBar.linkText || 'Claim Offer',
    link: content.announcementBar.linkUrl || '/products',
    isActive: content.announcementBar.enabled !== false
  },
  heroBanners: (content.heroBanners || []).map((b, index) => ({
    id: b.id || `BNR-${String(index + 1).padStart(2, '0')}`,
    title: b.title,
    subTitle: b.subtitle,
    tag: b.badge,
    image: b.image || '/images/promo_puppy.jpg',
    link: b.ctaLink || '/products',
    ctaText: b.ctaText || 'Explore',
    bgColor: b.bgGradient || 'from-amber-500 via-amber-600 to-orange-600',
    isActive: b.isActive !== false
  })),
  featuredSections: content.featuredSections || {},
  coupons: (content.promoCoupons || []).map(c => ({
    code: String(c.code || '').toUpperCase(),
    discountPercent: Number(c.discountPercent) || 0,
    maxDiscount: Number(c.maxDiscount) || 0,
    minOrderValue: Number(c.minOrderValue) || 0,
    description: c.description || '',
    isActive: c.isActive !== false
  }))
});

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }) {
  // Current Admin User Session
  const [adminUser, setAdminUser] = useState({
    id: 'ADM-001',
    name: 'Vikramaditya Rao',
    email: 'admin@pawnear.com',
    role: 'Super Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    permissions: ['all']
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------------------------------
  // 3.1 VENDOR GOVERNANCE STATE & DATA
  // ----------------------------------------------------
  const [vendors, setVendors] = useState([]);

  // ----------------------------------------------------
  // 3.1 PRODUCT & SERVICE GOVERNANCE STATE & DATA
  // ----------------------------------------------------
  const [productsGovernance, setProductsGovernance] = useState([]);

  // ----------------------------------------------------
  // 3.2 REVENUE & BUSINESS CONTROLS STATE & DATA
  // ----------------------------------------------------
  const [businessSettings, setBusinessSettings] = useState({
    categoryCommissions: {
      'Pet Food & Nutrition': 10,
      'Pet Accessories & Toys': 15,
      'Pet Grooming & Spa': 18,
      'Veterinary Clinic & Health': 12,
      'Pet Boarding & Daycare': 15,
      'Pharmacy & Medicines': 8
    },
    deliveryPricing: {
      baseDeliveryFee: 49,
      freeDeliveryThreshold: 499,
      perKmRate: 7,
      rainSurgeMultiplier: 1.2,
      nightSurgeFee: 30
    },
    onboardingFees: {
      vendorRegistrationDeposit: 2499,
      annualPlatformTechFee: 4999,
      waiveOnboardingPromo: false,
      instantApprovalEnabled: false
    }
  });

  // Platform Financial Metrics
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalGmv: 0,
    totalNetPlatformProfit: 0,
    totalOrdersCount: 0,
    totalVendorPayoutsDisbursed: 0,
    pendingPayoutsQueue: 0,
    averageOrderValue: 0,
    growthRatePercent: 0,
    totalVendors: 0,
    approvedVendors: 0,
    pendingVendors: 0,
    suspendedVendors: 0,
    totalProducts: 0,
    pendingProducts: 0,
    approvedProducts: 0,
    openTickets: 0
  });

  // Vendor Payouts Queue
  const [payoutQueue, setPayoutQueue] = useState([
    {
      id: 'PO-8821',
      vendorId: 'VND-101',
      vendorName: 'Paws & Whiskers Supermart',
      amount: 48920,
      period: '25 Aug - 31 Aug',
      ordersCount: 94,
      status: 'pending',
      bankAccount: 'HDFC Bank ••••••4920'
    },
    {
      id: 'PO-8820',
      vendorId: 'VND-102',
      vendorName: 'Royal Pet Grooming & Spa Hub',
      amount: 29450,
      period: '25 Aug - 31 Aug',
      ordersCount: 48,
      status: 'pending',
      bankAccount: 'ICICI Bank ••••••8812'
    },
    {
      id: 'PO-8819',
      vendorId: 'VND-101',
      vendorName: 'Paws & Whiskers Supermart',
      amount: 52100,
      period: '18 Aug - 24 Aug',
      ordersCount: 106,
      status: 'processed',
      bankAccount: 'HDFC Bank ••••••4920'
    }
  ]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [riderEarnings, setRiderEarnings] = useState([]);

  // ----------------------------------------------------
  // 3.3 PLATFORM CONTROL & DYNAMIC CMS STATE & DATA
  // ----------------------------------------------------
  const [platformContent, setPlatformContent] = useState({
    announcementBar: {
      enabled: true,
      text: '🎉 PAW FEST 2026: Flat 20% OFF on all Pet Food & Free Vet Consultation on orders above ₹999! Code: PAWFEST20',
      linkText: 'Claim Offer',
      linkUrl: '/products'
    },
    heroBanners: [
      {
        id: 'BNR-01',
        title: 'Instant 15-Min Pet Supplies Delivery',
        subtitle: 'Fresh food, grooming supplies and essentials delivered straight to your door.',
        badge: '⚡ FLASH DELIVERY',
        tagline: 'PAW QUICK 15m',
        ctaText: 'Shop Pet Food',
        ctaLink: '/products',
        bgGradient: 'from-amber-500 via-amber-600 to-orange-600',
        image: '/images/promo_puppy.jpg',
        isActive: true,
        order: 1
      },
      {
        id: 'BNR-02',
        title: 'Professional Pet Grooming & Spa at Home',
        subtitle: 'Certified groomers bring bathing, styling, and hygiene care right to your home.',
        badge: '✂️ HOME VISIT',
        tagline: 'LUXURY PET SPA',
        ctaText: 'Book Grooming',
        ctaLink: '/services',
        bgGradient: 'from-teal-600 via-emerald-600 to-teal-800',
        image: '/images/promo_banner_main.jpg',
        isActive: true,
        order: 2
      },
      {
        id: 'BNR-03',
        title: '24/7 Verified Veterinary Doctors Near You',
        subtitle: 'Consult certified doctors at clinic or request immediate home check-ups.',
        badge: '🩺 24/7 VET CARE',
        tagline: 'CLINIC & HOME VISITS',
        ctaText: 'Find Nearest Clinic',
        ctaLink: '/services',
        bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
        image: '/images/store_vet.jpg',
        isActive: true,
        order: 3
      }
    ],
    featuredSections: {
      flashDealsEnabled: true,
      popularNearYouEnabled: true,
      homeServicesFeaturedEnabled: true,
      trendingCategoriesEnabled: true,
      emergencyVetBannerEnabled: true
    },
    promoCoupons: [
      {
        id: 'CPN-01',
        code: 'PAWNEAR50',
        discountPercent: 50,
        maxDiscount: 150,
        minOrderValue: 299,
        description: '50% off on your first order with PAW NEAR',
        isActive: true
      },
      {
        id: 'CPN-02',
        code: 'PAWFEST20',
        discountPercent: 20,
        maxDiscount: 300,
        minOrderValue: 799,
        description: '20% off on all pet food and wellness products',
        isActive: true
      },
      {
        id: 'CPN-03',
        code: 'FREEVET',
        discountPercent: 100,
        maxDiscount: 299,
        minOrderValue: 999,
        description: 'Free home visit doctor booking on bulk supplies',
        isActive: true
      }
    ]
  });

  // ====================================================
  // FETCH ALL ADMIN DATA DIRECTLY FROM MONGODB ATLAS
  // ====================================================
  const clearAdminSession = useCallback(() => {
    localStorage.removeItem('paw_admin_token');
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('paw_user') || 'null');
    } catch (e) {}
    if (user?.role === 'admin') {
      localStorage.removeItem('paw_user');
      localStorage.removeItem('paw_token');
    }
    setIsAuthenticated(false);
  }, []);

  const validateAdminSession = useCallback(async () => {
    const token = localStorage.getItem('paw_admin_token');
    if (!token) {
      setIsAuthChecking(false);
      clearAdminSession();
      return false;
    }

    try {
      const res = await api.getProfile();
      const profile = res?.user || res?.data;
      if (res?.success && profile?.role === 'admin') {
        setIsAuthenticated(true);
        setAdminUser(prev => ({
          ...prev,
          id: profile.id || profile._id || prev.id,
          name: profile.name || prev.name,
          email: profile.email || prev.email,
          avatar: profile.avatar || prev.avatar
        }));
        localStorage.setItem('paw_user', JSON.stringify({ ...profile, isLoggedIn: true }));
        return true;
      }
      clearAdminSession();
      return false;
    } catch (err) {
      clearAdminSession();
      return false;
    } finally {
      setIsAuthChecking(false);
    }
  }, [clearAdminSession]);

  const fetchAdminData = useCallback(async () => {
    if (!localStorage.getItem('paw_admin_token')) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // 1. Fetch Executive Metrics
      const metricsRes = await api.getAdminMetrics();
      if (metricsRes && metricsRes.success && metricsRes.metrics) {
        setRevenueMetrics(prev => ({
          ...prev,
          ...metricsRes.metrics
        }));
      }

      // 2. Fetch Vendors from DB
      const vendorsRes = await api.getAdminVendors();
      if (vendorsRes && vendorsRes.success && Array.isArray(vendorsRes.vendors)) {
        setVendors(vendorsRes.vendors);
      }

      // 3. Fetch Products from DB
      const productsRes = await api.getAdminProducts();
      if (productsRes && productsRes.success && Array.isArray(productsRes.products)) {
        setProductsGovernance(productsRes.products);
      }

      // 4. Fetch Platform CMS from DB
      const cmsRes = await api.getAdminCms();
      if (cmsRes && cmsRes.success && cmsRes.cms) {
        const cms = cmsRes.cms;
        if (cms.topAnnouncement) {
          setPlatformContent(prev => ({
            ...prev,
            announcementBar: {
              enabled: cms.topAnnouncement.isActive !== false,
              text: cms.topAnnouncement.text || prev.announcementBar.text,
              linkText: 'Claim Offer',
              linkUrl: cms.topAnnouncement.link || '/products'
            }
          }));
        }
        if (Array.isArray(cms.heroBanners) && cms.heroBanners.length > 0) {
          setPlatformContent(prev => ({
            ...prev,
            heroBanners: cms.heroBanners.map(b => ({
              id: b.id,
              title: b.title,
              subtitle: b.subTitle || '',
              badge: b.tag || '⚡ FEATURED',
              tagline: 'PAW QUICK',
              ctaText: 'Explore',
              ctaLink: b.link || '/products',
              bgGradient: b.bgColor || 'from-amber-500 via-amber-600 to-orange-600',
              image: b.image || '/images/hero_pets.jpg',
              isActive: b.isActive !== false
            }))
          }));
        }
      }

      if (cmsRes && cmsRes.success && cmsRes.cms) {
        setPlatformContent(prev => cmsToPlatformContent(cmsRes.cms, prev));
      }

      // 5. Fetch Business Settings from DB
      const bizRes = await api.getAdminBusinessSettings();
      if (bizRes && bizRes.success && bizRes.businessSettings) {
        setBusinessSettings(bizRes.businessSettings);
      }

      // 6. Fetch Finance Ledger and Vendor Payout Queue from paid orders
      const financeRes = await api.getAdminFinanceLedger();
      if (financeRes && financeRes.success) {
        if (Array.isArray(financeRes.payoutQueue)) {
          setPayoutQueue(financeRes.payoutQueue);
        }
        if (Array.isArray(financeRes.paymentHistory)) {
          setPaymentHistory(financeRes.paymentHistory);
        }
        if (Array.isArray(financeRes.riderEarnings)) {
          setRiderEarnings(financeRes.riderEarnings);
        }
        if (financeRes.metrics) {
          setRevenueMetrics(prev => ({ ...prev, ...financeRes.metrics }));
        }
      }

    } catch (err) {
      console.warn('Live admin data load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateAdminSession().then((valid) => {
      if (valid) fetchAdminData();
      else setIsLoading(false);
    });
  }, [fetchAdminData, validateAdminSession]);

  // ----------------------------------------------------
  // ACTION HANDLERS WITH DIRECT DATABASE PERSISTENCE
  // ----------------------------------------------------

  // 3.1 Vendor Governance Actions
  const approveVendor = async (vendorId, commissionRate = 12) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v._id === vendorId) {
        return {
          ...v,
          status: 'approved',
          commissionRate: Number(commissionRate),
          joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }
      return v;
    }));

    try {
      await api.approveVendor(vendorId, commissionRate);
      const metricsRes = await api.getAdminMetrics();
      if (metricsRes?.success) setRevenueMetrics(prev => ({ ...prev, ...metricsRes.metrics }));
    } catch (err) {
      console.warn('Vendor approval sync notice:', err.message);
    }
  };

  const rejectVendor = async (vendorId, reason = 'Documents did not meet compliance criteria') => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v._id === vendorId) {
        return {
          ...v,
          status: 'rejected',
          rejectionReason: reason
        };
      }
      return v;
    }));

    try {
      await api.rejectVendor(vendorId, reason);
      const metricsRes = await api.getAdminMetrics();
      if (metricsRes?.success) setRevenueMetrics(prev => ({ ...prev, ...metricsRes.metrics }));
    } catch (err) {
      console.warn('Vendor rejection sync notice:', err.message);
    }
  };

  const toggleVendorStatus = async (vendorId) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v._id === vendorId) {
        const nextStatus = v.status === 'approved' ? 'suspended' : 'approved';
        return { ...v, status: nextStatus };
      }
      return v;
    }));

    try {
      await api.toggleVendorStatus(vendorId);
    } catch (err) {
      console.warn('Vendor status toggle sync notice:', err.message);
    }
  };

  const updateVendorCommission = async (vendorId, newRate) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId || v._id === vendorId) {
        return { ...v, commissionRate: Number(newRate) };
      }
      return v;
    }));

    try {
      await api.updateVendorCommission(vendorId, newRate);
    } catch (err) {
      console.warn('Vendor commission update sync notice:', err.message);
    }
  };

  // 3.1 Product Governance Actions
  const approveProduct = async (productId) => {
    setProductsGovernance(prev => prev.map(p => {
      if (p.id === productId || p._id === productId) {
        return { ...p, status: 'approved' };
      }
      return p;
    }));

    try {
      await api.approveProduct(productId);
      const metricsRes = await api.getAdminMetrics();
      if (metricsRes?.success) setRevenueMetrics(prev => ({ ...prev, ...metricsRes.metrics }));
    } catch (err) {
      console.warn('Product approval sync notice:', err.message);
    }
  };

  const rejectProduct = async (productId, reason) => {
    setProductsGovernance(prev => prev.map(p => {
      if (p.id === productId || p._id === productId) {
        return { ...p, status: 'rejected', rejectionReason: reason || 'Product details violated quality policy.' };
      }
      return p;
    }));

    try {
      await api.rejectProduct(productId, reason);
      const metricsRes = await api.getAdminMetrics();
      if (metricsRes?.success) setRevenueMetrics(prev => ({ ...prev, ...metricsRes.metrics }));
    } catch (err) {
      console.warn('Product rejection sync notice:', err.message);
    }
  };

  const updateProductTags = async (productId, tags) => {
    const normalizedTags = [...new Set(tags)];
    setProductsGovernance(prev => prev.map(product => (
      product.id === productId || product._id === productId
        ? { ...product, tags: normalizedTags }
        : product
    )));

    try {
      const response = await api.updateAdminProductTags(productId, normalizedTags);
      if (!response?.success) {
        throw new Error(response?.message || 'Product tags could not be saved.');
      }
    } catch (err) {
      console.warn('Product tag sync notice:', err.message);
    }
  };

  // 3.2 Revenue Controls Actions
  const updateCategoryCommission = async (categoryName, rate) => {
    const updated = {
      ...businessSettings,
      categoryCommissions: {
        ...businessSettings.categoryCommissions,
        [categoryName]: Number(rate)
      }
    };
    setBusinessSettings(updated);

    try {
      await api.updateAdminBusinessSettings(updated);
    } catch (err) {
      console.warn('Commission update sync notice:', err.message);
    }
  };

  const updateDeliveryPricing = async (field, value) => {
    const updated = {
      ...businessSettings,
      deliveryPricing: {
        ...businessSettings.deliveryPricing,
        [field]: Number(value)
      }
    };
    setBusinessSettings(updated);

    try {
      await api.updateAdminBusinessSettings(updated);
    } catch (err) {
      console.warn('Delivery pricing update sync notice:', err.message);
    }
  };

  const updateOnboardingFees = async (field, value) => {
    const updated = {
      ...businessSettings,
      onboardingFees: {
        ...businessSettings.onboardingFees,
        [field]: typeof value === 'boolean' ? value : Number(value)
      }
    };
    setBusinessSettings(updated);

    try {
      await api.updateAdminBusinessSettings(updated);
    } catch (err) {
      console.warn('Onboarding fees update sync notice:', err.message);
    }
  };

  const processPayout = async (payoutId) => {
    const payout = payoutQueue.find(p => p.id === payoutId || p.vendorId === payoutId);
    if (!payout) return;

    setPayoutQueue(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'processed' };
      }
      return p;
    }));

    try {
      const res = await api.processAdminVendorPayout(payout.vendorId, {
        payoutReference: `${payout.id}-${Date.now()}`
      });
      if (res?.success) {
        if (Array.isArray(res.payoutQueue)) setPayoutQueue(res.payoutQueue);
        if (Array.isArray(res.paymentHistory)) setPaymentHistory(res.paymentHistory);
        if (Array.isArray(res.riderEarnings)) setRiderEarnings(res.riderEarnings);
        if (res.metrics) setRevenueMetrics(prev => ({ ...prev, ...res.metrics }));
      }
    } catch (err) {
      console.warn('Vendor payout process sync notice:', err.message);
    }
  };

  // 3.3 Platform CMS Actions
  const updateAnnouncementBar = async (enabled, text, linkText, linkUrl) => {
    const updated = {
      ...platformContent,
      announcementBar: {
        enabled,
        text,
        linkText,
        linkUrl
      }
    };
    setPlatformContent(updated);

    try {
      await api.updateAdminCms(platformContentToCmsPayload(updated));
    } catch (err) {
      console.warn('Announcement bar update sync notice:', err.message);
    }
  };

  const toggleFeaturedSection = (sectionKey) => {
    setPlatformContent(prev => {
      const updated = {
        ...prev,
        featuredSections: {
          ...prev.featuredSections,
          [sectionKey]: !prev.featuredSections[sectionKey]
        }
      };
      api.updateAdminCms(platformContentToCmsPayload(updated)).catch(err => {
        console.warn('Featured section sync notice:', err.message);
      });
      return updated;
    });
  };

  const addHeroBanner = async (banner) => {
    const newId = `BNR-${String(platformContent.heroBanners.length + 1).padStart(2, '0')}`;
    const newBanner = { ...banner, id: newId, isActive: true, order: platformContent.heroBanners.length + 1 };
    const updatedBanners = [...platformContent.heroBanners, newBanner];
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms(platformContentToCmsPayload({ ...platformContent, heroBanners: updatedBanners }));
    } catch (err) {
      console.warn('Add banner sync notice:', err.message);
    }
  };

  const toggleHeroBannerStatus = async (bannerId) => {
    const updatedBanners = platformContent.heroBanners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms(platformContentToCmsPayload({ ...platformContent, heroBanners: updatedBanners }));
    } catch (err) {
      console.warn('Toggle banner sync notice:', err.message);
    }
  };

  const deleteHeroBanner = async (bannerId) => {
    const updatedBanners = platformContent.heroBanners.filter(b => b.id !== bannerId);
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms(platformContentToCmsPayload({ ...platformContent, heroBanners: updatedBanners }));
    } catch (err) {
      console.warn('Delete banner sync notice:', err.message);
    }
  };

  const addPromoCoupon = (coupon) => {
    const newId = `CPN-${String(platformContent.promoCoupons.length + 1).padStart(2, '0')}`;
    setPlatformContent(prev => {
      const updated = {
        ...prev,
        promoCoupons: [...prev.promoCoupons, { ...coupon, id: newId, isActive: true }]
      };
      api.updateAdminCms(platformContentToCmsPayload(updated)).catch(err => {
        console.warn('Add coupon sync notice:', err.message);
      });
      return updated;
    });
  };

  const toggleCouponStatus = (couponId) => {
    setPlatformContent(prev => {
      const updated = {
        ...prev,
        promoCoupons: prev.promoCoupons.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c)
      };
      api.updateAdminCms(platformContentToCmsPayload(updated)).catch(err => {
        console.warn('Coupon toggle sync notice:', err.message);
      });
      return updated;
    });
  };

  // Computed Quick Counters for Badges & Header
  const totalVendorsCount = Number(revenueMetrics.totalVendors ?? vendors.length);
  const approvedVendorsCount = Number(revenueMetrics.approvedVendors ?? vendors.filter(v => v.status === 'approved').length);
  const pendingVendorsCount = Number(revenueMetrics.pendingVendors ?? vendors.filter(v => v.status === 'pending').length);
  const pendingProductsCount = Number(revenueMetrics.pendingProducts ?? productsGovernance.filter(p => p.status === 'pending_approval').length);

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        setAdminUser,
        isAuthenticated,
        setIsAuthenticated,
        isAuthChecking,
        validateAdminSession,
        isLoading,
        isSaving,
        refreshAdminData: fetchAdminData,
        // 3.1 Vendor Governance
        vendors,
        approveVendor,
        rejectVendor,
        toggleVendorStatus,
        updateVendorCommission,
        totalVendorsCount,
        approvedVendorsCount,
        pendingVendorsCount,
        // 3.1 Product Governance
        productsGovernance,
        approveProduct,
        rejectProduct,
        updateProductTags,
        pendingProductsCount,
        // 3.2 Revenue Controls
        businessSettings,
        revenueMetrics,
        updateCategoryCommission,
        updateDeliveryPricing,
        updateOnboardingFees,
        payoutQueue,
        paymentHistory,
        riderEarnings,
        processPayout,
        // 3.3 Platform CMS
        platformContent,
        updateAnnouncementBar,
        toggleFeaturedSection,
        addHeroBanner,
        toggleHeroBannerStatus,
        deleteHeroBanner,
        addPromoCoupon,
        toggleCouponStatus
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
