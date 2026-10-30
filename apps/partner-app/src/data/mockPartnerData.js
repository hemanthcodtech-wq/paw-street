export const SEED_VENDOR = {
  id: 'vnd-101',
  storeName: 'PAW NEAR Central Store',
  ownerName: 'Rajesh Sharma',
  email: 'vendor@pawnear.in',
  phone: '+91 98765 43210',
  role: 'vendor',
  status: 'active',
  city: 'Hyderabad',
  area: 'Banjara Hills',
  isStoreOpen: true,
  rating: 4.9,
  totalOrders: 184,
  todayRevenue: 12450,
  pendingOrdersCount: 3,
  walletBalance: 48920
};

export const SEED_DELIVERY_RIDER = {
  id: 'rid-202',
  name: 'Raju Kumar',
  email: 'delivery@pawnear.in',
  phone: '+91 98451 22334',
  role: 'delivery',
  status: 'active',
  vehicleType: 'EV Scooter',
  vehicleNumber: 'TS 09 EQ 4421',
  drivingLicense: 'DL-0420190021345',
  isDutyOnline: true,
  rating: 4.92,
  todayTrips: 6,
  todayEarnings: 840,
  cashInHand: 1450,
  walletBalance: 3250
};

export const VENDOR_ORDERS = [
  {
    id: 'ORD-9821',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98450 11223',
    items: [
      { name: 'Royal Canin Maxi Adult Dog Food (4 kg)', quantity: 1, price: 3499 },
      { name: 'Pedigree Dentastix Dental Chews', quantity: 2, price: 998 }
    ],
    total: 4497,
    paymentMethod: 'Prepaid (UPI)',
    status: 'Ready for Pickup', // New, Preparing, Ready for Pickup, Dispatched, Delivered
    orderTime: '10 mins ago',
    deliveryPartnerAssigned: 'Raju Kumar (EV Scooter)',
    deliveryAddress: 'Flat 402, Green Valley Apts, Road 12, Banjara Hills'
  },
  {
    id: 'ORD-9822',
    customerName: 'Pooja Reddy',
    customerPhone: '+91 99000 23412',
    items: [
      { name: 'Whiskas Ocean Fish Adult Cat Food (3 kg)', quantity: 1, price: 899 },
      { name: 'KONG Classic Chew Toy (Large)', quantity: 1, price: 1150 }
    ],
    total: 2049,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'Preparing',
    orderTime: '18 mins ago',
    deliveryPartnerAssigned: 'Pending Rider Assignment',
    deliveryAddress: 'Plot 55, Jubilee Hills, Hyderabad'
  },
  {
    id: 'ORD-9820',
    customerName: 'Vikram Joshi',
    customerPhone: '+91 98111 55432',
    items: [
      { name: 'Himalaya Erina-EP Tick & Flea Shampoo (200ml)', quantity: 2, price: 640 }
    ],
    total: 640,
    paymentMethod: 'Prepaid',
    status: 'Delivered',
    orderTime: '1 hour ago',
    deliveryPartnerAssigned: 'Suresh Varma',
    deliveryAddress: 'Road No 3, Banjara Hills'
  }
];

export const VENDOR_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Royal Canin Maxi Adult Dog Food',
    category: 'Dog Food',
    price: 3499,
    stock: 24,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-2',
    name: 'Whiskas Ocean Fish Adult Cat Food',
    category: 'Cat Food',
    price: 899,
    stock: 15,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-3',
    name: 'Trixie Plush Orthopedic Memory Foam Bed',
    category: 'Beds',
    price: 2199,
    stock: 6,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-4',
    name: 'Himalaya Erina-EP Tick & Flea Shampoo',
    category: 'Grooming',
    price: 320,
    stock: 0,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-5',
    name: 'Pedigree Dentastix Daily Dental Chews',
    category: 'Treats',
    price: 499,
    stock: 40,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80'
  }
];

export const DELIVERY_ACTIVE_TASK = {
  orderId: 'ORD-9821',
  pickupStore: 'Paw Street Central Store',
  pickupAddress: 'Road No 12, Banjara Hills, Hyderabad',
  customerName: 'Aarav Sharma',
  customerPhone: '+91 98450 11223',
  dropAddress: 'Flat 402, Green Valley Apts, Road 12, Banjara Hills',
  distance: '1.4 km',
  estimatedFee: '₹65 + ₹20 Surge',
  otp: '4821',
  paymentType: 'Prepaid (Do not collect cash)',
  itemsCount: 3,
  status: 'picked_up' // 'assigned', 'picked_up', 'delivered'
};

export const DELIVERY_ORDER_POOL = [
  {
    id: 'ORD-POOL-1',
    storeName: 'City Vet Pharmacy & Supplies',
    pickupAddress: 'Jubilee Hills Check Post',
    customerAddress: 'Film Nagar, Road No 7',
    distance: '2.8 km',
    estEarnings: '₹85',
    itemsCount: 2,
    readyStatus: 'Ready for Pickup'
  },
  {
    id: 'ORD-POOL-2',
    storeName: 'Paw Street Central Store',
    pickupAddress: 'Road No 12, Banjara Hills',
    customerAddress: 'Somajiguda, Hyderabad',
    distance: '3.5 km',
    estEarnings: '₹110',
    itemsCount: 4,
    readyStatus: 'Ready for Pickup'
  }
];

