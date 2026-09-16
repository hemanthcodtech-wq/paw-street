import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AdminContext = createContext();

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

  const [isAuthenticated, setIsAuthenticated] = useState(true);
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
    totalGmv: 1845920,
    totalNetPlatformProfit: 248900,
    totalOrdersCount: 4219,
    totalVendorPayoutsDisbursed: 1498020,
    pendingPayoutsQueue: 99000,
    averageOrderValue: 437.5,
    growthRatePercent: 24.8
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

  // ----------------------------------------------------
  // 3.4 SUPPORT TEAM & TICKET MANAGEMENT STATE & DATA
  // ----------------------------------------------------
  const [supportStaff, setSupportStaff] = useState([
    {
      id: 'STF-001',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@pawnear.com',
      phone: '+91 98220 11223',
      role: 'Tier 1 Senior Support Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      activeTickets: 3,
      resolvedTickets: 142,
      status: 'online',
      rating: 4.9
    },
    {
      id: 'STF-002',
      name: 'Aditya Verma',
      email: 'aditya.v@pawnear.com',
      phone: '+91 97110 44556',
      role: 'Vendor Compliance & Dispute Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      activeTickets: 2,
      resolvedTickets: 98,
      status: 'online',
      rating: 4.8
    },
    {
      id: 'STF-003',
      name: 'Dr. Meenakshi Iyer',
      email: 'dr.meenakshi@pawnear.com',
      phone: '+91 99001 88990',
      role: 'Veterinary Support & Prescription Auditor',
      avatar: 'https://images.unsplash.com/photo-1594824813512-9c3f2530d970?auto=format&fit=crop&w=200&q=80',
      activeTickets: 1,
      resolvedTickets: 76,
      status: 'busy',
      rating: 5.0
    }
  ]);

  const [supportTickets, setSupportTickets] = useState([]);

  // ====================================================
  // FETCH ALL ADMIN DATA DIRECTLY FROM MONGODB ATLAS
  // ====================================================
  const fetchAdminData = useCallback(async () => {
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
        if (vendorsRes.vendors.length > 0) {
          setVendors(vendorsRes.vendors);
        }
      }

      // 3. Fetch Products from DB
      const productsRes = await api.getAdminProducts();
      if (productsRes && productsRes.success && Array.isArray(productsRes.products)) {
        if (productsRes.products.length > 0) {
          setProductsGovernance(productsRes.products);
        }
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

      // 5. Fetch Business Settings from DB
      const bizRes = await api.getAdminBusinessSettings();
      if (bizRes && bizRes.success && bizRes.businessSettings) {
        setBusinessSettings(bizRes.businessSettings);
      }

      // 6. Fetch Support Tickets from DB
      const supportRes = await api.getAdminSupport();
      if (supportRes && supportRes.success && Array.isArray(supportRes.tickets)) {
        if (supportRes.tickets.length > 0) {
          setSupportTickets(supportRes.tickets);
        }
      }
    } catch (err) {
      console.warn('Live admin data load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

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

  const processPayout = (payoutId) => {
    setPayoutQueue(prev => prev.map(p => {
      if (p.id === payoutId) {
        return { ...p, status: 'processed' };
      }
      return p;
    }));
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
      await api.updateAdminCms({
        topAnnouncement: {
          text,
          badge: '⚡ FLASH SALE',
          link: linkUrl,
          isActive: enabled
        }
      });
    } catch (err) {
      console.warn('Announcement bar update sync notice:', err.message);
    }
  };

  const toggleFeaturedSection = (sectionKey) => {
    setPlatformContent(prev => ({
      ...prev,
      featuredSections: {
        ...prev.featuredSections,
        [sectionKey]: !prev.featuredSections[sectionKey]
      }
    }));
  };

  const addHeroBanner = async (banner) => {
    const newId = `BNR-${String(platformContent.heroBanners.length + 1).padStart(2, '0')}`;
    const newBanner = { ...banner, id: newId, isActive: true, order: platformContent.heroBanners.length + 1 };
    const updatedBanners = [...platformContent.heroBanners, newBanner];
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms({
        heroBanners: updatedBanners.map(b => ({
          id: b.id,
          title: b.title,
          subTitle: b.subtitle,
          tag: b.badge,
          image: b.image,
          link: b.ctaLink,
          bgColor: b.bgGradient,
          isActive: b.isActive
        }))
      });
    } catch (err) {
      console.warn('Add banner sync notice:', err.message);
    }
  };

  const toggleHeroBannerStatus = async (bannerId) => {
    const updatedBanners = platformContent.heroBanners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b);
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms({
        heroBanners: updatedBanners.map(b => ({
          id: b.id,
          title: b.title,
          subTitle: b.subtitle,
          tag: b.badge,
          image: b.image,
          link: b.ctaLink,
          bgColor: b.bgGradient,
          isActive: b.isActive
        }))
      });
    } catch (err) {
      console.warn('Toggle banner sync notice:', err.message);
    }
  };

  const deleteHeroBanner = async (bannerId) => {
    const updatedBanners = platformContent.heroBanners.filter(b => b.id !== bannerId);
    setPlatformContent(prev => ({ ...prev, heroBanners: updatedBanners }));

    try {
      await api.updateAdminCms({
        heroBanners: updatedBanners.map(b => ({
          id: b.id,
          title: b.title,
          subTitle: b.subtitle,
          tag: b.badge,
          image: b.image,
          link: b.ctaLink,
          bgColor: b.bgGradient,
          isActive: b.isActive
        }))
      });
    } catch (err) {
      console.warn('Delete banner sync notice:', err.message);
    }
  };

  const addPromoCoupon = (coupon) => {
    const newId = `CPN-${String(platformContent.promoCoupons.length + 1).padStart(2, '0')}`;
    setPlatformContent(prev => ({
      ...prev,
      promoCoupons: [...prev.promoCoupons, { ...coupon, id: newId, isActive: true }]
    }));
  };

  const toggleCouponStatus = (couponId) => {
    setPlatformContent(prev => ({
      ...prev,
      promoCoupons: prev.promoCoupons.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c)
    }));
  };

  // 3.4 Support Team Actions
  const addSupportStaff = (staff) => {
    const newId = `STF-${String(supportStaff.length + 1).padStart(3, '0')}`;
    setSupportStaff(prev => [...prev, {
      ...staff,
      id: newId,
      activeTickets: 0,
      resolvedTickets: 0,
      status: 'online',
      rating: 5.0,
      avatar: staff.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    }]);
  };

  const assignTicketToStaff = async (ticketId, staffId) => {
    const staffMember = supportStaff.find(s => s.id === staffId);
    if (!staffMember) return;

    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId || t._id === ticketId) {
        return {
          ...t,
          assignedTo: staffId,
          assignedName: staffMember.name,
          status: t.status === 'open' ? 'in_progress' : t.status
        };
      }
      return t;
    }));

    setSupportStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        return { ...s, activeTickets: s.activeTickets + 1 };
      }
      return s;
    }));

    try {
      await api.updateAdminTicket(ticketId, {
        assignedStaff: { id: staffId, name: staffMember.name },
        status: 'in_progress'
      });
    } catch (err) {
      console.warn('Assign ticket sync notice:', err.message);
    }
  };

  const updateTicketStatus = async (ticketId, status, resolutionNotes = '') => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId || t._id === ticketId) {
        return {
          ...t,
          status,
          ...(resolutionNotes ? { resolution: resolutionNotes } : {})
        };
      }
      return t;
    }));

    try {
      await api.updateAdminTicket(ticketId, { status, resolution: resolutionNotes });
    } catch (err) {
      console.warn('Update ticket status sync notice:', err.message);
    }
  };

  // Computed Quick Counters for Badges & Header
  const pendingVendorsCount = vendors.filter(v => v.status === 'pending').length;
  const pendingProductsCount = productsGovernance.filter(p => p.status === 'pending_approval').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        setAdminUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        isSaving,
        refreshAdminData: fetchAdminData,
        // 3.1 Vendor Governance
        vendors,
        approveVendor,
        rejectVendor,
        toggleVendorStatus,
        updateVendorCommission,
        pendingVendorsCount,
        // 3.1 Product Governance
        productsGovernance,
        approveProduct,
        rejectProduct,
        pendingProductsCount,
        // 3.2 Revenue Controls
        businessSettings,
        revenueMetrics,
        updateCategoryCommission,
        updateDeliveryPricing,
        updateOnboardingFees,
        payoutQueue,
        processPayout,
        // 3.3 Platform CMS
        platformContent,
        updateAnnouncementBar,
        toggleFeaturedSection,
        addHeroBanner,
        toggleHeroBannerStatus,
        deleteHeroBanner,
        addPromoCoupon,
        toggleCouponStatus,
        // 3.4 Support Team
        supportStaff,
        supportTickets,
        addSupportStaff,
        assignTicketToStaff,
        updateTicketStatus,
        openTicketsCount
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
