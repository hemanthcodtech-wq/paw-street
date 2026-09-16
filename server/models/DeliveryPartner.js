const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: '/images/promo_puppy.jpg'
  },
  vehicleType: {
    type: String,
    default: 'EV Bike (Ather 450X)'
  },
  vehicleNumber: {
    type: String,
    default: 'TS 09 EQ 4421'
  },
  rating: {
    type: Number,
    default: 4.9
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  todayTrips: {
    type: Number,
    default: 0
  },
  todayEarnings: {
    type: Number,
    default: 0
  },
  onlineStatus: {
    type: Boolean,
    default: true
  },
  cashInHand: {
    type: Number,
    default: 0
  },
  currentZone: {
    type: String,
    default: 'Jubilee Hills & Banjara Hills, Hyderabad'
  },
  currentLocation: {
    lat: { type: Number, default: 17.4245 },
    lng: { type: Number, default: 78.4210 }
  },
  bankAccount: {
    accountNumber: { type: String, default: '••• 8912' },
    ifsc: { type: String, default: 'HDFC0001822' },
    bankName: { type: String, default: 'HDFC Bank' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
