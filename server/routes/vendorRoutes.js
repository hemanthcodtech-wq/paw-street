const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const escapeRegex = (str) => (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isMongoObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);

/**
 * Deducts stock for each physical product in an order.
 */
const deductStockForOrder = async (order, vendorId) => {
  if (!order || !order.items || !Array.isArray(order.items)) return;

  for (const item of order.items) {
    if (item.type === 'service') continue;
    const qty = Math.max(1, Number(item.quantity) || 1);

    let productDoc = null;

    // 1. Match by item.product ObjectId if present and valid
    if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
      productDoc = await Product.findById(item.product);
    }

    // 2. Fallback: match by title / cleanTitle and vendor
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
      if (vendorId) {
        query.vendor = vendorId;
      }
      productDoc = await Product.findOne(query);

      // If not found with vendor filter, try without vendor filter
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

/**
 * Restores stock for each physical product in an order on cancellation.
 */
const restoreStockForOrder = async (order, vendorId) => {
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
      if (vendorId) {
        query.vendor = vendorId;
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

/**
 * Securely resolve the authenticated Vendor for the current user.
 * Guarantees strict multi-tenant vendor isolation.
 */
const getAuthenticatedVendor = async (req) => {
  if (!req.user) return null;
  const userEmail = (req.user.email || '').trim().toLowerCase();

  let vendor = null;
  const userOr = [];
  if (req.user._id && isMongoObjectId(req.user._id)) {
    userOr.push({ user: req.user._id });
  }
  if (userEmail) {
    userOr.push({ email: userEmail });
  }

  if (userOr.length > 0) {
    try {
      vendor = await Vendor.findOne({ $or: userOr });
    } catch (e) {}
  }

  if (!vendor && req.user.role === 'admin') {
    vendor = await Vendor.findOne({ status: 'approved' }) || await Vendor.findOne();
  }

  if (vendor && !vendor.user && req.user._id && /^[a-f\d]{24}$/i.test(req.user._id)) {
    vendor.user = req.user._id;
    await vendor.save().catch(() => {});
  }

  return vendor;
};

// =========================================================
// 1. PUBLIC VENDOR ROUTES
// =========================================================

// @route   POST /api/vendors/onboarding
// @desc    Submit new vendor application
router.post('/onboarding', async (req, res) => {
  try {
    const {
      storeName,
      fullName,
      email,
      phone,
      category,
      businessTypes,
      location,
      photos,
      storeLicenceNumber,
      panNumber,
      aadhaarNumber,
      kycDocs,
      serviceDeliveryModes,
      bankDetails
    } = req.body;

    const missingFields = [];
    if (!fullName) missingFields.push('fullName');
    if (!email) missingFields.push('email');
    if (!phone) missingFields.push('phone');
    if (!storeName) missingFields.push('storeName');
    if (!Array.isArray(businessTypes) || businessTypes.length === 0) missingFields.push('businessTypes');
    if (!storeLicenceNumber) missingFields.push('storeLicenceNumber');
    if (!panNumber) missingFields.push('panNumber');
    if (!aadhaarNumber) missingFields.push('aadhaarNumber');
    if (!kycDocs?.tradeLicenceUrl) missingFields.push('kycDocs.tradeLicenceUrl');
    if (!kycDocs?.panCardUrl) missingFields.push('kycDocs.panCardUrl');
    if (!kycDocs?.aadhaarUrl) missingFields.push('kycDocs.aadhaarUrl');
    if (!bankDetails?.accountHolderName) missingFields.push('bankDetails.accountHolderName');
    if (!bankDetails?.bankName) missingFields.push('bankDetails.bankName');
    if (!bankDetails?.accountNumber) missingFields.push('bankDetails.accountNumber');
    if (!bankDetails?.ifscCode) missingFields.push('bankDetails.ifscCode');
    if (!location?.address) missingFields.push('location.address');
    if (!location?.city) missingFields.push('location.city');
    if (!location?.pincode) missingFields.push('location.pincode');
    if (!photos?.storeFront) missingFields.push('photos.storeFront');
    if (!photos?.interior) missingFields.push('photos.interior');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please complete all required onboarding fields: ${missingFields.join(', ')}.`
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingVendor = await Vendor.findOne({ email: normalizedEmail });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'A vendor application already exists for this email address.'
      });
    }

    let user = await User.findOne({ email: normalizedEmail }).select('+password +tempPassword');
    const initialPassword = req.body.password || 'Paw123!2026';

    if (!user) {
      user = await User.create({
        name: fullName,
        email: normalizedEmail,
        password: initialPassword,
        tempPassword: initialPassword,
        phone,
        role: 'vendor'
      });
    } else {
      user.name = user.name || fullName;
      user.phone = user.phone || phone;
      user.role = 'vendor';
      if (!user.password) {
        user.password = initialPassword;
        user.tempPassword = initialPassword;
      }
      await user.save();
    }

    const vendor = await Vendor.create({
      user: user._id,
      storeName,
      fullName,
      email: normalizedEmail,
      phone,
      category: category || 'Pet Store & Services',
      businessTypes,
      location,
      photos,
      storeLicenceNumber,
      panNumber,
      aadhaarNumber,
      kycDocs,
      serviceDeliveryModes: serviceDeliveryModes || {},
      bankDetails,
      status: 'pending',
      isStoreOpen: false,
      deliveryTeam: []
    });

    res.status(201).json({
      success: true,
      message: 'Vendor onboarding submitted successfully! Admin will review your KYC. You can log in with your email and onboarding password.',
      vendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/vendors
// @desc    Get all active/approved stores for directory
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'approved' }).select('-bankDetails -kycDocs');
    res.json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/vendors/:id
// @desc    Get a single approved vendor/store profile for storefront pages
router.get('/:id([a-fA-F\\d]{24})', async (req, res) => {
  try {
    if (!isMongoObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid vendor id.' });
    }

    const vendor = await Vendor.findOne({ _id: req.params.id, status: 'approved' }).select('-bankDetails -kycDocs');
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found.' });
    }

    res.json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================
// 2. AUTHENTICATED VENDOR PROFILE & DASHBOARD
// =========================================================

// @route   GET /api/vendors/profile
// @desc    Get current vendor's own store profile
router.get('/profile', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found.' });
    }
    res.json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/profile
// @desc    Update current vendor's own store profile
router.put('/profile', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store profile not found.' });
    }

    // Disallow altering security/status fields directly
    const { status, commissionRate, user, _id, email, ...allowedUpdates } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendor._id,
      { $set: allowedUpdates },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Store profile updated successfully!',
      vendor: updatedVendor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/toggle-open
// @desc    Toggle open/closed status for current vendor
router.put('/toggle-open', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    vendor.isStoreOpen = !vendor.isStoreOpen;
    await vendor.save();

    res.json({
      success: true,
      message: `Store is now ${vendor.isStoreOpen ? 'Open & accepting orders' : 'Closed'}`,
      isStoreOpen: vendor.isStoreOpen
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/vendors/dashboard-stats
// @desc    Get real-time KPI metrics isolated to current vendor
router.get('/dashboard-stats', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const [products, orders] = await Promise.all([
      Product.find({ vendor: vendor._id }),
      Order.find({
        $or: [
          { 'items.vendorId': vendor._id.toString() },
          { vendor: vendor._id }
        ]
      })
    ]);

    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const today = new Date().toDateString();
    const todayRevenue = orders
      .filter(o => o.payment?.status === 'paid' && o.status !== 'cancelled' && new Date(o.createdAt).toDateString() === today)
      .reduce((sum, o) => sum + Number(o.settlement?.vendorNetAmount || 0), 0);

    res.json({
      success: true,
      stats: {
        todayRevenue,
        activeOrdersCount: activeOrders.length,
        totalOrdersCount: orders.length,
        totalProductsCount: products.filter(p => p.type === 'product').length,
        activeProductsCount: products.filter(p => p.type === 'product' && p.status === 'approved').length,
        totalServicesCount: products.filter(p => p.type === 'service').length,
        deliveryTeamCount: vendor.deliveryTeam?.length || 0,
        activeDeliveryBoysCount: vendor.deliveryTeam?.filter(b => b.status === 'available').length || 0,
        isStoreOpen: vendor.isStoreOpen
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================
// 3. VENDOR PRODUCTS & SERVICES (STRICTLY ISOLATED)
// =========================================================

// @route   GET /api/vendors/products
// @desc    Get all products and services belonging ONLY to this vendor
router.get('/products', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });

    // Format products for frontend compatibility
    const formatted = products.map(p => ({
      _id: p._id,
      id: p._id.toString(),
      name: p.title,
      title: p.title,
      shortName: p.title.slice(0, 28),
      category: p.category,
      subcategory: p.subCategory,
      petType: p.petType,
      breed: p.breed || '',
      ageYears: p.ageYears,
      type: p.type || 'product',
      price: p.price,
      mrp: p.mrp || p.price,
      stockCount: typeof p.stock === 'number' ? p.stock : (p.type === 'service' ? 999 : 0),
      inStock: (p.stock || 0) > 0,
      isActive: p.status === 'approved',
      status: p.status,
      image: p.primaryImage || (p.images && p.images[0]) || '/images/prod_pedigree.jpg',
      primaryImage: p.primaryImage,
      description: p.description,
      durationMinutes: p.durationMinutes,
      serviceModes: p.serviceModes || [],
      visitingFee: p.visitingFee || 0,
      deliveryMode: p.serviceModes?.length === 2
        ? 'both'
        : p.serviceModes?.includes('At-Home Service') ? 'home_service' : 'clinic_visit',
      vendor: vendor._id,
      vendorName: vendor.storeName
    }));

    res.json({
      success: true,
      count: formatted.length,
      products: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/vendors/products
// @desc    Create a product or service attached strictly to this vendor
router.post('/products', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const {
      name,
      title,
      description,
      category,
      subcategory,
      petType,
      breed,
      ageYears,
      type,
      price,
      mrp,
      stockCount,
      image,
      primaryImage,
      durationMinutes,
      deliveryMode,
      serviceModes,
      visitingFee
    } = req.body;

    const finalTitle = title || name || 'New Pet Item';
    const isService = type === 'service';
    const normalizedServiceModes = isService
      ? (Array.isArray(serviceModes)
        ? serviceModes
        : deliveryMode === 'both'
          ? ['At-Home Service', 'Clinic / Spa Visit']
          : deliveryMode === 'home_service' ? ['At-Home Service'] : ['Clinic / Spa Visit'])
      : [];

    const newProduct = await Product.create({
      title: finalTitle,
      description: description || '',
      category: category || (isService ? 'Grooming' : 'food'),
      subCategory: subcategory || 'General',
      petType: petType || 'Dog',
      breed: breed || '',
      ageYears: ageYears === '' || ageYears === undefined ? null : Number(ageYears),
      type: isService ? 'service' : 'product',
      price: Number(price) || 0,
      mrp: Number(mrp) || Number(price) || 0,
      stock: Number(stockCount) || (isService ? 999 : 10),
      primaryImage: primaryImage || image || (isService ? '/images/store_grooming.jpg' : '/images/prod_pedigree.jpg'),
      images: [primaryImage || image || '/images/prod_pedigree.jpg'],
      serviceModes: normalizedServiceModes,
      visitingFee: normalizedServiceModes.includes('At-Home Service') ? Number(visitingFee) || 0 : 0,
      durationMinutes: Number(durationMinutes) || 45,
      vendor: vendor._id,
      vendorName: vendor.storeName,
      status: 'approved'
    });

    res.status(201).json({
      success: true,
      message: `${isService ? 'Service' : 'Product'} added successfully!`,
      product: {
        ...newProduct.toObject(),
        id: newProduct._id.toString(),
        name: newProduct.title,
        stockCount: newProduct.stock,
        inStock: newProduct.stock > 0,
        isActive: true,
        image: newProduct.primaryImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/products/:id
// @desc    Update product strictly checking ownership
router.put('/products/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!product) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Product does not exist or does not belong to your store.'
      });
    }

    const updates = { ...req.body };
    delete updates.vendor;
    delete updates.vendorName;
    delete updates._id;
    if (updates.name && !updates.title) updates.title = updates.name;
    if (updates.stockCount !== undefined) updates.stock = updates.stockCount;
    if (updates.image && !updates.primaryImage) updates.primaryImage = updates.image;
    if (product.type === 'service' && updates.deliveryMode) {
      updates.serviceModes = updates.deliveryMode === 'both'
        ? ['At-Home Service', 'Clinic / Spa Visit']
        : updates.deliveryMode === 'home_service'
          ? ['At-Home Service']
          : ['Clinic / Spa Visit'];
      if (updates.deliveryMode === 'clinic_visit') updates.visitingFee = 0;
      delete updates.deliveryMode;
    }
    if (updates.isActive !== undefined) {
      updates.status = updates.isActive ? 'approved' : 'pending_approval';
    }

    const updated = await Product.findByIdAndUpdate(product._id, { $set: updates }, { new: true });

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product: {
        ...updated.toObject(),
        id: updated._id.toString(),
        name: updated.title,
        stockCount: updated.stock,
        inStock: updated.stock > 0,
        isActive: updated.status === 'approved',
        image: updated.primaryImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/vendors/products/:id
// @desc    Delete product strictly checking ownership
router.delete('/products/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const deleted = await Product.findOneAndDelete({ _id: req.params.id, vendor: vendor._id });
    if (!deleted) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Product does not exist or does not belong to your store.'
      });
    }

    res.json({ success: true, message: 'Product deleted from store catalog.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================
// 4. VENDOR ORDERS (STRICTLY ISOLATED)
// =========================================================

// @route   GET /api/vendors/orders
// @desc    Get orders belonging ONLY to this vendor
router.get('/orders', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    let vendor = null;
    let query = {};

    if (req.user.role === 'vendor') {
      vendor = await getAuthenticatedVendor(req);
      if (!vendor) {
        return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
      }

      // Get all product IDs belonging to this vendor so we can match orders by product ref too
      const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct('_id');
      const vendorIdStr = vendor._id.toString();

      query = {
        $or: [
          { 'items.vendorId': vendorIdStr },
          { vendor: vendor._id },
          // Match orders that contain any product owned by this vendor
          { 'items.product': { $in: vendorProductIds } }
        ]
      };
    }

    const rawOrders = await Order.find(query).sort({ createdAt: -1 });

    // Build a Set of this vendor's product IDs for O(1) lookup during item filtering
    const vendorProductIdSet = vendor
      ? new Set((await Product.find({ vendor: vendor._id }).distinct('_id')).map(id => id.toString()))
      : null;
    const vendorIdStr = vendor ? vendor._id.toString() : null;

    // Map into rich client structure
    const orders = rawOrders.map(o => {
      // Find items belonging to this vendor:
      // 1. vendorId string matches this vendor's _id
      // 2. OR item.product ObjectId is one of this vendor's products
      // 3. OR all items if admin view (no vendor filter)
      const vendorItems = vendor
        ? o.items.filter(i => {
            const byVendorId = i.vendorId && i.vendorId === vendorIdStr;
            const byProductRef = i.product && vendorProductIdSet?.has(i.product.toString());
            return byVendorId || byProductRef;
          })
        : o.items;

      // Fallback: if no items matched (order was pulled in by a different $or clause),
      // show all items so vendor can see what was ordered
      const displayItems = vendorItems.length > 0 ? vendorItems : o.items;

      const isService = displayItems.some(i => i.type === 'service');
      const serviceItem = displayItems.find(i => i.type === 'service');
      const appointmentMode = o.appointment?.mode || (serviceItem?.serviceMode === 'Clinic Visit' ? 'clinic_visit' : 'home_service');

      // Status mapping
      const mappedStatus =
        o.status === 'placed' ? 'new' :
        o.status === 'confirmed' || o.status === 'store_preparing' ? 'preparing' :
        o.status === 'assigned_rider' || o.status === 'picked_up' ? 'ready' :
        o.status === 'out_for_delivery' ? 'out_for_delivery' :
        o.status === 'delivered' ? 'delivered' : 'cancelled';

      return {
        _id: o._id,
        id: o.orderId || o._id.toString(),
        orderType: isService ? appointmentMode : 'product_delivery',
        serviceCategory: isService ? (o.appointment?.serviceCategory || 'Veterinary & Grooming') : 'Retail Pet Care',
        serviceName: isService ? (o.appointment?.serviceName || serviceItem?.title || 'Pet Service') : null,
        petName: o.appointment?.petName || (isService ? 'Pet Parent Request' : ''),
        customerName: o.customerName || 'Pet Parent',
        customerPhone: o.customerPhone || '+91 98451 22334',
        customerAddress: o.shippingAddress?.street ? `${o.shippingAddress.street}, ${o.shippingAddress.city}` : 'Hyderabad Delivery Area',
        scheduledSlot: isService ? (o.appointment?.scheduledSlot || 'Today, Immediate Slot') : 'Instant 15-Min Delivery',
        items: displayItems.map(i => ({
          id: i.product?.toString() || 'item-1',
          product: i.product?.toString() || null,
          type: i.type || 'product',
          name: i.title,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: o.pricing?.total || 0,
        paymentMethod: o.payment?.method || 'UPI Prepaid',
        paymentStatus: o.payment?.status === 'paid' ? 'Paid' : 'Pending Payment',
        orderStatus: mappedStatus,
        stockDeducted: !!o.stockDeducted,
        assignedDeliveryBoyId: o.assignedDeliveryBoyId || null,
        placedAt: o.createdAt || new Date().toISOString(),
        notes: o.appointment?.notes || ''
      };
    });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/orders/:id/status
// @desc    Update status of an order belonging to this vendor
router.put('/orders/:id/status', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const { status } = req.body;
    const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct('_id');
    const vendorIdStr = vendor._id.toString();

    const idQuery = isMongoObjectId(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    const order = await Order.findOne({
      $and: [
        idQuery,
        {
          $or: [
            { 'items.vendorId': vendorIdStr },
            { vendor: vendor._id },
            { 'items.product': { $in: vendorProductIds } }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'Order not found or does not belong to your store.'
      });
    }

    // Map vendor UI status to backend DB status
    const statusMap = {
      new: 'placed',
      preparing: 'store_preparing',
      ready: 'assigned_rider',
      out_for_delivery: 'out_for_delivery',
      delivered: 'delivered',
      cancelled: 'cancelled'
    };

    const targetStatus = statusMap[status] || status;
    order.status = targetStatus;
    order.statusTimeline.push({
      status: order.status,
      timestamp: new Date(),
      notes: `Order status updated by vendor ${vendor.storeName} to ${status}`
    });

    if (status === 'delivered') {
      if (order.payment) order.payment.status = 'paid';
    }

    // Deduct stock when order is accepted / preparing (or advanced) if not already deducted
    const isAcceptedOrAdvancing = ['store_preparing', 'assigned_rider', 'picked_up', 'out_for_delivery', 'delivered'].includes(targetStatus);
    if (isAcceptedOrAdvancing && !order.stockDeducted) {
      await deductStockForOrder(order, vendor._id);
      order.stockDeducted = true;
    } else if (targetStatus === 'cancelled' && order.stockDeducted) {
      // If order is cancelled after being accepted, restore stock
      await restoreStockForOrder(order, vendor._id);
      order.stockDeducted = false;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/orders/:id/assign
// @desc    Assign delivery partner from this vendor's team
router.put('/orders/:id/assign', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const { deliveryBoyId } = req.body;
    const vendorProductIds = await Product.find({ vendor: vendor._id }).distinct('_id');
    const vendorIdStr = vendor._id.toString();

    const idQuery = isMongoObjectId(req.params.id)
      ? { $or: [{ _id: req.params.id }, { orderId: req.params.id }] }
      : { orderId: req.params.id };

    const order = await Order.findOne({
      $and: [
        idQuery,
        {
          $or: [
            { 'items.vendorId': vendorIdStr },
            { vendor: vendor._id },
            { 'items.product': { $in: vendorProductIds } }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: 'Order not found or does not belong to your store.'
      });
    }

    // Look up the rider in vendor's deliveryTeam subdoc
    const riderSubdoc = vendor.deliveryTeam && deliveryBoyId ? vendor.deliveryTeam.id(deliveryBoyId) : null;

    order.assignedDeliveryBoyId = deliveryBoyId;

    // Save rider name + phone for customer-facing tracking
    if (riderSubdoc) {
      order.riderName = riderSubdoc.name;
      order.riderPhone = riderSubdoc.phone;

      // If rider has a linked DeliveryPartner doc, set assignedRider ObjectId
      if (riderSubdoc.userId) {
        const DeliveryPartner = require('../models/DeliveryPartner');
        const partnerDoc = await DeliveryPartner.findOne({ user: riderSubdoc.userId });
        if (partnerDoc) {
          order.assignedRider = partnerDoc._id;
        }
      }
    }

    order.status = 'out_for_delivery';
    order.statusTimeline.push({
      status: 'out_for_delivery',
      timestamp: new Date(),
      notes: `Assigned to ${riderSubdoc ? riderSubdoc.name : 'delivery team partner'} (ID: ${deliveryBoyId})`
    });

    await order.save();

    // Mark rider busy in vendor delivery team
    if (riderSubdoc) {
      riderSubdoc.status = 'busy';
      await vendor.save();
    }

    res.json({
      success: true,
      message: `Order assigned to ${riderSubdoc ? riderSubdoc.name : 'delivery partner'} successfully!`,
      order,
      assignedRiderName: riderSubdoc ? riderSubdoc.name : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================================================
// 5. VENDOR DELIVERY TEAM (STRICTLY ISOLATED PER STORE)
// =========================================================

// @route   GET /api/vendors/delivery-team
// @desc    Get delivery team fleet belonging ONLY to this store
router.get('/delivery-team', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const team = (vendor.deliveryTeam || []).map(b => ({
      id: b._id.toString(),
      _id: b._id,
      name: b.name,
      phone: b.phone,
      email: b.email || '',
      userId: b.userId ? b.userId.toString() : null,
      canLogin: !!(b.email),
      role: b.role,
      roleTitle: b.roleTitle,
      vehicleType: b.vehicleType,
      vehicleNumber: b.vehicleNumber,
      drivingLicence: b.drivingLicence,
      status: b.status,
      rating: b.rating,
      totalDeliveries: b.totalDeliveries,
      joinedDate: b.joinedDate,
      avatar: b.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(b.name)}`
    }));

    res.json({
      success: true,
      count: team.length,
      deliveryBoys: team
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/vendors/delivery-team
// @desc    Add a rider to THIS vendor's fleet (optionally creates login credentials)
router.post('/delivery-team', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const {
      name,
      phone,
      email,
      password,
      role,
      roleTitle,
      vehicleType,
      vehicleNumber,
      drivingLicence,
      avatar,
      bankDetails
    } = req.body;

    let linkedUserId = null;
    let deliveryPartnerId = null;

    // If email + password are provided, create a User account so the rider can log in
    if (email && password) {
      const normalizedEmail = email.trim().toLowerCase();

      // Create or reuse User account with role 'delivery'
      let riderUser = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!riderUser) {
        riderUser = await User.create({
          name,
          email: normalizedEmail,
          password,
          phone: phone || '',
          role: 'delivery'
        });
      } else {
        // Update role to delivery if needed
        if (riderUser.role !== 'delivery') {
          riderUser.role = 'delivery';
          await riderUser.save();
        }
      }
      linkedUserId = riderUser._id;

      // Create or link a DeliveryPartner doc scoped to this vendor
      const DeliveryPartner = require('../models/DeliveryPartner');
      let partnerDoc = await DeliveryPartner.findOne({ $or: [{ user: riderUser._id }, { email: normalizedEmail }] });
      if (!partnerDoc) {
        partnerDoc = await DeliveryPartner.create({
          user: riderUser._id,
          vendorId: vendor._id,
          name,
          email: normalizedEmail,
          phone: phone || `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
          vehicleType: vehicleType || 'Electric Bike',
          vehicleNumber: vehicleNumber || 'Pending KYC'
        });
      } else {
        // Update vendorId if not set
        if (!partnerDoc.vendorId) {
          partnerDoc.vendorId = vendor._id;
          await partnerDoc.save();
        }
      }
      deliveryPartnerId = partnerDoc._id;
    }

    const newBoy = {
      name,
      phone,
      email: email ? email.trim().toLowerCase() : '',
      userId: linkedUserId,
      role: role || 'delivery_rider',
      roleTitle: roleTitle || 'Quick Delivery Partner',
      vehicleType: vehicleType || 'Electric Bike',
      vehicleNumber: vehicleNumber || '',
      drivingLicence: drivingLicence || 'DL-VERIFIED',
      status: 'available',
      rating: 5.0,
      totalDeliveries: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bankDetails: {
        accountHolderName: bankDetails?.accountHolderName || name || '',
        accountNumber: bankDetails?.accountNumber || '',
        ifscCode: bankDetails?.ifscCode || '',
        bankName: bankDetails?.bankName || '',
        upiId: bankDetails?.upiId || ''
      }
    };

    vendor.deliveryTeam.push(newBoy);
    await vendor.save();

    const created = vendor.deliveryTeam[vendor.deliveryTeam.length - 1];

    // Save vendorTeamMemberId on the DeliveryPartner doc for cross-reference
    if (deliveryPartnerId) {
      const DeliveryPartner = require('../models/DeliveryPartner');
      await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
        vendorTeamMemberId: created._id.toString()
      });
    }

    res.status(201).json({
      success: true,
      message: email && password
        ? `Delivery partner added! They can log in at /delivery/login with email: ${email}`
        : 'Delivery partner added to your fleet!',
      deliveryBoy: {
        ...created.toObject(),
        id: created._id.toString(),
        canLogin: !!(email && password)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/vendors/delivery-team/:id
// @desc    Update status/details of a rider in THIS vendor's fleet
router.put('/delivery-team/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const boy = vendor.deliveryTeam.id(req.params.id);
    if (!boy) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found in your team.' });
    }

    if (req.body.status) boy.status = req.body.status;
    if (req.body.name) boy.name = req.body.name;
    if (req.body.phone) boy.phone = req.body.phone;
    if (req.body.vehicleNumber) boy.vehicleNumber = req.body.vehicleNumber;

    await vendor.save();

    res.json({
      success: true,
      message: 'Delivery partner updated!',
      deliveryBoy: {
        ...boy.toObject(),
        id: boy._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/vendors/delivery-team/:id
// @desc    Remove a rider from THIS vendor's fleet
router.delete('/delivery-team/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const vendor = await getAuthenticatedVendor(req);
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor profile not found.' });
    }

    const boy = vendor.deliveryTeam.id(req.params.id);
    if (!boy) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found in your team.' });
    }

    vendor.deliveryTeam.pull(req.params.id);
    await vendor.save();

    res.json({ success: true, message: 'Delivery partner removed from your fleet.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
