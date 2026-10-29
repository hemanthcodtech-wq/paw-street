export const CATEGORIES = [
  {
    id: 'food',
    name: 'Pet Food',
    subtitle: 'Dry, wet & organic',
    icon: '🍖',
    badge: '15 Min Delivery',
    color: '#FFEDD5',
    iconColor: '#EA580C',
    subcategories: ['Dog Food', 'Cat Food', 'Puppy Food', 'Treats & Chews', 'Wet Food']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subtitle: 'Collars, toys & beds',
    icon: '🎀',
    badge: 'Trending',
    color: '#FEF3C7',
    iconColor: '#D97706',
    subcategories: ['Collars', 'Leashes', 'Beds', 'Harnesses', 'Bowls', 'Toys']
  },
  {
    id: 'grooming',
    name: 'Grooming',
    subtitle: 'Baths, haircuts & spa',
    icon: '✂️',
    badge: 'Popular',
    color: '#D1FAE5',
    iconColor: '#059669',
    subcategories: ['Bath & Dry', 'Hair Cut', 'Nail Trimming', 'Full Spa']
  },
  {
    id: 'clinic',
    name: 'Pet Clinic',
    subtitle: 'Verified veterinarians',
    icon: '🏥',
    badge: 'Doctor On-Call',
    color: '#DBEAFE',
    iconColor: '#2563EB',
    subcategories: ['General Checkup', 'Vaccinations', 'Dental Care', 'Emergency']
  },
  {
    id: 'medicine',
    name: 'Medicine',
    subtitle: 'Prescriptions & health',
    icon: '💊',
    badge: 'Verified',
    color: '#FFE4E6',
    iconColor: '#E11D48',
    subcategories: ['Flea & Tick', 'Deworming', 'Joint Supplements', 'Vitamins']
  },
  {
    id: 'boarding',
    name: 'Boarding',
    subtitle: 'Safe day care & stays',
    icon: '🏡',
    badge: 'CCTV Live',
    color: '#EDE9FE',
    iconColor: '#7C3AED',
    subcategories: ['Day Care', 'Overnight Stay', 'Pet Sitting']
  },
  {
    id: 'pet-sale',
    name: 'Pets for Sale',
    subtitle: 'Adopt a companion',
    icon: '🐾',
    badge: 'Verified Breeders',
    color: '#ECFCCB',
    iconColor: '#65A30D',
    subcategories: ['Dogs', 'Cats', 'Birds', 'Fish']
  }
];

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Drools Focus Adult Super Premium Dog Food',
    shortName: 'Drools Focus Adult',
    category: 'food',
    price: 1899,
    mrp: 2299,
    discount: '17% OFF',
    rating: 4.8,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    storeName: 'Paw Street Superstore',
    eta: '15 min',
    tags: ['top_pick', 'trending'],
    description: 'Complete nutritional balance formulated with real chicken, wholesome grains, vitamins, and minerals for adult dogs.',
    sizes: [
      { size: '3 kg', price: 1899, mrp: 2299 },
      { size: '10 kg', price: 4999, mrp: 5800 },
      { size: '15 kg', price: 6899, mrp: 7999 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Royal Canin Maxi Puppy Dry Food',
    shortName: 'Royal Canin Puppy',
    category: 'food',
    price: 3150,
    mrp: 3500,
    discount: '10% OFF',
    rating: 4.9,
    reviewsCount: 521,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80',
    storeName: 'Paw Street Superstore',
    eta: '15 min',
    tags: ['top_pick'],
    description: 'Specially crafted for large breed puppies (adult weight from 26 to 44 kg). Supports natural defences and digestive health.',
    sizes: [
      { size: '4 kg', price: 3150, mrp: 3500 },
      { size: '10 kg', price: 7200, mrp: 7999 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Whiskas Ocean Fish Adult Cat Food',
    shortName: 'Whiskas Ocean Fish',
    category: 'food',
    price: 499,
    mrp: 590,
    discount: '15% OFF',
    rating: 4.7,
    reviewsCount: 280,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    storeName: 'Banjara Pet Hub',
    eta: '20 min',
    tags: ['trending'],
    description: 'Delicious ocean fish kibbles packed with essential omega 3 & 6 fatty acids for a lustrous coat and sharp eyesight.',
    sizes: [
      { size: '1.2 kg', price: 499, mrp: 590 },
      { size: '3 kg', price: 1099, mrp: 1250 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Reflective Padded Anti-Pull Dog Harness',
    shortName: 'Anti-Pull Harness',
    category: 'accessories',
    price: 849,
    mrp: 1299,
    discount: '35% OFF',
    rating: 4.6,
    reviewsCount: 164,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    storeName: 'Canine Craze Banjara',
    eta: '25 min',
    tags: ['trending', 'top_pick'],
    description: 'Ergonomic no-choke harness with ultra-bright 3M reflective straps for safe night walking and comfortable control.',
    sizes: [
      { size: 'Medium (M)', price: 849, mrp: 1299 },
      { size: 'Large (L)', price: 999, mrp: 1499 },
      { size: 'XL', price: 1199, mrp: 1699 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Natural Neem & Tea Tree Organic Pet Shampoo',
    shortName: 'Neem Pet Shampoo',
    category: 'grooming',
    price: 420,
    mrp: 550,
    discount: '24% OFF',
    rating: 4.8,
    reviewsCount: 198,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    storeName: 'Paw Street Superstore',
    eta: '15 min',
    tags: ['new'],
    description: 'Soothes dry itchy skin, repels fleas & ticks, and leaves coat soft and smelling naturally fresh without sulfates.',
    sizes: [
      { size: '250 ml', price: 420, mrp: 550 },
      { size: '500 ml', price: 749, mrp: 950 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Bravecto Chewable Tick & Flea Protection',
    shortName: 'Bravecto Tick Chew',
    category: 'medicine',
    price: 2150,
    mrp: 2400,
    discount: '10% OFF',
    rating: 4.9,
    reviewsCount: 412,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    storeName: 'Dr. Rao Vet Pharmacy',
    eta: '30 min',
    tags: ['top_pick'],
    description: 'Single dose tasty chewable tablet provides 12 weeks of persistent flea and tick elimination.',
    sizes: [
      { size: 'For 10-20kg Dog', price: 2150, mrp: 2400 },
      { size: 'For 20-40kg Dog', price: 2550, mrp: 2800 }
    ]
  },
  {
    id: 'prod-7',
    name: 'Calming Orthopedic Memory Foam Pet Bed',
    shortName: 'Orthopedic Pet Bed',
    category: 'accessories',
    price: 1899,
    mrp: 2799,
    discount: '32% OFF',
    rating: 4.9,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
    storeName: 'Paw Street Superstore',
    eta: '15 min',
    tags: ['trending'],
    description: 'Ultra-luxurious orthopedic memory foam base with water-resistant washable cover to relieve joint stress.',
    sizes: [
      { size: 'Medium (60x45cm)', price: 1899, mrp: 2799 },
      { size: 'Large (90x70cm)', price: 2799, mrp: 3899 }
    ]
  },
  {
    id: 'prod-8',
    name: 'Pedigree Adult Meat & Rice Wet Pouch (Pack of 12)',
    shortName: 'Pedigree Wet Pouches',
    category: 'food',
    price: 540,
    mrp: 600,
    discount: '10% OFF',
    rating: 4.6,
    reviewsCount: 140,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80',
    storeName: 'Banjara Pet Hub',
    eta: '20 min',
    tags: ['new'],
    description: 'Tasty chunks in gravy with 38 essential nutrients, easy to digest and ideal for mixing with dry food.',
    sizes: [
      { size: '12 x 100g', price: 540, mrp: 600 }
    ]
  }
];

export const STORES = [
  {
    id: 'store-1',
    name: 'Paw Street Superstore',
    rating: 4.9,
    reviewsCount: 520,
    city: 'Banjara Hills, Hyderabad',
    distance: '1.2 km',
    eta: '15 min',
    isOpen: true,
    tags: ['Direct Store', 'Express Delivery', '100% Genuine'],
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-2',
    name: 'Banjara Pet Care & Pharmacy',
    rating: 4.8,
    reviewsCount: 310,
    city: 'Road No 12, Hyderabad',
    distance: '2.4 km',
    eta: '20 min',
    isOpen: true,
    tags: ['Medicines', 'Vitamins', 'Doctor Available'],
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-3',
    name: 'The Wagging Tails Salon',
    rating: 4.9,
    reviewsCount: 230,
    city: 'Jubilee Hills, Hyderabad',
    distance: '3.1 km',
    eta: '25 min',
    isOpen: true,
    tags: ['Luxury Spa', 'Hydro Bath', 'Hair Styling'],
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80'
  }
];

export const SERVICES = [
  {
    id: 'serv-1',
    name: 'Complete Spa & Grooming Session',
    category: 'grooming',
    price: 1299,
    mrp: 1800,
    duration: '90 mins',
    rating: 4.9,
    provider: 'The Wagging Tails Salon',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    description: 'Warm hydro-massage bath, blow dry, nail clipping, ear cleaning, hygienic paw trim and scented coat spritz.',
    includes: ['Anti-flea shampoo', 'Nail clipping & filing', 'Ear & teeth cleaning', 'Fluff dry & comb out']
  },
  {
    id: 'serv-2',
    name: 'Comprehensive Vet Health Checkup',
    category: 'clinic',
    price: 499,
    mrp: 750,
    duration: '30 mins',
    rating: 4.9,
    provider: 'Dr. Rao Vet Care Clinic',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    description: 'Full vital screening, heart & lungs check, dental inspection, eye/ear exam, weight and diet assessment.',
    includes: ['Physical examination', 'Dietary consultation', 'Deworming check', 'Digital health card']
  },
  {
    id: 'serv-3',
    name: 'Luxury Overnight Pet Boarding & Stay',
    category: 'boarding',
    price: 999,
    mrp: 1400,
    duration: 'Per Day',
    rating: 4.8,
    provider: 'Happy Paws Resort & Suites',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
    description: 'Air-conditioned private suites, 24/7 CCTV livestream access to pet parents, 3 wholesome meals, and outdoor play sessions.',
    includes: ['Private cozy suite', '24/7 Live CCTV feed', '3 custom meals', 'Two daily walks in green lawn']
  }
];

export const COUPONS = [
  { code: 'PAWFIRST', discount: 200, minOrder: 500, label: '₹200 OFF on First Order' },
  { code: 'PETLOVE', discount: 150, minOrder: 800, label: '₹150 OFF on Pet Supplies' },
  { code: 'MEGAPAW', discount: 500, minOrder: 2500, label: '₹500 OFF on Orders Above ₹2500' }
];

export const USER_SEED = {
  id: 'usr-customer-1',
  name: 'Aarav Sharma',
  email: 'customer@thepawstreet.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  isLoggedIn: true,
  pets: [
    {
      id: 'pet-1',
      name: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2 Years',
      gender: 'Male',
      weight: '28 kg',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pet-2',
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian Longhair',
      age: '1 Year',
      gender: 'Female',
      weight: '4.2 kg',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
    }
  ],
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Royal Palms Residency, Road No 12, Banjara Hills',
      city: 'Hyderabad',
      pincode: '500034',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: 'Cyber Towers, Hitech City',
      city: 'Hyderabad',
      pincode: '500081',
      isDefault: false
    }
  ]
};
