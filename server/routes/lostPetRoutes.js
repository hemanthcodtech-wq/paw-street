const express = require('express');
const router = express.Router();
const LostPet = require('../models/LostPet');

// Seed Lost & Found alerts for initial experience
const SEED_LOST_PETS = [
  {
    petName: 'Milo',
    petType: 'dog',
    breed: 'Beagle',
    color: 'Tri-color (White, Black & Tan)',
    gender: 'Male',
    photos: ['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'],
    lastSeenAddress: 'Near KBR Park Gate 2, Jubilee Hills',
    lastSeenCity: 'Hyderabad',
    lat: 17.4245,
    lng: 78.4210,
    lastSeenDate: 'Today, 8:30 AM',
    hasCollar: true,
    collarDetails: 'Blue nylon collar with Paw Near tag',
    isMicrochipped: true,
    rewardAmount: 3000,
    contactName: 'Rohit Varma',
    contactPhone: '+91 98450 12345',
    specialMarksOrNotes: 'Very friendly, responds to name Milo. Has a white patch on tail tip.',
    status: 'lost',
    sightings: [
      {
        reporterName: 'Suresh (Delivery Captain)',
        reporterPhone: '+91 98451 22334',
        locationNote: 'Spotted drinking water near Road 10 Cafe',
        spottedAt: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    petName: 'Ginger',
    petType: 'cat',
    breed: 'Persian Longhair',
    color: 'Orange / Ginger Cream',
    gender: 'Female',
    photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80'],
    lastSeenAddress: 'Banjara Hills Road No 12, Near GVK Mall',
    lastSeenCity: 'Hyderabad',
    lat: 17.4156,
    lng: 78.4350,
    lastSeenDate: 'Yesterday Evening, 6:00 PM',
    hasCollar: true,
    collarDetails: 'Pink collar with bell',
    isMicrochipped: false,
    rewardAmount: 5000,
    contactName: 'Ananya Reddy',
    contactPhone: '+91 99887 66554',
    specialMarksOrNotes: 'Indoor cat, very scared of loud horns. Might be hiding under parked cars.',
    status: 'lost',
    sightings: []
  }
];

// Helper: Haversine distance
const haversineKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

// @route   GET /api/lost-pets/nearby
// @desc    Get nearby lost pet alerts
router.get('/nearby', async (req, res) => {
  try {
    const userLat = Number(req.query.lat) || 17.4156;
    const userLng = Number(req.query.lng) || 78.4350;
    const maxRadius = Number(req.query.radius) || 25; // in km

    let pets = await LostPet.find({ status: { $ne: 'reunited' } }).sort({ createdAt: -1 });

    // Seed if empty
    if (!pets || pets.length === 0) {
      pets = await LostPet.insertMany(SEED_LOST_PETS);
    }

    const enriched = pets.map(p => {
      const dist = haversineKm(userLat, userLng, p.lat, p.lng);
      return {
        ...p.toObject(),
        distanceKm: dist,
        distanceText: `${dist} km away from your pin`
      };
    })
    .filter(p => p.distanceKm <= maxRadius)
    .sort((a, b) => a.distanceKm - b.distanceKm);

    res.json({
      success: true,
      count: enriched.length,
      alerts: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/lost-pets/report
// @desc    Upload / report a lost pet
router.post('/report', async (req, res) => {
  try {
    const {
      petName,
      petType,
      breed,
      color,
      gender,
      photos,
      lastSeenAddress,
      lastSeenCity,
      lat,
      lng,
      lastSeenDate,
      hasCollar,
      collarDetails,
      isMicrochipped,
      rewardAmount,
      contactName,
      contactPhone,
      secondaryPhone,
      specialMarksOrNotes
    } = req.body;

    if (!petName || !breed || !contactPhone || !lastSeenAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Pet Name, Breed, Contact Phone, and Last Seen Address.'
      });
    }

    const newAlert = await LostPet.create({
      reporter: req.user?._id || null,
      petName,
      petType: petType || 'dog',
      breed,
      color: color || 'Mixed',
      gender: gender || 'Male',
      photos: photos && photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'],
      lastSeenAddress,
      lastSeenCity: lastSeenCity || 'Hyderabad',
      lat: Number(lat) || 17.4156,
      lng: Number(lng) || 78.4350,
      lastSeenDate: lastSeenDate || 'Today',
      hasCollar: hasCollar !== false,
      collarDetails: collarDetails || '',
      isMicrochipped: !!isMicrochipped,
      rewardAmount: Number(rewardAmount) || 0,
      contactName: contactName || 'Pet Parent',
      contactPhone,
      secondaryPhone: secondaryPhone || '',
      specialMarksOrNotes: specialMarksOrNotes || '',
      status: 'lost'
    });

    res.status(201).json({
      success: true,
      message: '🚨 SOS Alert Broadcasted! Pet owners and delivery captains in this radius have been alerted.',
      alert: newAlert
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/lost-pets/:id/sight
// @desc    Report pet sighting by community member / delivery captain
router.post('/:id/sight', async (req, res) => {
  try {
    const { reporterName, reporterPhone, locationNote, photo } = req.body;
    const pet = await LostPet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet alert not found' });
    }

    pet.sightings.push({
      reporterName: reporterName || 'Community Member',
      reporterPhone: reporterPhone || '',
      locationNote: locationNote || 'Spotted nearby',
      photo: photo || '',
      spottedAt: new Date()
    });
    pet.status = 'spotted';

    await pet.save();

    res.json({
      success: true,
      message: 'Sighting reported! Thank you for helping reunite this pet.',
      pet
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PATCH /api/lost-pets/:id/reunite
// @desc    Mark pet as safely reunited
router.patch('/:id/reunite', async (req, res) => {
  try {
    const pet = await LostPet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet alert not found' });
    }

    pet.status = 'reunited';
    await pet.save();

    res.json({
      success: true,
      message: '🎉 Fantastic news! Pet marked as Reunited with family.',
      pet
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
