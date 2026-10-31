export const PET_CATEGORIES = [
  { id: 'all', name: 'All Pets', icon: 'paw', bg: '#FFF3B0', color: '#B45309' },
  { id: 'dogs', name: 'Dogs', icon: 'logo-octocat', bg: '#FFE4E6', color: '#BE123C' },
  { id: 'cats', name: 'Cats', icon: 'heart', bg: '#EDE9FE', color: '#6D28D9' },
  { id: 'birds', name: 'Birds', icon: 'paper-plane', bg: '#DCFCE7', color: '#15803D' },
  { id: 'fishes', name: 'Fishes', icon: 'water', bg: '#E0F2FE', color: '#0369A1' },
  { id: 'small-pets', name: 'Small Pets', icon: 'happy', bg: '#FEF3C7', color: '#B45309' },
];

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Royal Canin Maxi Adult Dog Food',
    brand: 'Royal Canin',
    category: 'Food',
    petType: 'dogs',
    price: 3499,
    originalPrice: 3899,
    discount: '10% OFF',
    rating: 4.8,
    reviewsCount: 342,
    weight: '4 kg',
    inStock: true,
    badge: 'BESTSELLER',
    deliveryTime: 'Today by 6 PM',
    storeName: 'PAW NEAR Central Store',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    description: 'Complete nutritional formula specifically tailored for adult large breed dogs (26 to 44 kg). Supports optimal bone & joint health and promotes digestive performance with high-quality protein and balanced dietary fiber.',
    nutrition: ['Protein: 26%', 'Fat: 17%', 'Fiber: 1.3%', 'Omega-3 fatty acids: EPA/DHA']
  },
  {
    id: 'prod-2',
    name: 'Whiskas Ocean Fish Adult Cat Food',
    brand: 'Whiskas',
    category: 'Food',
    petType: 'cats',
    price: 899,
    originalPrice: 1050,
    discount: '14% OFF',
    rating: 4.7,
    reviewsCount: 189,
    weight: '3 kg',
    inStock: true,
    badge: 'POPULAR',
    deliveryTime: 'Today in 2 Hours',
    storeName: 'Furry Friends Boutique',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    description: 'Crunchy kibble packed with tasty real salmon & tuna chunks. Specially enriched with calcium, phosphorus and vitamin D for sturdy teeth and glossy coat.',
    nutrition: ['Crude Protein: 30%', 'Crude Fat: 10%', 'Moisture: 12%']
  },
  {
    id: 'prod-3',
    name: 'Trixie Plush Orthopedic Memory Foam Bed',
    brand: 'Trixie',
    category: 'Beds',
    petType: 'dogs',
    price: 2199,
    originalPrice: 2899,
    discount: '24% OFF',
    rating: 4.9,
    reviewsCount: 95,
    weight: 'Medium (75x60cm)',
    inStock: true,
    badge: 'PREMIUM',
    deliveryTime: 'Tomorrow Morning',
    storeName: 'PAW NEAR Central Store',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-soft therapeutic memory foam bed alleviating joint pressure points. Removable and machine-washable waterproof velvet cover with non-skid bottom.',
    nutrition: ['High-density Visco-elastic foam', 'Waterproof inner liner', 'Anti-skid bottom']
  },
  {
    id: 'prod-4',
    name: 'Himalaya Erina-EP Tick & Flea Shampoo',
    brand: 'Himalaya Pet',
    category: 'Grooming',
    petType: 'dogs',
    price: 320,
    originalPrice: 380,
    discount: '15% OFF',
    rating: 4.6,
    reviewsCount: 421,
    weight: '200 ml',
    inStock: true,
    badge: 'AYURVEDIC',
    deliveryTime: 'Today in 30 Mins',
    storeName: 'City Vet Pharmacy & Groomers',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    description: 'Herbal antiseptic ectoparasitic shampoo. Powered with Neem and Eucalyptus oils that safeguard pets against ticks, lice, fleas, and dermal pathogens gently.',
    nutrition: ['Neem extract', 'Eucalyptus oil', 'pH balanced for pet skin']
  },
  {
    id: 'prod-5',
    name: 'Pedigree Dentastix Daily Dental Chews (Large Dogs)',
    brand: 'Pedigree',
    category: 'Treats',
    petType: 'dogs',
    price: 499,
    originalPrice: 599,
    discount: '17% OFF',
    rating: 4.7,
    reviewsCount: 520,
    weight: '7 Sticks (270g)',
    inStock: true,
    badge: 'VET RECOMMENDED',
    deliveryTime: 'Today in 2 Hours',
    storeName: 'PAW NEAR Central Store',
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=600&q=80',
    description: 'Clinically proven X-shape dental chew sticks. Reduces tartar build-up by up to 80% while freshening breath with natural active green tea ingredients.',
    nutrition: ['Zinc Sulfate', 'Sodium Tripolyphosphate', 'Low in fat']
  },
  {
    id: 'prod-6',
    name: 'KONG Classic Durable Rubber Chew Toy',
    brand: 'KONG',
    category: 'Toys',
    petType: 'dogs',
    price: 1150,
    originalPrice: 1300,
    discount: '12% OFF',
    rating: 4.9,
    reviewsCount: 310,
    weight: 'Large (Red)',
    inStock: true,
    badge: 'DURABLE',
    deliveryTime: 'Today by 5 PM',
    storeName: 'Paws & Whiskers Hub',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80',
    description: 'The gold standard of dog toys for over 40 years. Ultra-bouncing, all-natural red rubber compound. Perfect for stuffable peanut butter treats to solve boredom.',
    nutrition: ['100% Non-toxic natural rubber', 'Mentally stimulating puzzle']
  }
];

export const STORES = [
  {
    id: 'store-1',
    name: 'Paw Street Central Superstore',
    rating: 4.9,
    reviews: 640,
    distance: '1.2 km away',
    time: '15-20 min',
    address: 'Road No 12, Banjara Hills, Hyderabad',
    lat: 17.4156,
    lng: 78.4350,
    openStatus: 'Open Now • Closes 10:30 PM',
    verified: true,
    categories: ['Pet Food', 'Grooming Spa', 'Pharmacy', 'Toys'],
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-2',
    name: 'City Vet Clinic & Pet Spares',
    rating: 4.8,
    reviews: 382,
    distance: '2.5 km away',
    time: '25-30 min',
    address: 'Near Jubilee Hills Check Post, Hyderabad',
    lat: 17.4319,
    lng: 78.4073,
    openStatus: 'Open 24/7 (Emergency Available)',
    verified: true,
    categories: ['Veterinary Doctor', 'Vaccines', 'Diet Food'],
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-3',
    name: 'Paws & Whiskers Luxury Spa',
    rating: 4.7,
    reviews: 219,
    distance: '3.8 km away',
    time: '35 min',
    address: 'Hitech City Main Road, Madhapur, Hyderabad',
    lat: 17.4483,
    lng: 78.3915,
    openStatus: 'Open Now • Closes 9:00 PM',
    verified: true,
    categories: ['Bath & Haircut', 'Nail Trimming', 'De-shedding'],
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-4',
    name: 'Cyber Pet Hub & Pharmacy',
    rating: 4.9,
    reviews: 512,
    distance: '4.2 km away',
    time: '20-25 min',
    address: 'DLF Cyber City, Gachibowli, Hyderabad',
    lat: 17.4401,
    lng: 78.3489,
    openStatus: 'Open Now • Closes 11:00 PM',
    verified: true,
    categories: ['Prescription Diets', 'Supplements', 'Chew Toys'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'store-5',
    name: 'Royal Paws Boutique & Kennel Care',
    rating: 4.8,
    reviews: 298,
    distance: '5.1 km away',
    time: '30-40 min',
    address: 'Begumpet Airport Road, Hyderabad',
    lat: 17.4447,
    lng: 78.4664,
    openStatus: 'Open Now • Closes 10:00 PM',
    verified: true,
    categories: ['Boarding', 'Imported Foods', 'Grooming'],
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'
  }
];

export const SERVICES = [
  {
    id: 'srv-1',
    title: 'Full Spa & Styling Bath',
    price: 999,
    duration: '60 mins',
    rating: 4.9,
    icon: 'sparkles',
    description: 'Aromatic bath, anti-flea dip, blow dry, ear cleaning & paw pad moisturization.',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'srv-2',
    title: 'Vet Consultation at Home',
    price: 699,
    duration: '30 mins',
    rating: 4.8,
    icon: 'medkit',
    description: 'Certified senior veterinary doctor home visit for health checkup, fever, or vaccination.',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'srv-3',
    title: 'Daily Dog Walking (30 Days)',
    price: 2499,
    duration: '45 mins/day',
    rating: 4.9,
    icon: 'walk',
    description: 'Trained and verified pet walkers with live GPS tracking and daily walk reports.',
    image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'srv-4',
    title: 'Cage-Free Pet Resort Boarding',
    price: 799,
    duration: 'Per Day',
    rating: 4.8,
    icon: 'home',
    description: '24/7 supervised cage-free boarding with organic meals, playtime & video updates.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500&q=80'
  }
];

export const COUPONS = [
  { code: 'PAWFIRST', discount: 15, maxDiscount: 200, label: '15% OFF on first order' },
  { code: 'SUPERPET', discount: 20, maxDiscount: 350, label: '20% OFF above ₹1499' }
];

export const USER_SEED = {
  id: 'usr-customer-01',
  name: 'Aarav Sharma',
  email: 'customer@thepawstreet.com',
  phone: '+91 98450 11223',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  pets: [
    {
      id: 'pet-1',
      name: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '2.5 Years',
      gender: 'Male',
      weight: '31 kg',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pet-2',
      name: 'Mochi',
      species: 'Cat',
      breed: 'Persian White',
      age: '1 Year',
      gender: 'Female',
      weight: '4.2 kg',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
    }
  ]
};

