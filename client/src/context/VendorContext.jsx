import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { api } from '../services/api';

const VendorContext = createContext();

const INITIAL_VENDOR = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  storeName: '',
  businessTypes: [],
  businessType: '',
  storeCategory: '',
  storeLicenceNumber: '',
  gstin: '',
  panNumber: '',
  aadhaarNumber: '',
  serviceDeliveryModes: {
    homeServiceEnabled: false,
    clinicVisitEnabled: false,
    homeServiceFee: 0,
    homeServiceRadiusKm: 0,
    homeGroomingSlots: [],
    clinicDoctorSlots: []
  },
  location: {
    address: '',
    city: '',
    pincode: '',
    lat: 17.4156,
    lng: 78.4350,
    landmark: ''
  },
  photos: {
    storeFront: '',
    interior: '',
    logo: ''
  },
  status: 'not_submitted',
  submittedAt: null,
  approvedAt: null,
  isStoreOpen: false,
  rating: 0,
  totalReviews: 0,
  commissionRate: 8 // %
};

const INITIAL_DELIVERY_BOYS = [
  {
    id: 'db-1',
    name: 'Vikram Singh',
    phone: '+91 91234 56789',
    role: 'delivery_rider', // 'delivery_rider' | 'home_groomer' | 'mobile_vet'
    roleTitle: 'Quick Delivery Partner',
    vehicleType: 'Electric Bike',
    vehicleNumber: 'TS 09 AB 4521',
    drivingLicence: 'DL-0420190012345',
    status: 'available', // 'available' | 'busy' | 'offline'
    rating: 4.9,
    totalDeliveries: 428,
    joinedDate: '2025-11-10',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'db-2',
    name: 'Suresh Kumar',
    phone: '+91 98765 12345',
    role: 'delivery_rider',
    roleTitle: 'Express Rider',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'TS 08 EF 8812',
    drivingLicence: 'DL-0420210087654',
    status: 'busy',
    currentOrderId: 'ORD-7821',
    rating: 4.7,
    totalDeliveries: 310,
    joinedDate: '2026-01-15',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'db-3',
    name: 'Rahul Sharma (Groomer)',
    phone: '+91 94567 89012',
    role: 'home_groomer',
    roleTitle: 'Certified Home Pet Groomer',
    vehicleType: 'Service Scooter with Grooming Kit',
    vehicleNumber: 'TS 07 CD 3390',
    drivingLicence: 'DL-0420200054321',
    status: 'available',
    rating: 4.9,
    totalDeliveries: 165,
    joinedDate: '2026-02-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'db-4',
    name: 'Dr. Anita Joshi (Vet)',
    phone: '+91 99887 76655',
    role: 'mobile_vet',
    roleTitle: 'Mobile Vet / Health Inspector',
    vehicleType: 'Clinic Mobile Van',
    vehicleNumber: 'TS 10 GH 6641',
    drivingLicence: 'DL-0420220033221',
    status: 'available',
    rating: 4.95,
    totalDeliveries: 92,
    joinedDate: '2026-04-01',
    avatar: 'https://images.unsplash.com/photo-1594824813688-66d483424177?w=150&auto=format&fit=crop&q=80'
  }
];

const INITIAL_SERVICES = [
  // 1. Home Grooming Service
  {
    id: 'srv-h1',
    name: 'Doorstep Luxury Full Spa & Breed Haircut',
    shortName: 'Full Spa & Styling',
    category: 'Grooming',
    deliveryMode: 'home_service', // 'home_service' | 'clinic_visit' | 'both'
    price: 1299,
    mrp: 1599,
    durationMinutes: 60,
    petType: 'Dog & Cat',
    isActive: true,
    rating: 4.9,
    reviewsCount: 124,
    image: '/images/cat_grooming.jpg',
    description: 'Complete grooming session right at your doorstep in our sanitized, air-conditioned grooming mobile unit. Stress-free & 1-on-1 pet care.',
    features: [
      'Warm Hydrobath with Organic Herbal Shampoo',
      'Blow Dry & Gentle De-matting Coat Brush',
      'Customized Breed Haircut & Sanitary Trim',
      'Nail Clipping, Paw Pad Moisturizing Balm',
      'Ear Cleaning & Fragrance Mist'
    ],
    visitingFee: 99,
    tags: ['Doorstep Van', 'Organic Spa', 'Most Popular']
  },
  // 2. Home Medical Checkup
  {
    id: 'srv-h2',
    name: 'At-Home Senior & Adult Pet Doctor Consultation',
    shortName: 'At-Home Doctor Visit',
    category: 'Veterinary',
    deliveryMode: 'home_service',
    price: 899,
    mrp: 1100,
    durationMinutes: 40,
    petType: 'Dog, Cat, Small Pets',
    isActive: true,
    rating: 4.95,
    reviewsCount: 88,
    image: '/images/store_vet.jpg',
    description: 'Experienced licensed veterinarian visits your home for a comprehensive physical examination, vitals, nutrition review, and digital prescription.',
    features: [
      'Cardiac, Respiratory & Temperature Vitals Check',
      'Abdominal Palpation & Joint Mobility Exam',
      'Eyes, Ears & Dental Tartar Assessment',
      'Digital E-Prescription sent directly to WhatsApp/App',
      'Diet, Nutrition & De-worming Guidance'
    ],
    visitingFee: 99,
    tags: ['Certified Vet', 'Doorstep Care', 'Low Stress']
  },
  // 3. Home Puppy / Kitten Vaccination
  {
    id: 'srv-h3',
    name: 'Doorstep Puppy / Kitten Core Vaccination & Deworming',
    shortName: 'Home Vaccination Package',
    category: 'Veterinary',
    deliveryMode: 'home_service',
    price: 1099,
    mrp: 1399,
    durationMinutes: 30,
    petType: 'Puppies & Kittens',
    isActive: true,
    rating: 4.9,
    reviewsCount: 95,
    image: '/images/promo_puppy.jpg',
    description: 'Cold-chain maintained vaccines delivered and administered at your residence by a registered mobile vet with vaccination passport update.',
    features: [
      '7-in-1 DHPPiL or Feline Tricat Core Vaccine',
      'Cold-Chain Temperature Monitored Delivery',
      'Pre-vaccine Health & Temperature Screening',
      'Oral Deworming Dosage included',
      'Official Vaccination Certificate & Passport Stamp'
    ],
    visitingFee: 99,
    tags: ['Cold-Chain', 'Vaccine Passport', 'Puppy Care']
  },
  // 4. Home Anti-Tick & Flea Wash
  {
    id: 'srv-h4',
    name: 'Anti-Tick & Flea Medicated Eradication Bath (Mobile Van)',
    shortName: 'Anti-Tick Deep Wash',
    category: 'Grooming',
    deliveryMode: 'home_service',
    price: 999,
    mrp: 1250,
    durationMinutes: 45,
    petType: 'Dogs',
    isActive: true,
    rating: 4.85,
    reviewsCount: 76,
    image: '/images/prod_shampoo.jpg',
    description: 'Intense anti-parasitic botanical wash combined with manual tick extraction and soothing skin coat conditioner to relieve itching.',
    features: [
      'Herbal Neem & Tea Tree Medicated Bath',
      'Manual Deep Tick & Flea Removal',
      'Coat Deshedding & De-knotting',
      'Antiseptic Soothing Spray on hotspots',
      'Post-treatment Tick Prevention Guidance'
    ],
    visitingFee: 99,
    tags: ['Medicated', 'Flea Relief', 'Doorstep']
  },
  // 5. In-Clinic Doctor Consultation
  {
    id: 'srv-c1',
    name: 'In-Clinic Comprehensive Veterinary Consultation',
    shortName: 'In-Clinic Doctor Visit',
    category: 'Veterinary',
    deliveryMode: 'clinic_visit', // In-Clinic Visit
    price: 499,
    mrp: 650,
    durationMinutes: 25,
    petType: 'All Pets',
    isActive: true,
    rating: 4.88,
    reviewsCount: 310,
    image: '/images/store_vet.jpg',
    description: 'Visit our Banjara Hills modern clinic for complete medical diagnostics, in-house pharmacy, and comprehensive veterinary care.',
    features: [
      'Consultation with Senior Veterinary Surgeon',
      'Weight, Blood Pressure & Vitals Profiling',
      'Immediate Laboratory Sample Collection',
      'In-Clinic Pharmacy Dispensing',
      'Instant Diagnostic Recommendations'
    ],
    visitingFee: 0,
    tags: ['In-Clinic', 'Pharmacy on Site', 'Walk-in / Appt']
  },
  // 6. In-Clinic Dental Scaling
  {
    id: 'srv-c2',
    name: 'In-Clinic Ultrasonic Dental Scaling & Oral Polish',
    shortName: 'Dental Scaling & Polish',
    category: 'Veterinary',
    deliveryMode: 'clinic_visit',
    price: 2499,
    mrp: 3200,
    durationMinutes: 60,
    petType: 'Dogs & Cats',
    isActive: true,
    rating: 4.92,
    reviewsCount: 54,
    image: '/images/store_vet.jpg',
    description: 'Professional ultrasonic tartar and plaque removal under mild sedation with fluoride polishing for healthy gums and fresh breath.',
    features: [
      'Ultrasonic Subgingival Tartar Removal',
      'Gingival Pocket Cleansing & Antiseptic Flush',
      'Tooth Surface Fluoride Polishing',
      'Pre-procedure Anesthesia Safety Check',
      'Oral Health Home-Care Kit Provided'
    ],
    visitingFee: 0,
    tags: ['Dental Suite', 'Ultrasonic', 'Fresh Breath']
  },
  // 7. In-Clinic Diagnostics (Ultrasound & X-Ray)
  {
    id: 'srv-c3',
    name: 'In-Clinic Digital Ultrasound Scan & 2-View X-Ray',
    shortName: 'Ultrasound & X-Ray Diagnostic',
    category: 'Veterinary',
    deliveryMode: 'clinic_visit',
    price: 1850,
    mrp: 2300,
    durationMinutes: 45,
    petType: 'Dogs & Cats',
    isActive: true,
    rating: 4.95,
    reviewsCount: 68,
    image: '/images/store_vet.jpg',
    description: 'High-frequency abdominal ultrasound and digital radiography imaging with certified radiologist interpretation within 60 minutes.',
    features: [
      'Abdominal Ultrasound Soft-Tissue Exam',
      '2-Angle High-Definition Digital X-Ray Film',
      'Immediate Digital Report & WhatsApp PDF Delivery',
      'Specialist Consultation on Scan Findings',
      'Non-Invasive Gentle Positioning'
    ],
    visitingFee: 0,
    tags: ['In-House Radiology', 'Fast Results', 'High Precision']
  },
  // 8. In-Clinic Breed Show Styling & Spa
  {
    id: 'srv-c4',
    name: 'In-Clinic Luxury Aromatherapy Grooming & Breed Cut',
    shortName: 'In-Salon Aroma Spa & Cut',
    category: 'Grooming',
    deliveryMode: 'clinic_visit',
    price: 1499,
    mrp: 1899,
    durationMinutes: 75,
    petType: 'Dogs & Cats',
    isActive: true,
    rating: 4.9,
    reviewsCount: 145,
    image: '/images/store_grooming.jpg',
    description: 'Full pampering salon experience with aromatherapy essential oils, jacuzzi bath, precision scissor styling, and paw pedicure.',
    features: [
      'Aromatherapy Jacuzzi Bath with Lavender Oils',
      'High-Velocity Fluff Drying & De-shedding',
      'Master Stylist Scissor Breed Haircut',
      'Pawdicure with Deep Moisturizing Wax',
      'Photo-booth Pet Portrait Souvenir'
    ],
    visitingFee: 0,
    tags: ['Salon Spa', 'Master Stylist', 'Jacuzzi Bath']
  }
];

const INITIAL_ORDERS = [
  // 1. Home Grooming Service Booking
  {
    id: 'BKG-9101',
    orderType: 'home_service', // 'product_delivery' | 'home_service' | 'clinic_visit'
    serviceCategory: 'Grooming',
    serviceName: 'Doorstep Luxury Full Spa & Breed Haircut',
    petName: 'Bruno (Golden Retriever, 2 yrs)',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98230 44551',
    customerAddress: 'Villa 14, Rainbow Meadows, Jubilee Hills (2.2 km)',
    scheduledSlot: 'Today, 03:00 PM',
    items: [
      { id: 'srv-h1', name: 'At-Home Full Spa & Haircut (Mobile Van)', quantity: 1, price: 1299 },
      { id: 'srv-h4', name: 'Anti-Tick & Flea Wash Add-on', quantity: 1, price: 299 }
    ],
    totalAmount: 1598,
    paymentMethod: 'Prepaid (UPI - GPay)',
    paymentStatus: 'Paid',
    orderStatus: 'ready', // 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
    assignedDeliveryBoyId: 'db-3', // Assigned to Rahul Sharma (Certified Home Groomer)
    placedAt: '2026-09-05T12:30:00Z',
    notes: 'Please bring hypoallergenic shampoo. Golden retriever is very friendly.'
  },
  // 2. In-Clinic Veterinary Consultation
  {
    id: 'BKG-9102',
    orderType: 'clinic_visit',
    serviceCategory: 'Veterinary',
    serviceName: 'In-Clinic Comprehensive Veterinary Consultation',
    petName: 'Coco (Shih Tzu, 1 yr)',
    customerName: 'Kavita Reddy',
    customerPhone: '+91 97001 22334',
    customerAddress: 'In-Store Visit (Banjara Hills Clinic)',
    scheduledSlot: 'Today, 04:30 PM',
    items: [
      { id: 'srv-c1', name: 'In-Clinic Doctor Consultation', quantity: 1, price: 499 },
      { id: 'srv-c3', name: 'Annual DHPPiL Booster Vaccine & Health Card', quantity: 1, price: 850 }
    ],
    totalAmount: 1349,
    paymentMethod: 'Pay at Clinic Counter',
    paymentStatus: 'Pay on Arrival',
    orderStatus: 'preparing',
    assignedDeliveryBoyId: 'db-4', // Assigned to Dr. Anita Joshi
    placedAt: '2026-09-05T13:00:00Z',
    notes: 'Needs vaccination card renewal and checkup for mild coughing.'
  },
  // 3. Home Medical Checkup Visit
  {
    id: 'BKG-9103',
    orderType: 'home_service',
    serviceCategory: 'Veterinary',
    serviceName: 'At-Home Senior & Adult Pet Doctor Consultation',
    petName: 'Simba (Labrador, 4 yrs)',
    customerName: 'Vikram Seth',
    customerPhone: '+91 98877 66554',
    customerAddress: 'Plot 88, MLA Colony, Banjara Hills (1.1 km)',
    scheduledSlot: 'Today, 05:30 PM',
    items: [
      { id: 'srv-h2', name: 'At-Home Vet Consultation & Prescription', quantity: 1, price: 899 }
    ],
    totalAmount: 899,
    paymentMethod: 'Prepaid (Card - HDFC)',
    paymentStatus: 'Paid',
    orderStatus: 'new',
    assignedDeliveryBoyId: null,
    placedAt: '2026-09-05T13:40:00Z',
    notes: 'Dog has minor skin irritation on paws and itching near ears.'
  },
  // 4. In-Clinic Dental Scaling & Radiography
  {
    id: 'BKG-9104',
    orderType: 'clinic_visit',
    serviceCategory: 'Veterinary',
    serviceName: 'In-Clinic Ultrasonic Dental Scaling & Oral Polish',
    petName: 'Rocky (Beagle, 5 yrs)',
    customerName: 'Arjun Nambiar',
    customerPhone: '+91 98490 66778',
    customerAddress: 'In-Clinic Visit (Room 2, Surgery & Dental Suite)',
    scheduledSlot: 'Tomorrow, 11:00 AM',
    items: [
      { id: 'srv-c2', name: 'Ultrasonic Dental Scaling & Fluoride Polish', quantity: 1, price: 2499 }
    ],
    totalAmount: 2499,
    paymentMethod: 'Prepaid (UPI - PhonePe)',
    paymentStatus: 'Paid',
    orderStatus: 'preparing',
    assignedDeliveryBoyId: 'db-4',
    placedAt: '2026-09-05T13:55:00Z',
    notes: 'Pre-anesthesia fasting instructions given to owner.'
  },
  // 5. Home Puppy Vaccination & Microchip
  {
    id: 'BKG-9105',
    orderType: 'home_service',
    serviceCategory: 'Veterinary',
    serviceName: 'Doorstep Puppy 7-in-1 Core Vaccination',
    petName: 'Milo (French Bulldog Puppy, 3 mos)',
    customerName: 'Rohit Singhania',
    customerPhone: '+91 97112 33445',
    customerAddress: 'Flat 601, Sky High Towers, Madhapur (3.4 km)',
    scheduledSlot: 'Tomorrow, 02:00 PM',
    items: [
      { id: 'srv-h3', name: 'Doorstep Core Puppy Vaccine & Deworming', quantity: 1, price: 1099 }
    ],
    totalAmount: 1099,
    paymentMethod: 'Prepaid (UPI - Paytm)',
    paymentStatus: 'Paid',
    orderStatus: 'ready',
    assignedDeliveryBoyId: 'db-4',
    placedAt: '2026-09-05T14:10:00Z',
    notes: 'First time puppy booster. Bring puppy care kit.'
  },
  // 6. In-Clinic Luxury Spa & Show Haircut
  {
    id: 'BKG-9106',
    orderType: 'clinic_visit',
    serviceCategory: 'Grooming',
    serviceName: 'In-Clinic Luxury Aromatherapy Grooming & Breed Cut',
    petName: 'Bella (Persian Cat, 2 yrs)',
    customerName: 'Meera Chawla',
    customerPhone: '+91 99002 88990',
    customerAddress: 'In-Store Salon Visit (Banjara Hills)',
    scheduledSlot: 'Tomorrow, 03:30 PM',
    items: [
      { id: 'srv-c4', name: 'Luxury Aromatherapy Grooming & Scissor Trim', quantity: 1, price: 1499 }
    ],
    totalAmount: 1499,
    paymentMethod: 'Prepaid (Net Banking)',
    paymentStatus: 'Paid',
    orderStatus: 'new',
    assignedDeliveryBoyId: null,
    placedAt: '2026-09-05T14:15:00Z',
    notes: 'Cat requires gentle handling. Lion cut requested.'
  },
  // 7. Product Quick Delivery Order
  {
    id: 'ORD-7821',
    orderType: 'product_delivery',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98450 11223',
    customerAddress: 'Flat 402, Green Valley Apts, Road 10, Banjara Hills (1.4 km)',
    items: [
      { id: 'prod-1', name: 'Pedigree Adult Dry Dog Food 3kg', quantity: 1, price: 799 },
      { id: 'prod-6', name: 'Rubber Bone Chew Toy', quantity: 2, price: 199 }
    ],
    totalAmount: 1197,
    paymentMethod: 'Prepaid (UPI)',
    paymentStatus: 'Paid',
    orderStatus: 'out_for_delivery',
    assignedDeliveryBoyId: 'db-2',
    placedAt: '2026-09-05T12:45:00Z',
    estimatedDelivery: '15-20 mins',
    notes: 'Please ring the doorbell and leave at door.'
  },
  // 8. Product Quick Delivery Order
  {
    id: 'ORD-7822',
    orderType: 'product_delivery',
    customerName: 'Pooja Reddy',
    customerPhone: '+91 99123 44556',
    customerAddress: 'Villa 18, Palm Meadows, Jubilee Hills (2.8 km)',
    items: [
      { id: 'prod-3', name: 'Whiskas Ocean Fish Dry Food 1.2kg', quantity: 2, price: 449 },
      { id: 'prod-8', name: 'Anti-Tick & Flea Dog Shampoo', quantity: 1, price: 349 }
    ],
    totalAmount: 1247,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending Collection',
    orderStatus: 'ready',
    assignedDeliveryBoyId: null,
    placedAt: '2026-09-05T13:05:00Z',
    estimatedDelivery: '25 mins',
    notes: 'Call before arriving.'
  }
];

export function VendorProvider({ children }) {
  // Vendor profile & store details
  const [vendor, setVendor] = useState(() => {
    const saved = localStorage.getItem('paw_vendor_profile');
    if (!saved) return INITIAL_VENDOR;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.status === 'pending' && !parsed?.submittedAt) {
        return INITIAL_VENDOR;
      }
      return parsed;
    } catch (e) {
      localStorage.removeItem('paw_vendor_profile');
      return INITIAL_VENDOR;
    }
  });

  // Store products (isolated per vendor)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('paw_vendor_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Delivery team (isolated per vendor)
  const [deliveryBoys, setDeliveryBoys] = useState(() => {
    const saved = localStorage.getItem('paw_vendor_delivery_boys');
    return saved ? JSON.parse(saved) : [];
  });

  // Live Orders (isolated per vendor)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('paw_vendor_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Services Catalog (Home Services & In-Clinic Visits)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('paw_vendor_services');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Data Fetching from Backend (Strictly Scoped to Authenticated Vendor via JWT)
  const fetchVendorData = React.useCallback(async () => {
    const vendorToken = localStorage.getItem('paw_vendor_token');
    let userRole = null;
    try {
      userRole = JSON.parse(localStorage.getItem('paw_user') || '{}')?.role;
    } catch (e) {}

    // Only attempt vendor sync if vendor token exists or user is logged in as vendor/admin
    const token = vendorToken || (['vendor', 'admin'].includes(userRole) ? localStorage.getItem('paw_token') : null);
    if (!token) return;

    setIsLoading(true);
    try {
      // 1. Fetch Vendor Profile
      const profileRes = await api.getVendorProfile();
      if (!profileRes?.success) {
        if (profileRes?.message?.includes('not found')) {
           // Vendor was truncated or not found, clear stale cache!
           setVendor(INITIAL_VENDOR);
           setProducts([]);
           setServices([]);
           setOrders([]);
           setDeliveryBoys([]);
           localStorage.removeItem('paw_vendor_profile');
           localStorage.removeItem('paw_vendor_products');
           localStorage.removeItem('paw_vendor_services');
           localStorage.removeItem('paw_vendor_orders');
           localStorage.removeItem('paw_vendor_delivery_boys');
        }
        return; // Non-vendor account or missing, exit early
      }

      if (profileRes?.success && profileRes.vendor) {
        const v = profileRes.vendor;
        setVendor(prev => ({ ...prev, ...v, id: v._id || v.id }));
        localStorage.setItem('paw_vendor_profile', JSON.stringify(v));
      }

      // 2. Fetch Products & Services Catalog
      const productsRes = await api.getVendorCatalog();
      if (productsRes?.success && Array.isArray(productsRes.products)) {
        const productsOnly = productsRes.products.filter(p => p.type !== 'service');
        const servicesOnly = productsRes.products.filter(p => p.type === 'service');
        setProducts(productsOnly);
        setServices(servicesOnly);
        localStorage.setItem('paw_vendor_products', JSON.stringify(productsOnly));
        localStorage.setItem('paw_vendor_services', JSON.stringify(servicesOnly));
      }

      // 3. Fetch Orders belonging to this vendor
      const ordersRes = await api.getVendorOrders();
      if (ordersRes?.success && Array.isArray(ordersRes.orders)) {
        setOrders(ordersRes.orders);
        localStorage.setItem('paw_vendor_orders', JSON.stringify(ordersRes.orders));
      }

      // 4. Fetch Delivery Team fleet belonging to this vendor
      const teamRes = await api.getVendorDeliveryTeam();
      if (teamRes?.success && Array.isArray(teamRes.deliveryBoys)) {
        setDeliveryBoys(teamRes.deliveryBoys);
        localStorage.setItem('paw_vendor_delivery_boys', JSON.stringify(teamRes.deliveryBoys));
      }
    } catch (err) {
      console.warn('Live vendor data load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  // Operational toggle
  const toggleStoreOpen = async () => {
    try {
      const res = await api.toggleStoreOpen();
      if (res?.success) {
        setVendor(prev => {
          const updated = { ...prev, isStoreOpen: res.isStoreOpen };
          localStorage.setItem('paw_vendor_profile', JSON.stringify(updated));
          return updated;
        });
      } else {
        setVendor(prev => ({ ...prev, isStoreOpen: !prev.isStoreOpen }));
      }
    } catch (err) {
      setVendor(prev => ({ ...prev, isStoreOpen: !prev.isStoreOpen }));
    }
  };

  // 4.1 Submit Onboarding Application
  const submitOnboardingApplication = async (applicationData) => {
    const payload = {
      storeName: applicationData.storeName,
      fullName: applicationData.fullName,
      email: applicationData.email,
      phone: applicationData.phone,
      category: applicationData.businessTypes?.[0] || 'Pet Store & Services',
      businessTypes: applicationData.businessTypes || [],
      storeLicenceNumber: applicationData.storeLicenceNumber || '',
      panNumber: applicationData.panNumber || '',
      aadhaarNumber: applicationData.aadhaarNumber || '',
      gstin: applicationData.gstin || '',
      kycDocs: {
        tradeLicenceUrl: applicationData.kycDocs?.tradeLicenceUrl || '',
        panCardUrl: applicationData.kycDocs?.panCardUrl || '',
        aadhaarUrl: applicationData.kycDocs?.aadhaarUrl || ''
      },
      photos: {
        storeFront: applicationData.photos?.storeFront || '',
        interior: applicationData.photos?.interior || '',
        logo: applicationData.photos?.logo || '',
        profilePic: applicationData.photos?.profilePic || ''
      },
      bankDetails: {
        accountHolderName: applicationData.bankDetails?.accountHolderName || '',
        bankName: applicationData.bankDetails?.bankName || '',
        accountNumber: applicationData.bankDetails?.accountNumber || '',
        ifscCode: applicationData.bankDetails?.ifscCode || '',
        upiId: applicationData.bankDetails?.upiId || ''
      },
      location: applicationData.location || {},
      serviceDeliveryModes: applicationData.serviceDeliveryModes || {},
      status: 'pending'
    };

    const newVendorData = {
      ...vendor,
      ...payload,
      submittedAt: new Date().toISOString(),
      id: 'vendor-' + Date.now().toString().slice(-6)
    };

    const result = await api.submitVendorOnboarding(payload);
    if (!result?.success) {
      throw new Error(result?.message || 'Unable to submit vendor onboarding application.');
    }

    if (result?.vendor) {
      newVendorData.id = result.vendor._id || newVendorData.id;
    }

    setVendor(newVendorData);
    localStorage.setItem('paw_vendor_profile', JSON.stringify(newVendorData));
    return newVendorData;
  };

  // Approval status update
  const setApprovalStatus = (status) => {
    setVendor(prev => {
      const updated = {
        ...prev,
        status,
        approvedAt: status === 'approved' ? new Date().toISOString() : null
      };
      localStorage.setItem('paw_vendor_profile', JSON.stringify(updated));
      return updated;
    });
  };

  // 4.2 Product Operations
  const addProduct = async (newProduct) => {
    try {
      const res = await api.createVendorProduct({ ...newProduct, type: 'product' });
      if (res?.success && res?.product) {
        const added = { ...res.product, id: res.product._id || res.product.id };
        setProducts(prev => [added, ...prev]);
        return added;
      }
    } catch (err) {
      console.warn('Backend product creation notice:', err.message);
    }
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await api.updateVendorProduct(id, updatedFields);
      if (res?.success && res?.product) {
        const updated = { ...res.product, id: res.product._id || res.product.id };
        setProducts(prev => prev.map(p => (p.id === id || p._id === id) ? updated : p));
      }
    } catch (err) {
      console.warn('Product update failed:', err);
    }
  };

  const toggleProductActive = async (id) => {
    const product = products.find(p => p.id === id || p._id === id);
    if (product) {
      await updateProduct(id, { isActive: !product.isActive });
    }
  };

  const toggleProductStock = async (id) => {
    const product = products.find(p => p.id === id || p._id === id);
    if (product) {
      const inStock = !product.inStock;
      const stockCount = !inStock ? (product.stockCount > 0 ? product.stockCount : 10) : 0;
      await updateProduct(id, { inStock, stockCount });
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.deleteVendorProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
    } catch (err) {
      console.warn('Product delete failed:', err);
    }
  };

  // 4.3 Services Operations (Home Services & Clinic Visits)
  const addService = async (newService) => {
    try {
      const res = await api.createVendorProduct({ ...newService, type: 'service' });
      if (res?.success && res?.product) {
        const added = { ...res.product, id: res.product._id || res.product.id };
        setServices(prev => [added, ...prev]);
        return added;
      }
    } catch (err) {
      console.warn('Service creation failed:', err);
    }
  };

  const updateService = async (id, updatedFields) => {
    try {
      const res = await api.updateVendorProduct(id, updatedFields);
      if (res?.success && res?.product) {
        const updated = { ...res.product, id: res.product._id || res.product.id };
        setServices(prev => prev.map(s => (s.id === id || s._id === id) ? updated : s));
      }
    } catch (err) {
      console.warn('Service update failed:', err);
    }
  };

  const toggleServiceActive = async (id) => {
    const service = services.find(s => s.id === id || s._id === id);
    if (service) {
      await updateService(id, { isActive: !service.isActive });
    }
  };

  const deleteService = async (id) => {
    try {
      await api.deleteVendorProduct(id);
      setServices(prev => prev.filter(s => s.id !== id && s._id !== id));
    } catch (err) {
      console.warn('Service delete failed:', err);
    }
  };

  // 4.4 Delivery Team Operations
  const addDeliveryBoy = async (boyData) => {
    try {
      const res = await api.addVendorDeliveryBoy(boyData);
      if (res?.success && res?.deliveryBoy) {
        const added = { ...res.deliveryBoy, id: res.deliveryBoy._id || res.deliveryBoy.id };
        setDeliveryBoys(prev => [added, ...prev]);
        return added;
      }
    } catch (err) {
      console.warn('Delivery partner add failed:', err);
    }
  };

  const updateDeliveryBoyStatus = async (id, newStatus) => {
    try {
      const res = await api.updateVendorDeliveryBoy(id, { status: newStatus });
      if (res?.success && res?.deliveryBoy) {
        setDeliveryBoys(prev => prev.map(b => (b.id === id || b._id === id) ? res.deliveryBoy : b));
      } else {
        setDeliveryBoys(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      setDeliveryBoys(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: newStatus } : b));
    }
  };

  const deleteDeliveryBoy = async (id) => {
    try {
      await api.deleteVendorDeliveryBoy(id);
      setDeliveryBoys(prev => prev.filter(b => b.id !== id && b._id !== id));
    } catch (err) {
      setDeliveryBoys(prev => prev.filter(b => b.id !== id && b._id !== id));
    }
  };

  // 4.5 Orders & Delivery Partner Assignment
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      await api.assignVendorOrderDelivery(orderId, deliveryBoyId);
    } catch (err) {
      console.warn('Order assignment API error:', err);
    }

    setOrders(prev => prev.map(order => {
      if (order.id === orderId || order._id === orderId) {
        return {
          ...order,
          assignedDeliveryBoyId: deliveryBoyId,
          orderStatus: 'out_for_delivery'
        };
      }
      return order;
    }));

    if (deliveryBoyId) {
      setDeliveryBoys(prev => prev.map(b => (b.id === deliveryBoyId || b._id === deliveryBoyId) ? { ...b, status: 'busy', currentOrderId: orderId } : b));
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const targetOrder = orders.find(o => o.id === orderId || o._id === orderId);

    // If accepting or advancing order for the first time, deduct stock units immediately
    const isAcceptedOrAdvancing = ['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(newStatus);
    if (isAcceptedOrAdvancing && targetOrder && !targetOrder.stockDeducted && Array.isArray(targetOrder.items)) {
      setProducts(prevProducts => {
        const updated = prevProducts.map(prod => {
          const matchedItem = targetOrder.items.find(item => {
            if (item.type === 'service') return false;
            if (item.id && (item.id === prod.id || item.id === prod._id)) return true;
            if (item.product && (item.product === prod.id || item.product === prod._id)) return true;
            const cleanItemName = (item.name || item.title || '').replace(/\s*\([^)]*\)$/, '').trim().toLowerCase();
            const cleanProdName = (prod.name || prod.title || '').replace(/\s*\([^)]*\)$/, '').trim().toLowerCase();
            return cleanItemName && cleanProdName && (cleanItemName === cleanProdName || cleanProdName.startsWith(cleanItemName) || cleanItemName.startsWith(cleanProdName));
          });

          if (matchedItem) {
            const qty = Math.max(1, Number(matchedItem.quantity) || 1);
            const currentStock = typeof prod.stockCount === 'number' ? prod.stockCount : (typeof prod.stock === 'number' ? prod.stock : 10);
            const newStock = Math.max(0, currentStock - qty);
            return {
              ...prod,
              stockCount: newStock,
              stock: newStock,
              inStock: newStock > 0
            };
          }
          return prod;
        });

        localStorage.setItem('paw_vendor_products', JSON.stringify(updated));
        return updated;
      });
    } else if (newStatus === 'cancelled' && targetOrder && targetOrder.stockDeducted && Array.isArray(targetOrder.items)) {
      // If cancelled after acceptance, restore stock units
      setProducts(prevProducts => {
        const updated = prevProducts.map(prod => {
          const matchedItem = targetOrder.items.find(item => {
            if (item.type === 'service') return false;
            if (item.id && (item.id === prod.id || item.id === prod._id)) return true;
            if (item.product && (item.product === prod.id || item.product === prod._id)) return true;
            const cleanItemName = (item.name || item.title || '').replace(/\s*\([^)]*\)$/, '').trim().toLowerCase();
            const cleanProdName = (prod.name || prod.title || '').replace(/\s*\([^)]*\)$/, '').trim().toLowerCase();
            return cleanItemName && cleanProdName && (cleanItemName === cleanProdName || cleanProdName.startsWith(cleanItemName) || cleanItemName.startsWith(cleanProdName));
          });

          if (matchedItem) {
            const qty = Math.max(1, Number(matchedItem.quantity) || 1);
            const currentStock = typeof prod.stockCount === 'number' ? prod.stockCount : (typeof prod.stock === 'number' ? prod.stock : 0);
            const newStock = currentStock + qty;
            return {
              ...prod,
              stockCount: newStock,
              stock: newStock,
              inStock: newStock > 0
            };
          }
          return prod;
        });

        localStorage.setItem('paw_vendor_products', JSON.stringify(updated));
        return updated;
      });
    }

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId || order._id === orderId) {
          const willBeDeducted = newStatus === 'cancelled' ? false : (isAcceptedOrAdvancing ? true : order.stockDeducted);
          return {
            ...order,
            orderStatus: newStatus,
            stockDeducted: willBeDeducted,
            paymentStatus: newStatus === 'delivered' ? 'Paid' : order.paymentStatus
          };
        }
        return order;
      });
      localStorage.setItem('paw_vendor_orders', JSON.stringify(updated));
      return updated;
    });

    if (newStatus === 'delivered' || newStatus === 'cancelled') {
      const order = orders.find(o => o.id === orderId || o._id === orderId);
      if (order && order.assignedDeliveryBoyId) {
        setDeliveryBoys(prev => prev.map(b => {
          if (b.id === order.assignedDeliveryBoyId || b._id === order.assignedDeliveryBoyId) {
            return {
              ...b,
              status: 'available',
              currentOrderId: null,
              totalDeliveries: newStatus === 'delivered' ? b.totalDeliveries + 1 : b.totalDeliveries
            };
          }
          return b;
        }));
      }
    }

    try {
      await api.updateVendorOrderStatus(orderId, newStatus);
      // Re-fetch vendor catalog to synchronize exact backend DB stock
      const catalogRes = await api.getVendorCatalog();
      if (catalogRes?.success && Array.isArray(catalogRes.products)) {
        const productsOnly = catalogRes.products.filter(p => p.type !== 'service');
        const servicesOnly = catalogRes.products.filter(p => p.type === 'service');
        setProducts(productsOnly);
        setServices(servicesOnly);
        localStorage.setItem('paw_vendor_products', JSON.stringify(productsOnly));
        localStorage.setItem('paw_vendor_services', JSON.stringify(servicesOnly));
      }
    } catch (err) {
      console.warn('Order status API error:', err);
    }
  };

  const addOrder = (newOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Dynamic Summary Metrics for Dashboard
  const metrics = {
    todayRevenue: orders.filter(o => o.orderStatus !== 'cancelled').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
    activeOrdersCount: orders.filter(o => ['new', 'preparing', 'ready', 'out_for_delivery'].includes(o.orderStatus)).length,
    totalProductsCount: products.length,
    activeProductsCount: products.filter(p => p.isActive !== false).length,
    outOfStockCount: products.filter(p => !p.inStock || p.stockCount === 0).length,
    totalServicesCount: services.length,
    activeServicesCount: services.filter(s => s.isActive !== false).length,
    activeDeliveryBoysCount: deliveryBoys.filter(b => b.status === 'available' || b.status === 'busy').length,
    totalDeliveryBoysCount: deliveryBoys.length
  };

  return (
    <VendorContext.Provider
      value={{
        vendor,
        products,
        services,
        deliveryBoys,
        orders,
        metrics,
        isLoading,
        fetchVendorData,
        toggleStoreOpen,
        submitOnboardingApplication,
        setApprovalStatus,
        addProduct,
        updateProduct,
        toggleProductActive,
        toggleProductStock,
        deleteProduct,
        addService,
        updateService,
        toggleServiceActive,
        deleteService,
        addDeliveryBoy,
        updateDeliveryBoyStatus,
        deleteDeliveryBoy,
        assignDeliveryBoy,
        updateOrderStatus,
        addOrder
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
