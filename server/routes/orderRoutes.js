const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { sendOrderConfirmationEmail } = require('../config/email');

const isMongoObjectId = (id) => id && /^[a-f\d]{24}$/i.test(id);
const escapeRegex = (str) => (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const deductStockForOrder = async (order) => {
  if (!order || !order.items || !Array.isArray(order.items)) return;

  for (const item of order.items) {
    if (item.type === 'service') continue;
    const qty = Math.max(1, Number(item.quantity) || 1);

    let productDoc = null;

    if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
      productDoc = await Product.findById(item.product);
    }

    if (!productDoc && item.title) {
      const cleanTitle = item.title.replace(/\s*\([^)]*\)$/, '').trim();
      const escapedClean = escapeRegex(cleanTitle);
      const query = {
        $or: [
          { title: item.title },
          { title: cleanTitle },
          { title: { $regex: new RegExp(`^${escapedClean}$`, 'i') } }
        ]
      };
      if (item.vendorId && mongoose.Types.ObjectId.isValid(item.vendorId)) {
        query.vendor = item.vendorId;
      }
      productDoc = await Product.findOne(query);

      if (!productDoc) {
        delete query.vendor;
        productDoc = await Product.findOne(query);
      }
    }

    if (productDoc && productDoc.type !== 'service') {
      const currentStock = typeof productDoc.stock === 'number' ? productDoc.stock : 10;
      productDoc.stock = Math.max(0, currentStock - qty);
      await productDoc.save();
    }
  }
};

const restoreStockForOrder = async (order) => {
  if (!order || !order.items || !Array.isArray(order.items)) return;

  for (const item of order.items) {
    if (item.type === 'service') continue;
    const qty = Math.max(1, Number(item.quantity) || 1);

    let productDoc = null;

    if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
      productDoc = await Product.findById(item.product);
    }

    if (!productDoc && item.title) {
      const cleanTitle = item.title.replace(/\s*\([^)]*\)$/, '').trim();
      const escapedClean = escapeRegex(cleanTitle);
      const query = {
        $or: [
          { title: item.title },
          { title: cleanTitle },
          { title: { $regex: new RegExp(`^${escapedClean}$`, 'i') } }
        ]
      };
      if (item.vendorId && mongoose.Types.ObjectId.isValid(item.vendorId)) {
        query.vendor = item.vendorId;
      }
      productDoc = await Product.findOne(query);

      if (!productDoc) {
        delete query.vendor;
        productDoc = await Product.findOne(query);
      }
    }

    if (productDoc && productDoc.type !== 'service') {
      const currentStock = typeof productDoc.stock === 'number' ? productDoc.stock : 0;
      productDoc.stock = currentStock + qty;
      await productDoc.save();
    }
  }
};

// @route   POST /api/orders
// @desc    Place a new pet essentials / service order
router.post('/', protect, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      shippingAddress,
      pricing,
      payment,
      appointment
    } = req.body;

    const orderPrefix = (items || []).some(item => item.type === 'service') ? 'BKG' : 'ORD';
    const orderId = `${orderPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const normalizedItems = (items || []).map(item => {
      const productId = isMongoObjectId(item.product || item.id || item._id) ? (item.product || item.id || item._id) : null;
      const vendorId = item.vendorId || item.vendor || '';
      return {
        product: productId,
        title: item.name || item.title || 'Pet Product',
        image: item.image || '/images/prod_drools.jpg',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        vendorId: vendorId ? vendorId.toString() : '',
        vendorName: item.storeName || item.vendorName || '',
        type: item.type || (item.category === 'Veterinary' || item.isService ? 'service' : 'product'),
        serviceMode: item.serviceMode || item.selectedSize || item.size || ''
      };
    });

    const firstVendorItem = normalizedItems.find(item => item.vendorId && isMongoObjectId(item.vendorId));
    const serviceItem = normalizedItems.find(item => item.type === 'service');
    const appointmentMode = appointment?.mode || (serviceItem
      ? (serviceItem.serviceMode === 'Clinic Visit' ? 'clinic_visit' : 'home_service')
      : 'product_delivery');

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : null,
      customerName: customerName || 'Pet Parent',
      customerEmail: customerEmail || 'customer@pawnear.com',
      customerPhone: customerPhone || '+91 98451 22334',
      items: normalizedItems,
      shippingAddress: shippingAddress || {
        street: 'Plot 42, Road 36, Jubilee Hills',
        city: 'Hyderabad',
        pincode: '500033'
      },
      pricing: pricing || { subtotal: 999, deliveryFee: 49, total: 1048 },
      payment: payment || { method: 'RAZORPAY_ONLINE', status: 'paid' },
      status: 'placed',
      vendor: firstVendorItem ? firstVendorItem.vendorId : undefined,
      appointment: {
        mode: appointmentMode,
        scheduledSlot: appointment?.scheduledSlot || '',
        petName: appointment?.petName || '',
        serviceCategory: appointment?.serviceCategory || '',
        serviceName: appointment?.serviceName || serviceItem?.title || '',
        notes: appointment?.notes || ''
      },
      deliveryOtp,
      statusTimeline: [
        { status: 'placed', notes: 'Order placed by pet parent.' },
        { status: 'confirmed', notes: 'Store accepted and packaging order.' }
      ]
    });

    // Send confirmation email asynchronously
    if (customerEmail) {
      sendOrderConfirmationEmail(customerEmail, order).catch(err => console.error(err));
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details & live tracking info
router.get('/:id', async (req, res) => {
  try {
    const idQuery = isMongoObjectId(req.params.id)
      ? { $or: [{ orderId: req.params.id }, { _id: req.params.id }] }
      : { orderId: req.params.id };
    const order = await Order.findOne(idQuery);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get customer orders
router.get('/', protect, async (req, res) => {
  try {
    let orders = [];
    try {
      orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    } catch (e) {
      // Fallback for mock users where req.user._id is not a valid ObjectId
      orders = await Order.find().limit(10).sort({ createdAt: -1 });
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update live order pipeline status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const idQuery = isMongoObjectId(req.params.id)
      ? { $or: [{ orderId: req.params.id }, { _id: req.params.id }] }
      : { orderId: req.params.id };
    const order = await Order.findOne(idQuery);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusTimeline.push({
      status,
      timestamp: new Date(),
      notes: notes || `Status updated to ${status}`
    });

    const isAcceptedOrAdvancing = ['confirmed', 'store_preparing', 'assigned_rider', 'picked_up', 'out_for_delivery', 'delivered'].includes(status);
    if (isAcceptedOrAdvancing && !order.stockDeducted) {
      await deductStockForOrder(order);
      order.stockDeducted = true;
    } else if (status === 'cancelled' && order.stockDeducted) {
      await restoreStockForOrder(order);
      order.stockDeducted = false;
    }

    await order.save();

    res.json({ success: true, message: 'Order status updated successfully!', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
