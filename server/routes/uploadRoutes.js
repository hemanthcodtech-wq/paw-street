const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');

// @route   POST /api/upload
// @desc    Upload file/photo to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const folder = req.body.folder || 'pawnear/general';
    const result = await uploadToCloudinary(req.file.buffer, folder);

    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully!',
      url: result.secure_url || result.url,
      publicId: result.public_id,
      format: result.format
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files (e.g. KYC docs, storefront photos)
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
    }

    const folder = req.body.folder || 'pawnear/multi';
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, folder));
    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'All images uploaded successfully!',
      urls: results.map(r => r.secure_url || r.url)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
