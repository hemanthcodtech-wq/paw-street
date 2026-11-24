const express = require('express');
const router = express.Router();
const PetVanBooking = require('../models/PetVanBooking');
const { protect } = require('../middleware/authMiddleware');

// Preset Doorstep Mobile Van Packages
const VAN_PACKAGES = [
  {
    id: 'van-spa-full',
    title: '🚐 Luxury Doorstep Pet Spa & Grooming Van',
    tagline: 'Complete hydro-bath, aromatic blowout & styling inside custom AC van',
    duration: '75 mins',
    price: 1299,
    originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80',
    includes: [
      'Warm hydrotherapy bath & organic shampoo',
      'Blow dry & full coat de-shedding',
      'Nail clipping & paw pad sanitization',
      'Ear cleaning & aromatic mist perfume',
      'Zero salon stress - at your gate/driveway'
    ]
  },
  {
    id: 'van-vet-vaccine',
    title: '🚑 Doorstep Mobile Vet Health & Vaccination Van',
    tagline: 'Senior veterinary consultation, 9-in-1 vaccine & health passport',
    duration: '45 mins',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=600&q=80',
    includes: [
      'Comprehensive veterinary physical checkup',
      'Annual DHPPi / Anti-Rabies vaccination',
      'Deworming syrup / tablet dose',
      'Digital health card & diet advisory',
      'No waiting in crowded clinic lobbies'
    ]
  },
  {
    id: 'van-medicated-flea',
    title: '🚿 Anti-Tick & Flea Medicated Wash Van',
    tagline: 'Clinical deep-cleansing medicated dip & tick removal therapy',
    duration: '60 mins',
    price: 1099,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    includes: [
      'Doctor-approved herbal anti-tick bath',
      'Manual parasite extraction & skin inspection',
      'Soothing aloe-vera coat spray',
      'Flea prevention collar spray',
      'Safe ozone sterilization of van between pets'
    ]
  },
  {
    id: 'van-puppy-first-groom',
    title: '🐾 Puppy & Kitten First Gentle Groom Van',
    tagline: 'Soft, noise-free pampering designed for puppies & shy pets',
    duration: '45 mins',
    price: 799,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    includes: [
      'Gentle tearless baby shampoo wash',
      'Low-noise warm air dry & cuddling',
      'Paw balm & sanitary trim',
      'Fun treat rewards during grooming',
      'Free puppy bandanna gift'
    ]
  }
];

// Available daily time slots for scheduled doorstep visit
const VAN_SLOTS = [
  '09:00 AM - 10:30 AM',
  '11:00 AM - 12:30 PM',
  '01:30 PM - 03:00 PM',
  '03:30 PM - 05:00 PM',
  '05:30 PM - 07:00 PM'
];

// @route   GET /api/van-services/packages
// @desc    Get all available mobile van packages
router.get('/packages', (req, res) => {
  res.json({
    success: true,
    count: VAN_PACKAGES.length,
    packages: VAN_PACKAGES,
    slots: VAN_SLOTS
  });
});

// @route   GET /api/van-services/slots
// @desc    Get available slots for a selected date
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a date' });
    }

    // Find existing bookings for this date
    const booked = await PetVanBooking.find({
      'appointment.date': date,
      status: { $nin: ['cancelled'] }
    }).select('appointment.timeSlot');

    const bookedSlots = booked.map(b => b.appointment?.timeSlot);
    const availableSlots = VAN_SLOTS.map(slot => ({
      slot,
      available: !bookedSlots.includes(slot)
    }));

    res.json({
      success: true,
      date,
      slots: availableSlots
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/van-services/book
// @desc    Book a Pet Van appointment
router.post('/book', async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      servicePackageId,
      petDetails,
      appointmentDate,
      timeSlot,
      address,
      paymentMethod
    } = req.body;

    const pkg = VAN_PACKAGES.find(p => p.id === servicePackageId) || VAN_PACKAGES[0];

    const bookingId = `VAN-${Date.now().toString().slice(-6)}`;
    const newBooking = await PetVanBooking.create({
      bookingId,
      user: req.user?._id || null,
      customerName: customerName || 'Pet Parent',
      customerPhone: customerPhone || '+91 98450 11223',
      customerEmail: customerEmail || '',
      servicePackage: {
        id: pkg.id,
        title: pkg.title,
        duration: pkg.duration,
        price: pkg.price
      },
      petDetails: petDetails || { name: 'Bruno', type: 'dog', breed: 'Labrador', ageYears: 2, weightKg: 18 },
      appointment: {
        date: appointmentDate || new Date().toISOString().split('T')[0],
        timeSlot: timeSlot || VAN_SLOTS[0]
      },
      address: {
        street: address?.street || 'Road No 12, Banjara Hills',
        city: address?.city || 'Hyderabad',
        pincode: address?.pincode || '500034',
        parkingSpaceAvailable: address?.parkingSpaceAvailable !== false,
        lat: address?.lat || 17.4156,
        lng: address?.lng || 78.4350
      },
      pricing: {
        servicePrice: pkg.price,
        vanVisitCharge: 0,
        discount: 0,
        total: pkg.price
      },
      payment: {
        method: paymentMethod || 'RAZORPAY_ONLINE',
        status: paymentMethod === 'COD' ? 'pending' : 'paid'
      },
      status: 'confirmed',
      timeline: [
        {
          status: 'confirmed',
          notes: `Appointment confirmed for ${appointmentDate} (${timeSlot}). Cleaned AC Van assigned.`,
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Pet Van appointment scheduled successfully! No salon travel needed.',
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/van-services/my-bookings
// @desc    Get user bookings
router.get('/my-bookings', async (req, res) => {
  try {
    const phone = req.query.phone;
    let query = {};
    if (req.user) query.user = req.user._id;
    else if (phone) query.customerPhone = phone;

    const bookings = await PetVanBooking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/van-services/booking/:id/status
// @desc    Update van appointment status (van_on_way, van_arrived, service_completed)
router.patch('/booking/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const booking = await PetVanBooking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status || booking.status;
    booking.timeline.push({
      status: status || booking.status,
      notes: notes || `Van status updated to ${status}`,
      timestamp: new Date()
    });

    await booking.save();
    res.json({ success: true, message: `Van status updated to ${status}`, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
