const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  title: { type: String, required: true },
  image: { type: String, default: '/images/prod_drools.jpg' },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  vendorId: { type: String, default: '' },
  vendorName: { type: String, default: '' },
  type: { type: String, enum: ['product', 'service'], default: 'product' },
  serviceMode: { type: String, default: '' } // 'At-Home Service', 'Clinic Visit'
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, required: true },
  items: [orderItemSchema],
  shippingAddress: {
    label: { type: String, default: 'Home' },
    street: { type: String, required: true },
    city: { type: String, default: 'Hyderabad' },
    pincode: { type: String, required: true },
    lat: { type: Number, default: 17.4319 },
    lng: { type: Number, default: 78.4073 },
    instructions: { type: String, default: '' }
  },
  pricing: {
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 49 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['COD', 'RAZORPAY_ONLINE', 'UPI', 'WALLET'],
      default: 'RAZORPAY_ONLINE'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    isCodCollected: { type: Boolean, default: false },
    codTenderedAmount: { type: Number, default: 0 }
  },
  settlement: {
    status: {
      type: String,
      enum: ['pending', 'processed'],
      default: 'pending'
    },
    vendorGrossAmount: { type: Number, default: 0 },
    platformCommission: { type: Number, default: 0 },
    vendorNetAmount: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    riderPayoutAmount: { type: Number, default: 0 },
    riderPayoutRate: { type: Number, default: 0.6 },
    payoutReference: { type: String, default: '' },
    paidAt: { type: Date, default: null },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'store_preparing', 'assigned_rider', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  stockDeducted: {
    type: Boolean,
    default: false
  },
  appointment: {
    mode: {
      type: String,
      enum: ['product_delivery', 'home_service', 'clinic_visit', ''],
      default: ''
    },
    scheduledSlot: { type: String, default: '' },
    petName: { type: String, default: '' },
    serviceCategory: { type: String, default: '' },
    serviceName: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  deliveryOtp: {
    type: String,
    default: '4821'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: false
  },
  assignedDeliveryBoyId: {
    type: String,
    default: null
  },
  assignedRider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner',
    required: false
  },
  riderName: { type: String, default: 'Raju Kumar' },
  riderPhone: { type: String, default: '+91 98451 22334' },
  statusTimeline: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
