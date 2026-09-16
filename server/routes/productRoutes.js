const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Initial seed sample products if DB is empty
const defaultProducts = [
  {
    title: 'Royal Canin Maxi Adult Dog Food (15kg)',
    description: 'Complete nutrition tailored for large breed adult dogs (26 to 44 kg). Promotes optimal digestive health and joint support.',
    type: 'product',
    category: 'Dog Food',
    petType: 'Dog',
    price: 6899,
    mrp: 7500,
    stock: 45,
    primaryImage: '/images/prod_drools.jpg',
    images: ['/images/prod_drools.jpg'],
    vendorName: 'Paws & Whiskers Supermart',
    status: 'approved',
    rating: 4.8,
    isFeatured: true
  },
  {
    title: 'Pedigree Pro High Protein Puppy Dry Food (10kg)',
    description: 'Professional nutrition designed for active growing puppies. Contains 32% high quality protein.',
    type: 'product',
    category: 'Dog Food',
    petType: 'Dog',
    price: 3299,
    mrp: 3800,
    stock: 28,
    primaryImage: '/images/prod_pedigree.jpg',
    images: ['/images/prod_pedigree.jpg'],
    vendorName: 'Paws & Whiskers Supermart',
    status: 'approved',
    rating: 4.7,
    isFlashDeal: true
  },
  {
    title: 'Full Body Hydrotherapy & Medicated Herbal Spa for Dogs',
    description: 'Therapeutic warm hydro-bath with natural neem and tea tree extract for skin relief and anti-flea protection.',
    type: 'service',
    category: 'Pet Grooming & Spa',
    petType: 'Dog',
    price: 1899,
    mrp: 2400,
    stock: 999,
    primaryImage: '/images/cat_grooming.jpg',
    images: ['/images/cat_grooming.jpg'],
    vendorName: 'Royal Pet Grooming & Spa Hub',
    status: 'approved',
    serviceModes: ['At-Home Service', 'Clinic / Spa Visit'],
    durationMinutes: 60,
    rating: 4.9,
    isFeatured: true
  },
  {
    title: 'Comprehensive Veterinary Health Checkup & Consultation',
    description: 'Complete physical evaluation, vitals checking, deworming assessment, and tailored dietary planning with senior veterinarians.',
    type: 'service',
    category: 'Veterinary Clinic & Hospital',
    petType: 'All Pets',
    price: 699,
    mrp: 999,
    stock: 999,
    primaryImage: '/images/cat_clinic.jpg',
    images: ['/images/cat_clinic.jpg'],
    vendorName: 'CityCare Animal Hospital & Clinic',
    status: 'approved',
    serviceModes: ['Clinic / Spa Visit', 'At-Home Service'],
    durationMinutes: 30,
    rating: 4.95,
    isFeatured: true
  }
];

// @route   GET /api/products
// @desc    Get all products with flexible filtering and search
router.get('/', async (req, res) => {
  try {
    const { category, petType, type, search, vendorId, isFeatured, isFlashDeal } = req.query;

    let query = { status: 'approved' };

    if (category) query.category = category;
    if (petType && petType !== 'All') query.petType = { $in: [petType, 'All Pets'] };
    if (type) query.type = type;
    if (isFeatured) query.isFeatured = isFeatured === 'true';
    if (isFlashDeal) query.isFlashDeal = isFlashDeal === 'true';
    if (vendorId) query.vendor = vendorId;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } }
      ];
    }

    let products = [];
    try {
      products = await Product.find(query).sort({ createdAt: -1 });
      if (products.length === 0) {
        // Auto-seed if collection is completely empty
        const count = await Product.countDocuments();
        if (count === 0) {
          products = await Product.insertMany(defaultProducts);
        }
      }
    } catch (dbErr) {
      products = defaultProducts;
    }

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    let product = null;
    try {
      product = await Product.findById(req.params.id);
    } catch (e) {}

    if (!product) {
      product = defaultProducts.find(p => p.title.toLowerCase().includes(req.params.id.toLowerCase())) || defaultProducts[0];
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product or service (Vendor or Admin)
router.post('/', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    let vendorId = req.body.vendor;
    let vendorName = req.body.vendorName || 'PAW NEAR Direct';

    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({
        $or: [
          { user: req.user._id },
          { email: req.user.email?.toLowerCase() }
        ]
      });
      if (!vendorProfile) {
        return res.status(403).json({ success: false, message: 'Vendor profile not found for this user.' });
      }
      vendorId = vendorProfile._id;
      vendorName = vendorProfile.storeName;
    }

    const title = req.body.title || req.body.name || 'Pet Item';
    const product = await Product.create({
      ...req.body,
      title,
      vendor: vendorId,
      vendorName,
      status: req.user.role === 'admin' ? 'approved' : 'approved'
    });

    res.status(201).json({
      success: true,
      message: 'Product submitted successfully!',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
router.put('/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({
        $or: [
          { user: req.user._id },
          { email: req.user.email?.toLowerCase() }
        ]
      });
      if (!vendorProfile || (product.vendor && product.vendor.toString() !== vendorProfile._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this product.' });
      }
    }

    const updates = { ...req.body };
    if (updates.name && !updates.title) updates.title = updates.name;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: 'Product updated successfully!', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', protect, authorizeRoles('vendor', 'admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (req.user.role === 'vendor') {
      const vendorProfile = await Vendor.findOne({
        $or: [
          { user: req.user._id },
          { email: req.user.email?.toLowerCase() }
        ]
      });
      if (!vendorProfile || (product.vendor && product.vendor.toString() !== vendorProfile._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this product.' });
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
