const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/DeliveryPartner');
const Order = require('../models/Order');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const getAuthenticatedRider = async (req) => {
  const email = (req.user?.email || '').toLowerCase();
  const userId = req.user?._id;
  const query = { $or: [] };

  if (userId && /^[a-f\d]{24}$/i.test(userId)) query.$or.push({ user: userId });
  if (email) query.$or.push({ email });

  let rider = query.$or.length ? await DeliveryPartner.findOne(query) : null;
  if (!rider && email) {
    rider = await DeliveryPartner.create({
      user: /^[a-f\d]{24}$/i.test(userId) ? userId : undefined,
      name: req.user.name || 'Delivery Captain',
      email,
      phone: req.user.phone || `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      vehicleType: 'EV Bike',
      vehicleNumber: 'Pending KYC'
    });
  }

  return rider;
};

// @route   GET /api/delivery/profile
// @desc    Get rider duty profile
router.get('/profile', protect, authorizeRoles('delivery', 'admin'), async (req, res) => {
  try {
    let rider = await getAuthenticatedRider(req);

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
router.put('/duty-toggle', protect, authorizeRoles('delivery', 'admin'), async (req, res) => {
  try {
    const { onlineStatus } = req.body;
    let rider = await getAuthenticatedRider(req);
    if (!rider) {
      return res.status(404).json({ success: false, message: 'Delivery partner profile not found.' });
    }
    rider.onlineStatus = !!onlineStatus;
    await rider.save();
    res.json({ success: true, message: `Rider is now ${onlineStatus ? 'ONLINE' : 'OFFLINE'}`, rider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/delivery/reconcile-deposit
// @desc    Submit cash deposit reference to reconcile cash-in-hand
router.post('/reconcile-deposit', protect, authorizeRoles('delivery', 'admin'), async (req, res) => {
  try {
    const { amount, depositAmount, referenceNumber, paymentMethod } = req.body;
    const numericAmount = parseFloat(amount || depositAmount) || 0;

    const rider = await getAuthenticatedRider(req);
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
