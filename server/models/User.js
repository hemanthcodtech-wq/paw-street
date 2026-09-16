const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const petProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Other'], default: 'Dog' },
  breed: { type: String, default: '' },
  ageYears: { type: Number, default: 2 },
  weightKg: { type: Number, default: 10 },
  gender: { type: String, enum: ['Male', 'Female'], default: 'Male' },
  avatar: { type: String, default: '' },
  specialNotes: { type: String, default: '' }
}, { _id: true });

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // 'Home', 'Work', 'Other'
  street: { type: String, required: true },
  apartment: { type: String, default: '' },
  city: { type: String, default: 'Hyderabad' },
  state: { type: String, default: 'Telangana' },
  pincode: { type: String, required: true },
  landmark: { type: String, default: '' },
  lat: { type: Number, default: 17.4156 },
  lng: { type: Number, default: 78.4350 },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin', 'delivery'],
    default: 'customer'
  },
  // Google OAuth profile link
  googleId: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: ''
  },
  // Saved pet profiles
  pets: [petProfileSchema],
  // Saved delivery locations
  addresses: [addressSchema],
  // Active OTP verification
  otp: {
    code: { type: String, default: null },
    expiresAt: { type: Date, default: null }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  tempPassword: {
    type: String,
    default: null,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
