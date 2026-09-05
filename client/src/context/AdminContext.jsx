import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // ----------------------------------------------------
  // 3.1 VENDOR GOVERNANCE STATE & DATA
  // ----------------------------------------------------
  const [vendors, setVendors] = useState([
    {
      id: 'VND-101',
      storeName: 'Paws & Whiskers Supermart',
      fullName: 'Rajesh Sharma',
      email: 'rajesh@pawswhiskers.in',
      phone: '+91 98765 43210',
      category: 'Pet Food, Accessories, Grooming & Healthcare',
      businessTypes: ['Pet Store & Retail', 'Pet Grooming & Spa'],
      status: 'approved', // 'approved', 'pending', 'rejected', 'suspended'
      commissionRate: 12, // in %
      onboardingFeePaid: true,
      onboardingFeeAmount: 2499,
      rating: 4.8,
      totalOrders: 1420,
      totalRevenue: 342500,
      joinedDate: '15 Jan 2024',
      // KYC Document Data
      storeLicenceNumber: 'DL-PET-2024-88492',
      panNumber: 'ABCPS1234D',
      aadhaarNumber: 'XXXX-XXXX-8921',
      location: {
        address: 'Plot 42, Road No. 12, Banjara Hills',
        city: 'Hyderabad',
        pincode: '500034',
        lat: 17.4156,
        lng: 78.4350
      },
      photos: {
        storeFront: '/images/hero_pets.jpg',
        interior: '/images/cat_accessories.jpg',
        logo: '/images/cat_food.jpg'
      },
      serviceDeliveryModes: {
        homeServiceEnabled: true,
        clinicVisitEnabled: true,
        homeServiceFee: 99
      },
      submittedDate: '14 Jan 2024'
    },
    {
      id: 'VND-102',
      storeName: 'Royal Pet Grooming & Spa Hub',
      fullName: 'Priya Mehra',
      email: 'priya@royalpets.in',
      phone: '+91 98112 34567',
      category: 'Pet Grooming, Spa & Boarding',
      businessTypes: ['Pet Grooming & Spa', 'Pet Boarding & Hostel'],
      status: 'approved',
      commissionRate: 15,
      onboardingFeePaid: true,
      onboardingFeeAmount: 2499,
      rating: 4.9,
      totalOrders: 890,
      totalRevenue: 215000,
      joinedDate: '28 Feb 2024',
      storeLicenceNumber: 'DL-SPA-2024-44109',
      panNumber: 'PRYPM8821K',
      aadhaarNumber: 'XXXX-XXXX-4412',
      location: {
        address: '1st Floor, Indiranagar 100ft Road',
        city: 'Bengaluru',
        pincode: '560038',
        lat: 12.9784,
        lng: 77.6408
      },
      photos: {
        storeFront: '/images/cat_grooming.jpg',
        interior: '/images/promo_puppy.jpg',
        logo: '/images/cat_grooming.jpg'
      },
      serviceDeliveryModes: {
        homeServiceEnabled: true,
        clinicVisitEnabled: true,
        homeServiceFee: 149
      },
      submittedDate: '26 Feb 2024'
    },
    {
      id: 'VND-103',
      storeName: 'CityCare 24/7 Animal Hospital & Clinic',
      fullName: 'Dr. Arjun Varma',
      email: 'dr.arjun@citycarevet.com',
      phone: '+91 99445 67890',
      category: 'Veterinary Clinic, Diagnostics & Pet Pharmacy',
      businessTypes: ['Veterinary Clinic & Hospital'],
      status: 'pending', // Pending Admin Review
      commissionRate: 10,
      onboardingFeePaid: true,
      onboardingFeeAmount: 2499,
      rating: 4.7,
      totalOrders: 0,
      totalRevenue: 0,
      joinedDate: 'Pending',
      storeLicenceNumber: 'VET-MED-2024-90218',
      panNumber: 'ARJVP5521L',
      aadhaarNumber: 'XXXX-XXXX-9011',
      location: {
        address: 'Shop 14, High Street, Jubilee Hills',
        city: 'Hyderabad',
        pincode: '500033',
        lat: 17.4319,
        lng: 78.4073
      },
      photos: {
        storeFront: '/images/cat_clinic.jpg',
        interior: '/images/cat_medicine.jpg',
        logo: '/images/cat_clinic.jpg'
      },
      serviceDeliveryModes: {
        homeServiceEnabled: true,
        clinicVisitEnabled: true,
        homeServiceFee: 199
      },
      submittedDate: 'Yesterday at 4:30 PM',
      reviewNotes: 'High quality vet clinic with all medical licenses attached. Requires verification.'
    },
    {
      id: 'VND-104',
      storeName: 'FurryTails Pet Bakery & Treats',
      fullName: 'Ananya Deshmukh',
      email: 'ananya@furrytails.co',
      phone: '+91 97654 32109',
      category: 'Organic Pet Treats, Bakery & Food',
      businessTypes: ['Pet Store & Retail'],
      status: 'pending',
      commissionRate: 14,
      onboardingFeePaid: true,
      onboardingFeeAmount: 2499,
      rating: 4.6,
      totalOrders: 0,
      totalRevenue: 0,
      joinedDate: 'Pending',
      storeLicenceNumber: 'FSSAI-PET-889123',
      panNumber: 'ANYPD4419M',
      aadhaarNumber: 'XXXX-XXXX-1144',
      location: {
        address: 'B-12, Koregaon Park Plaza',
        city: 'Pune',
        pincode: '411001',
        lat: 18.5362,
        lng: 73.8940
      },
      photos: {
        storeFront: '/images/promo_puppy.jpg',
        interior: '/images/cat_food.jpg',
        logo: '/images/promo_puppy.jpg'
      },
      serviceDeliveryModes: {
        homeServiceEnabled: false,
        clinicVisitEnabled: false,
        homeServiceFee: 0
      },
      submittedDate: 'Today at 10:15 AM',
      reviewNotes: 'Organic bakery applicant with valid FSSAI trade license.'
    },
    {
      id: 'VND-105',
      storeName: 'Canine Haven Boarding & Resort',
      fullName: 'Suresh Menon',
      email: 'suresh@caninehaven.in',
      phone: '+91 94470 12345',
      category: 'Pet Boarding, Daycare & Training',
      businessTypes: ['Pet Boarding & Hostel'],
      status: 'suspended',
      commissionRate: 15,
      onboardingFeePaid: true,
      onboardingFeeAmount: 2499,
      rating: 3.4,
      totalOrders: 210,
      totalRevenue: 68000,
      joinedDate: '10 Dec 2023',
      storeLicenceNumber: 'DL-BRD-2023-11092',
      panNumber: 'SURPM9910Q',
      aadhaarNumber: 'XXXX-XXXX-6677',
      location: {
        address: 'Farm Road 4, Gachibowli Outer Ring',
        city: 'Hyderabad',
        pincode: '500032',
        lat: 17.4401,
        lng: 78.3489
      },
      photos: {
        storeFront: '/images/cat_boarding.jpg',
        interior: '/images/promo_puppy.jpg',
        logo: '/images/cat_boarding.jpg'
      },
      serviceDeliveryModes: {
        homeServiceEnabled: false,
        clinicVisitEnabled: true,
        homeServiceFee: 0
      },
      submittedDate: '08 Dec 2023',
      suspensionReason: 'Multiple customer complaints regarding unhygienic conditions.'
    }
  ]);

  // ----------------------------------------------------
  // 3.1 PRODUCT & SERVICE GOVERNANCE STATE & DATA
  // ----------------------------------------------------
  const [productsGovernance, setProductsGovernance] = useState([
    {
      id: 'PRD-GOV-01',
      title: 'Royal Canin Maxi Adult Dog Food (15kg)',
      vendorId: 'VND-101',
      vendorName: 'Paws & Whiskers Supermart',
      category: 'Dog Food',
      price: 6899,
      mrp: 7500,
      stock: 45,
      image: '/images/prod_drools.jpg',
      status: 'approved', // 'approved', 'pending_approval', 'rejected'
      submittedDate: '01 Mar 2024',
      type: 'product'
    },
    {
      id: 'PRD-GOV-02',
      title: 'Pedigree Pro High Protein Puppy Dry Food (10kg)',
      vendorId: 'VND-101',
      vendorName: 'Paws & Whiskers Supermart',
      category: 'Dog Food',
      price: 3299,
      mrp: 3800,
      stock: 28,
      image: '/images/prod_pedigree.jpg',
      status: 'approved',
      submittedDate: '02 Mar 2024',
      type: 'product'
    },
    {
      id: 'PRD-GOV-03',
      title: 'FurryTails Organic Salmon & Blueberry Crunchy Dog Cookies (400g)',
      vendorId: 'VND-104',
      vendorName: 'FurryTails Pet Bakery & Treats',
      category: 'Pet Treats',
      price: 449,
      mrp: 599,
      stock: 120,
      image: '/images/cat_food.jpg',
      status: 'pending_approval', // Pending admin approval
      submittedDate: 'Today at 11:20 AM',
      type: 'product',
      notes: 'New artisan organic treat line. Packaging labels verified.'
    },
    {
      id: 'PRD-GOV-04',
      title: 'Full Body Hydrotherapy & Medicated Herbal Spa for Dogs',
      vendorId: 'VND-102',
      vendorName: 'Royal Pet Grooming & Spa Hub',
      category: 'Pet Grooming & Spa',
      price: 1899,
      mrp: 2400,
      stock: 999, // service
      image: '/images/cat_grooming.jpg',
      status: 'pending_approval',
      submittedDate: 'Yesterday at 3:15 PM',
      type: 'service',
      serviceModes: ['At-Home Service', 'Clinic / Spa Visit'],
      notes: 'Specialized hydrotherapy treatment package for senior dogs with arthritis.'
    },
    {
      id: 'PRD-GOV-05',
      title: 'Generic Unbranded Antibiotic Eye Drops (Unregistered)',
      vendorId: 'VND-105',
      vendorName: 'Canine Haven Boarding & Resort',
      category: 'Veterinary Pharmacy',
      price: 150,
      mrp: 200,
      stock: 15,
      image: '/images/cat_medicine.jpg',
      status: 'rejected',
      submittedDate: '12 Feb 2024',
      type: 'product',
      rejectionReason: 'Prescription antibiotics cannot be sold without drug license & valid batch number.'
    }
  ]);

  // ----------------------------------------------------
  // 3.2 REVENUE & BUSINESS CONTROLS STATE & DATA
  // ----------------------------------------------------
  const [businessSettings, setBusinessSettings] = useState({
    // Category-wise commission percentage
    categoryCommissions: {
      'Pet Food & Nutrition': 10,
      'Pet Accessories & Toys': 15,
      'Pet Grooming & Spa': 18,
      'Veterinary Clinic & Health': 12,
      'Pet Boarding & Daycare': 15,
      'Pharmacy & Medicines': 8
    },
    // Delivery pricing rules
    deliveryPricing: {
      baseDeliveryFee: 49,
      freeDeliveryThreshold: 499,
      perKmRate: 7, // ₹ per km after 5km
      rainSurgeMultiplier: 1.2,
      nightSurgeFee: 30
    },
    // Vendor onboarding fees
    onboardingFees: {
      vendorRegistrationDeposit: 2499,
      annualPlatformTechFee: 4999,
      waiveOnboardingPromo: false,
      instantApprovalEnabled: false
    }
  });

  // Platform Financial Metrics
  const [revenueMetrics, setRevenueMetrics] = useState({
    totalGmv: 1845920, // Gross Merchandise Value
    totalNetPlatformProfit: 248900, // Commissions & Platform fees
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
      status: 'pending', // 'pending', 'processed', 'on_hold'
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
    // Dynamic Top Announcement Bar
    announcementBar: {
      enabled: true,
      text: '🎉 PAW FEST 2026: Flat 20% OFF on all Pet Food & Free Vet Consultation on orders above ₹999! Code: PAWFEST20',
      linkText: 'Claim Offer',
      linkUrl: '/products'
    },
    // Hero Promo Carousel Banners
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
    // Featured Sections on Homepage
    featuredSections: {
      flashDealsEnabled: true,
      popularNearYouEnabled: true,
      homeServicesFeaturedEnabled: true,
      trendingCategoriesEnabled: true,
      emergencyVetBannerEnabled: true
    },
    // Active Promo Coupons
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
      status: 'online', // 'online', 'busy', 'offline'
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

  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'TCK-1089',
      customerName: 'Anand Roy',
      customerPhone: '+91 98881 22334',
      type: 'Customer Issue',
      category: 'Order Delay & Live Tracking',
      orderId: 'ORD-99042',
      priority: 'high', // 'urgent', 'high', 'medium', 'low'
      status: 'open', // 'open', 'in_progress', 'resolved', 'escalated'
      assignedTo: 'STF-001',
      assignedName: 'Sneha Kulkarni',
      createdAt: '12 mins ago',
      description: 'Order ORD-99042 is showing out for delivery for 40 mins. Rider not picking up call.',
      notes: []
    },
    {
      id: 'TCK-1088',
      customerName: 'Dr. Arjun Varma (Store Manager)',
      customerPhone: '+91 99445 67890',
      type: 'Vendor Query',
      category: 'Onboarding KYC Audit',
      orderId: 'VND-103',
      priority: 'urgent',
      status: 'in_progress',
      assignedTo: 'STF-002',
      assignedName: 'Aditya Verma',
      createdAt: '45 mins ago',
      description: 'Submitted clinic registration documents. Requesting verification expedited for emergency weekend listings.',
      notes: ['PAN card verified against income tax database.', 'Awaiting trade license cross-check.']
    },
    {
      id: 'TCK-1087',
      customerName: 'Pooja Hegde',
      customerPhone: '+91 98119 55667',
      type: 'Customer Issue',
      category: 'Prescription Verification',
      orderId: 'ORD-98810',
      priority: 'medium',
      status: 'in_progress',
      assignedTo: 'STF-003',
      assignedName: 'Dr. Meenakshi Iyer',
      createdAt: '2 hours ago',
      description: 'Customer uploaded handwritten vet prescription for medicated ear drops. Verification needed before dispatch.',
      notes: ['Doctor signature verified. Dosages match product packaging.']
    },
    {
      id: 'TCK-1086',
      customerName: 'Sameer Joshi',
      customerPhone: '+91 97711 33221',
      type: 'Customer Issue',
      category: 'Damaged Item Refund',
      orderId: 'ORD-98722',
      priority: 'high',
      status: 'resolved',
      assignedTo: 'STF-001',
      assignedName: 'Sneha Kulkarni',
      createdAt: 'Yesterday',
      description: 'Dog food bag arrived torn during express delivery. Instant UPI refund requested.',
      resolution: 'Refund of ₹1,299 initiated via UPI reference REF-889102. Vendor informed of packaging standard.'
    }
  ]);

  // ----------------------------------------------------
  // ACTION HANDLERS (3.1, 3.2, 3.3, 3.4)
  // ----------------------------------------------------

  // 3.1 Vendor Governance Actions
  const approveVendor = (vendorId, commissionRate = 12) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          status: 'approved',
          commissionRate: Number(commissionRate),
          joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
      }
      return v;
    }));
  };

  const rejectVendor = (vendorId, reason = 'Documents did not meet compliance criteria') => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return {
          ...v,
          status: 'rejected',
          rejectionReason: reason
        };
      }
      return v;
    }));
  };

  const toggleVendorStatus = (vendorId) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        const nextStatus = v.status === 'approved' ? 'suspended' : 'approved';
        return { ...v, status: nextStatus };
      }
      return v;
    }));
  };

  const updateVendorCommission = (vendorId, newRate) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, commissionRate: Number(newRate) };
      }
      return v;
    }));
  };

  // 3.1 Product Governance Actions
  const approveProduct = (productId) => {
    setProductsGovernance(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'approved' };
      }
      return p;
    }));
  };

  const rejectProduct = (productId, reason) => {
    setProductsGovernance(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'rejected', rejectionReason: reason || 'Product details violated quality policy.' };
      }
      return p;
    }));
  };

  // 3.2 Revenue Controls Actions
  const updateCategoryCommission = (categoryName, rate) => {
    setBusinessSettings(prev => ({
      ...prev,
      categoryCommissions: {
        ...prev.categoryCommissions,
        [categoryName]: Number(rate)
      }
    }));
  };

  const updateDeliveryPricing = (field, value) => {
    setBusinessSettings(prev => ({
      ...prev,
      deliveryPricing: {
        ...prev.deliveryPricing,
        [field]: Number(value)
      }
    }));
  };

  const updateOnboardingFees = (field, value) => {
    setBusinessSettings(prev => ({
      ...prev,
      onboardingFees: {
        ...prev.onboardingFees,
        [field]: typeof value === 'boolean' ? value : Number(value)
      }
    }));
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
  const updateAnnouncementBar = (enabled, text, linkText, linkUrl) => {
    setPlatformContent(prev => ({
      ...prev,
      announcementBar: {
        enabled,
        text,
        linkText,
        linkUrl
      }
    }));
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

  const addHeroBanner = (banner) => {
    const newId = `BNR-${String(platformContent.heroBanners.length + 1).padStart(2, '0')}`;
    setPlatformContent(prev => ({
      ...prev,
      heroBanners: [...prev.heroBanners, { ...banner, id: newId, isActive: true, order: prev.heroBanners.length + 1 }]
    }));
  };

  const toggleHeroBannerStatus = (bannerId) => {
    setPlatformContent(prev => ({
      ...prev,
      heroBanners: prev.heroBanners.map(b => b.id === bannerId ? { ...b, isActive: !b.isActive } : b)
    }));
  };

  const deleteHeroBanner = (bannerId) => {
    setPlatformContent(prev => ({
      ...prev,
      heroBanners: prev.heroBanners.filter(b => b.id !== bannerId)
    }));
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

  const assignTicketToStaff = (ticketId, staffId) => {
    const staffMember = supportStaff.find(s => s.id === staffId);
    if (!staffMember) return;

    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
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
  };

  const updateTicketStatus = (ticketId, status, resolutionNotes = '') => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status,
          ...(resolutionNotes ? { resolution: resolutionNotes } : {})
        };
      }
      return t;
    }));
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
