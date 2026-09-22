const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  storeName: {
    type: String,
    required: [true, 'Please provide store name'],
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Please provide primary manager name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide store email'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide store contact phone']
  },
  category: {
    type: String,
    default: 'Pet Food, Accessories, Grooming & Healthcare'
  },
  businessTypes: [{
    type: String,
    enum: ['Pet Store & Retail', 'Pet Grooming & Spa', 'Veterinary Clinic & Hospital', 'Pet Boarding & Hostel', 'Pet Boarding & Daycare']
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  commissionRate: {
    type: Number,
    default: 12 // in %
  },
  onboardingFeePaid: {
    type: Boolean,
    default: true
  },
  onboardingFeeAmount: {
    type: Number,
    default: 2499
  },
  rating: {
    type: Number,
    default: 4.8
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  // KYC Documents
  storeLicenceNumber: {
    type: String,
    default: ''
  },
  panNumber: {
    type: String,
    default: ''
  },
  aadhaarNumber: {
    type: String,
    default: ''
  },
  kycDocs: {
    tradeLicenceUrl: { type: String, default: '' },
    panCardUrl: { type: String, default: '' },
    aadhaarUrl: { type: String, default: '' }
  },
  // Store Location & GPS Coordinates
  location: {
    address: { type: String, default: '' },
    city: { type: String, default: 'Hyderabad' },
    state: { type: String, default: 'Telangana' },
    pincode: { type: String, default: '500034' },
    lat: { type: Number, default: 17.4156 },
    lng: { type: Number, default: 78.4350 }
  },
  // Cloudinary / Local Photos
  photos: {
    storeFront: { type: String, default: '/images/hero_pets.jpg' },
    interior: { type: String, default: '/images/cat_accessories.jpg' },
    logo: { type: String, default: '/images/cat_food.jpg' },
    profilePic: { type: String, default: '' }
  },
  // Service modes & fees
  serviceDeliveryModes: {
    homeServiceEnabled: { type: Boolean, default: true },
    clinicVisitEnabled: { type: Boolean, default: true },
    homeServiceFee: { type: Number, default: 99 }
  },
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
    upiId: { type: String, default: '' }
  },
  reviewNotes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  isStoreOpen: {
    type: Boolean,
    default: true
  },
  deliveryTeam: [{
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    role: { type: String, default: 'delivery_rider' },
    roleTitle: { type: String, default: 'Quick Delivery Partner' },
    vehicleType: { type: String, default: 'Electric Bike' },
    vehicleNumber: { type: String, default: '' },
    drivingLicence: { type: String, default: '' },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    rating: { type: Number, default: 4.9 },
    totalDeliveries: { type: Number, default: 0 },
    joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    avatar: { type: String, default: '' },
    // Bank / UPI details for payout reconciliation
    bankDetails: {
      accountHolderName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
      upiId: { type: String, default: '' }
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema);
