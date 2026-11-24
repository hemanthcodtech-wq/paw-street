const express = require('express');
const router = express.Router();
const PetRelocation = require('../models/PetRelocation');

// Estimate calculation helper based on route, pet weight & transport mode
const calculateRelocationEstimate = (relocationType, origin, destination, weightKg, mode) => {
  let basePrice = 12000;
  const isInter = relocationType === 'international' || (destination && destination.toLowerCase().includes('usa')) || (destination && destination.toLowerCase().includes('uk')) || (destination && destination.toLowerCase().includes('dubai')) || (destination && destination.toLowerCase().includes('canada'));

  if (isInter) {
    basePrice = 65000;
    if (weightKg > 20) basePrice += 25000;
    else if (weightKg > 10) basePrice += 15000;
    basePrice += 12000; // IATA crate + microchipping & blood titer
  } else {
    // Domestic
    if (mode === 'pet_cab_intercity') {
      basePrice = 16000;
    } else {
      basePrice = 18000;
    }
    if (weightKg > 20) basePrice += 6000;
    else if (weightKg > 10) basePrice += 3500;
  }

  return basePrice;
};

// @route   POST /api/relocation/estimate
// @desc    Get an instant transparent estimate for domestic or global pet relocation
router.post('/estimate', (req, res) => {
  try {
    const { relocationType, originCity, destinationCity, petWeightKg, transportMode } = req.body;
    const est = calculateRelocationEstimate(
      relocationType || 'domestic',
      originCity || 'Hyderabad',
      destinationCity || 'Bangalore',
      Number(petWeightKg) || 12,
      transportMode || 'air_cargo'
    );

    res.json({
      success: true,
      relocationType: relocationType || 'domestic',
      estimatedStartingPrice: est,
      priceBreakdown: {
        flightOrCabFreight: Math.round(est * 0.6),
        iataCertifiedCrate: Math.round(est * 0.18),
        veterinaryClearanceAndMicrochip: Math.round(est * 0.12),
        doorstepEscortAndHandling: Math.round(est * 0.1)
      },
      currency: 'INR',
      guarantee: '100% Climate-Controlled Safe Pet Travel Guarantee'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/relocation/inquiry
// @desc    Submit a formal pet relocation booking / inquiry
router.post('/inquiry', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      petDetails,
      relocationType,
      origin,
      destination,
      preferredDate,
      transportMode,
      servicesNeeded,
      notes
    } = req.body;

    if (!customerName || !customerPhone || !origin?.city || !destination?.city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Customer Name, Phone, Origin City, and Destination City.'
      });
    }

    const est = calculateRelocationEstimate(
      relocationType,
      origin.city,
      destination.city,
      petDetails?.weightKg || 12,
      transportMode
    );

    const inquiryId = `RELOC-${Date.now().toString().slice(-6)}`;
    const inquiry = await PetRelocation.create({
      inquiryId,
      user: req.user?._id || null,
      customerName,
      customerEmail: customerEmail || 'petparent@pawstreet.com',
      customerPhone,
      petDetails: {
        petType: petDetails?.petType || 'dog',
        breed: petDetails?.breed || 'Golden Retriever',
        ageYears: petDetails?.ageYears || 3,
        weightKg: Number(petDetails?.weightKg) || 15,
        isVaccinated: petDetails?.isVaccinated !== false,
        hasMicrochip: !!petDetails?.hasMicrochip
      },
      relocationType: relocationType || 'domestic',
      origin: {
        city: origin.city,
        country: origin.country || 'India'
      },
      destination: {
        city: destination.city,
        country: destination.country || (relocationType === 'domestic' ? 'India' : 'International')
      },
      preferredDate: preferredDate || 'Flexible in 2 weeks',
      transportMode: transportMode || 'air_cargo',
      servicesNeeded: servicesNeeded || [
        'IATA_Approved_Crate',
        'Veterinary_Health_Certificate',
        'Doorstep_Airport_Pickup_Drop'
      ],
      estimatedBudget: est,
      quoteAmount: est,
      status: 'inquiry_received',
      timeline: [
        {
          stage: 'inquiry_received',
          note: `Relocation request logged for ${origin.city} -> ${destination.city}. Assigned to Senior Pet Travel Manager.`,
          timestamp: new Date()
        }
      ],
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: '✈️ Pet Relocation Request Confirmed! A dedicated Pet Travel Officer will call you with flight slots.',
      inquiry
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/relocation/my-inquiries
// @desc    Get relocation requests
router.get('/my-inquiries', async (req, res) => {
  try {
    const phone = req.query.phone;
    let query = {};
    if (req.user) query.user = req.user._id;
    else if (phone) query.customerPhone = phone;

    const inquiries = await PetRelocation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
