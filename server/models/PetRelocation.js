const mongoose = require('mongoose');

const petRelocationSchema = new mongoose.Schema({
  inquiryId: {
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
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  petDetails: {
    petType: { type: String, enum: ['dog', 'cat', 'bird', 'other'], default: 'dog' },
    breed: { type: String, required: true },
    ageYears: { type: Number, default: 2 },
    weightKg: { type: Number, required: true },
    isVaccinated: { type: Boolean, default: true },
    hasMicrochip: { type: Boolean, default: false }
  },
  relocationType: {
    type: String,
    enum: ['domestic', 'international'],
    required: true
  },
  origin: {
    city: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  destination: {
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  preferredDate: { type: String, required: true },
  transportMode: {
    type: String,
    enum: ['air_cargo', 'accompanied_baggage', 'pet_cab_intercity'],
    default: 'air_cargo'
  },
  servicesNeeded: [{
    type: String,
    enum: [
      'IATA_Approved_Crate',
      'Veterinary_Health_Certificate',
      'ISO_Microchipping',
      'Doorstep_Airport_Pickup_Drop',
      'Customs_Quarantine_Assistance',
      'In_Flight_Hydration_Comfort'
    ]
  }],
  estimatedBudget: { type: Number, default: 0 },
  quoteAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['inquiry_received', 'quote_provided', 'documents_verified', 'flight_booked', 'in_transit', 'delivered'],
    default: 'inquiry_received'
  },
  assignedTravelManager: {
    name: { type: String, default: 'Vikram Rao (Senior Pet Relocation Specialist)' },
    phone: { type: String, default: '+91 99887 76655' }
  },
  notes: { type: String, default: '' },
  timeline: [{
    stage: { type: String },
    note: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('PetRelocation', petRelocationSchema);
