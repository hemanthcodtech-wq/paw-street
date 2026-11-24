const mongoose = require('mongoose');

const petVanBookingSchema = new mongoose.Schema({
  bookingId: {
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
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  servicePackage: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    duration: { type: String, default: '60 mins' },
    price: { type: Number, required: true }
  },
  petDetails: {
    name: { type: String, required: true },
    type: { type: String, default: 'dog' },
    breed: { type: String, default: 'Golden Retriever' },
    ageYears: { type: Number, default: 2 },
    weightKg: { type: Number, default: 15 }
  },
  appointment: {
    date: { type: String, required: true }, // 'YYYY-MM-DD'
    timeSlot: { type: String, required: true } // '10:00 AM - 11:30 AM'
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, default: 'Hyderabad' },
    pincode: { type: String, default: '500034' },
    parkingSpaceAvailable: { type: Boolean, default: true },
    lat: { type: Number, default: 17.4156 },
    lng: { type: Number, default: 78.4350 }
  },
  pricing: {
    servicePrice: { type: Number, required: true },
    vanVisitCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: { type: String, enum: ['COD', 'RAZORPAY_ONLINE', 'UPI'], default: 'RAZORPAY_ONLINE' },
    status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['confirmed', 'van_assigned', 'van_on_way', 'van_arrived', 'service_completed', 'cancelled'],
    default: 'confirmed'
  },
  assignedVan: {
    vanNumber: { type: String, default: 'TS 09 PV 2026' },
    groomerName: { type: String, default: 'Mahesh Sharma (Certified Master Groomer)' },
    groomerPhone: { type: String, default: '+91 98765 43210' },
    vanModel: { type: String, default: 'Force Urbania AC Pet Spa Van' }
  },
  notes: { type: String, default: '' },
  timeline: [{
    status: { type: String },
    notes: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PetVanBooking', petVanBookingSchema);
