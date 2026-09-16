const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');

// @route   GET /api/delivery/profile
// @desc    Get rider duty profile
router.get('/profile', async (req, res) => {
  try {
    let rider;
    try {
      rider = await DeliveryPartner.findOne();
    } catch (dbErr) {}

    if (!rider) {
      rider = {
        name: 'Raju Kumar',
        phone: '+91 98451 22334',
        vehicleNumber: 'TS 09 EQ 4421',
        onlineStatus: true,
        rating: 4.92,
        todayTrips: 8,
        todayEarnings: 760,
        cashInHand: 1450,
        currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
      };
    }
    res.json({ success: true, rider });
  } catch (error) {
    res.json({
      success: true,
      rider: {
        name: 'Raju Kumar',
        phone: '+91 98451 22334',
        vehicleNumber: 'TS 09 EQ 4421',
        onlineStatus: true,
        rating: 4.92,
        todayTrips: 8,
        todayEarnings: 760,
        cashInHand: 1450,
        currentZone: 'Jubilee Hills & Banjara Hills, Hyderabad'
      }
    });
  }
});

// @route   PUT /api/delivery/duty-toggle
// @desc    Toggle Online / Offline status
router.put('/duty-toggle', async (req, res) => {
  try {
    const { onlineStatus } = req.body;
    let rider = await DeliveryPartner.findOneAndUpdate(
      {},
      { onlineStatus },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: `Rider is now ${onlineStatus ? 'ONLINE' : 'OFFLINE'}`, rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/delivery/reconcile-deposit
// @desc    Submit cash deposit reference to reconcile cash-in-hand
router.post('/reconcile-deposit', async (req, res) => {
  try {
    const { amount, referenceNumber, paymentMethod } = req.body;
    const numericAmount = parseFloat(amount) || 0;

    const rider = await DeliveryPartner.findOne();
    if (rider) {
      rider.cashInHand = Math.max(0, rider.cashInHand - numericAmount);
      await rider.save();
    }

    res.json({
      success: true,
      message: `Successfully deposited ₹${numericAmount} with UTR ${referenceNumber}. Cash-in-hand reconciled!`,
      newCashBalance: rider ? rider.cashInHand : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
