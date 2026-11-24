const mongoose = require('mongoose');

const vendorSubscriptionSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  storeName: { type: String, required: true },
  planId: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: true
  },
  planName: { type: String, required: true },
  price: { type: Number, required: true }, // e.g. 0, 1499, 2999
  interval: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
  commissionRate: { type: Number, default: 12 }, // Basic: 12%, Pro: 7%, Elite: 3%
  maxProducts: { type: Number, default: 20 }, // Basic: 20, Pro: 100, Elite: 9999
  isVerifiedSellerBadge: { type: Boolean, default: false },
  priorityListing: { type: Boolean, default: false },
  features: [{ type: String }],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentDetails: {
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    amountPaid: { type: Number, default: 0 },
    paidAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VendorSubscription', vendorSubscriptionSchema);
