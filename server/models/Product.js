const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide product/service title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    default: 'product'
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  subCategory: {
    type: String,
    default: ''
  },
  petType: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Fish', 'All Pets'],
    default: 'Dog'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: false
  },
  vendorName: {
    type: String,
    default: 'PAW NEAR Direct'
  },
  price: {
    type: Number,
    required: [true, 'Please provide sale price']
  },
  mrp: {
    type: Number,
    required: [true, 'Please provide MRP']
  },
  stock: {
    type: Number,
    default: 100
  },
  images: [{
    type: String
  }],
  primaryImage: {
    type: String,
    default: '/images/prod_drools.jpg'
  },
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected'],
    default: 'approved'
  },
  rating: {
    type: Number,
    default: 4.8
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isFlashDeal: {
    type: Boolean,
    default: false
  },
  // Specific for Services
  serviceModes: [{
    type: String,
    enum: ['At-Home Service', 'Clinic / Spa Visit']
  }],
  durationMinutes: {
    type: Number,
    default: 45
  },
  rejectionReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
