const mongoose = require('mongoose');

const lostPetSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  petName: { type: String, required: true, trim: true },
  petType: { type: String, enum: ['dog', 'cat', 'bird', 'other'], default: 'dog' },
  breed: { type: String, required: true, trim: true },
  color: { type: String, default: 'Golden / Brown' },
  gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Male' },
  photos: [{ type: String }],
  lastSeenAddress: { type: String, required: true },
  lastSeenCity: { type: String, default: 'Hyderabad' },
  lat: { type: Number, default: 17.4156 },
  lng: { type: Number, default: 78.4350 },
  lastSeenDate: { type: String, required: true },
  hasCollar: { type: Boolean, default: true },
  collarDetails: { type: String, default: 'Red collar with bell' },
  isMicrochipped: { type: Boolean, default: false },
  rewardAmount: { type: Number, default: 2000 },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  secondaryPhone: { type: String, default: '' },
  specialMarksOrNotes: { type: String, default: '' },
  status: {
    type: String,
    enum: ['lost', 'spotted', 'reunited'],
    default: 'lost'
  },
  sightings: [{
    reporterName: { type: String, required: true },
    reporterPhone: { type: String, required: true },
    photo: { type: String, default: '' },
    locationNote: { type: String, required: true },
    spottedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('LostPet', lostPetSchema);
