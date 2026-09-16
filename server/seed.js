const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');
const DeliveryPartner = require('./models/DeliveryPartner');
const PlatformCMS = require('./models/PlatformCMS');
const SupportTicket = require('./models/SupportTicket');

const seedDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;
  console.log(`Connecting to MongoDB Atlas...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas Successfully!');

    // 1. Wipe all existing collections to guarantee clean state
    console.log('Purging old collections from database...');
    await Promise.all([
      User.deleteMany({}),
      Vendor.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      DeliveryPartner.deleteMany({}),
      PlatformCMS.deleteMany({}),
      SupportTicket.deleteMany({})
    ]);

    // 2. Seed Exactly 4 Users (1 Admin, 1 Vendor, 1 Rider, 1 Customer)
    console.log('Seeding 4 Core Role Accounts (Admin, Vendor, Rider, Customer)...');
    
    // Customer User
    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'customer@thepawstreet.com',
      phone: '+91 98765 43210',
      password: 'CustomerPassword@123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      pets: [
        {
          name: 'Bruno',
          species: 'Dog',
          breed: 'Golden Retriever',
          gender: 'Male',
          ageYears: 2,
          weightKg: 28,
          avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
          specialNotes: 'Loves chew bones and park fetch!'
        },
        {
          name: 'Milo',
          species: 'Cat',
          breed: 'Persian Longhair',
          gender: 'Female',
          ageYears: 1,
          weightKg: 4.2,
          avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
          specialNotes: 'Loves fish treats and warm fleece blankets.'
        }
      ],
      addresses: [
        {
          label: 'Home',
          street: 'Flat 402, Royal Palms Residency, Road No 12, Banjara Hills',
          apartment: 'Flat 402',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          lat: 17.4156,
          lng: 78.4350,
          isDefault: true
        }
      ]
    });

    // Admin User
    const adminUser = await User.create({
      name: 'Vikramaditya Rao',
      email: 'admin@pawnear.com',
      phone: '+91 99887 76655',
      password: 'AdminPassword@123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true
    });

    // Vendor User
    const vendorUser = await User.create({
      name: 'Rajesh Sharma',
      email: 'vendor@pawnear.com',
      phone: '+91 98765 43210',
      password: 'VendorPassword@123',
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    // Rider (Delivery Partner) User
    const riderUser = await User.create({
      name: 'Raju Kumar',
      email: 'rider@pawnear.com',
      phone: '+91 98451 22334',
      password: 'RiderPassword@123',
      role: 'delivery',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    });

    // 3. Seed Exactly 1 Vendor Store linked to vendorUser
    console.log('Seeding 1 Approved Vendor Store...');
    const vendor = await Vendor.create({
      user: vendorUser._id,
      storeName: 'Paws & Whiskers Supermart',
      fullName: 'Rajesh Sharma',
      email: 'vendor@pawnear.com',
      phone: '+91 98765 43210',
      category: 'Pet Food, Accessories, Grooming & Healthcare',
      businessTypes: ['Pet Store & Retail', 'Pet Grooming & Spa'],
      status: 'approved',
      commissionRate: 12,
      onboardingFeePaid: true,
      rating: 4.8,
      totalOrders: 1420,
      totalRevenue: 342500,
      location: {
        address: 'Plot 42, Road No. 12, Banjara Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        lat: 17.4156,
        lng: 78.4350
      },
      photos: {
        storeFront: '/images/hero_pets.jpg',
        interior: '/images/cat_accessories.jpg',
        logo: '/images/cat_food.jpg'
      }
    });

    // 4. Seed Products for the Single Vendor
    console.log('Seeding Products for Vendor Catalog...');
    const products = await Product.create([
      {
        title: 'Pedigree Adult Dry Dog Food 3kg',
        type: 'product',
        category: 'Dog Food',
        subCategory: 'Dry Food',
        petType: 'Dog',
        price: 799,
        mrp: 999,
        stock: 45,
        rating: 4.8,
        reviewsCount: 342,
        primaryImage: '/images/prod_pedigree.jpg',
        description: 'Complete and balanced nutrition for adult dogs with essential vitamins and minerals.',
        vendor: vendor._id,
        vendorName: vendor.storeName,
        status: 'approved'
      },
      {
        title: 'Nylon Dog Collar (Blue)',
        type: 'product',
        category: 'Accessories',
        subCategory: 'Collars & Leashes',
        petType: 'Dog',
        price: 299,
        mrp: 399,
        stock: 20,
        rating: 4.7,
        reviewsCount: 128,
        primaryImage: '/images/prod_collar_blue.jpg',
        vendor: vendor._id,
        vendorName: vendor.storeName,
        status: 'approved'
      },
      {
        title: 'Drools Focus Super Premium Adult Dog Food 4kg',
        type: 'product',
        category: 'Dog Food',
        subCategory: 'Super Premium',
        petType: 'Dog',
        price: 1899,
        mrp: 2200,
        stock: 30,
        rating: 4.9,
        reviewsCount: 215,
        primaryImage: '/images/prod_drools.jpg',
        vendor: vendor._id,
        vendorName: vendor.storeName,
        status: 'approved'
      },
      {
        title: 'Royal Canin Mother & Babycat Dry Food 2kg',
        type: 'product',
        category: 'Cat Food',
        subCategory: 'Kitten & Mother',
        petType: 'Cat',
        price: 1450,
        mrp: 1650,
        stock: 18,
        rating: 4.95,
        reviewsCount: 410,
        primaryImage: '/images/prod_royal_canin.jpg',
        vendor: vendor._id,
        vendorName: vendor.storeName,
        status: 'approved'
      },
      {
        title: 'At-Home Comprehensive Pet Spa & Grooming',
        type: 'service',
        category: 'Pet Grooming',
        subCategory: 'Home Spa',
        petType: 'All Pets',
        price: 1299,
        mrp: 1599,
        stock: 10,
        rating: 4.9,
        reviewsCount: 88,
        primaryImage: '/images/cat_grooming.jpg',
        serviceModes: ['At-Home Service', 'Clinic / Spa Visit'],
        durationMinutes: 60,
        vendor: vendor._id,
        vendorName: vendor.storeName,
        status: 'approved'
      }
    ]);

    // 5. Seed Exactly 1 Delivery Rider linked to riderUser
    console.log('Seeding 1 Delivery Captain...');
    await DeliveryPartner.create({
      user: riderUser._id,
      name: 'Raju Kumar',
      phone: '+91 98451 22334',
      email: 'rider@pawnear.com',
      vehicleNumber: 'TS 09 EQ 4421',
      vehicleType: 'EV Bike (Ather 450X)',
      onlineStatus: true,
      rating: 4.92,
      todayTrips: 8,
      todayEarnings: 760,
      cashInHand: 1450,
      currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
    });

    // 6. Seed Platform CMS
    console.log('Seeding Platform CMS...');
    await PlatformCMS.create({
      topAnnouncement: {
        text: '🐾 FREE 15-Min Express Delivery on all orders above ₹499! Use Code: PAWFIRST',
        badge: 'INSTANT',
        link: '/products',
        isActive: true
      },
      heroBanners: [
        {
          id: 'BNR-01',
          title: 'Express 15-Min Pet Delivery',
          subTitle: 'Food, Treats, Toys & Medicines Delivered Fast',
          tag: 'HYPERLOCAL SPEED',
          image: '/images/hero_pets.jpg',
          link: '/products',
          bgColor: 'from-amber-400 to-amber-500',
          isActive: true
        }
      ],
      deliveryPricing: {
        baseFee: 39,
        freeDeliveryThreshold: 499,
        perKmExtraFee: 12,
        rainSurgeMultiplier: 1.2
      }
    });

    // 7. Seed Sample Support Ticket for Admin
    console.log('Seeding Support Ticket...');
    await SupportTicket.create({
      ticketId: 'TCK-8821',
      subject: 'Order Tracking Query - Instant Express',
      customerName: 'Aarav Sharma',
      customerPhone: '+91 98765 43210',
      category: 'Delivery Delay',
      priority: 'Medium',
      status: 'in_progress',
      assignedStaff: {
        id: 'ADM-001',
        name: 'Vikramaditya Rao'
      },
      messages: [
        {
          sender: 'Customer',
          text: 'Can I check the live GPS ETA for order ORD-89421?',
          timestamp: new Date()
        }
      ]
    });

    console.log('\n================================================================');
    console.log('✨ DATABASE RE-SEEDED WITH EXACTLY 4 ACCOUNTS (1 OF EACH ROLE):');
    console.log('================================================================');
    console.log('👑 1. ADMIN:');
    console.log('   Email:    admin@pawnear.com');
    console.log('   Password: AdminPassword@123');
    console.log('   Role:     admin (Vikramaditya Rao)\n');
    console.log('🏪 2. VENDOR:');
    console.log('   Email:    vendor@pawnear.com');
    console.log('   Password: VendorPassword@123');
    console.log('   Role:     vendor (Rajesh Sharma - Paws & Whiskers Supermart)\n');
    console.log('🛵 3. RIDER (DELIVERY):');
    console.log('   Email:    rider@pawnear.com');
    console.log('   Password: RiderPassword@123');
    console.log('   Role:     delivery (Raju Kumar - EV Bike TS 09 EQ 4421)\n');
    console.log('🐾 4. CUSTOMER:');
    console.log('   Email:    customer@thepawstreet.com');
    console.log('   Password: CustomerPassword@123');
    console.log('   Role:     customer (Aarav Sharma - Pets: Bruno & Milo)\n');
    console.log('================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database Seed Failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
