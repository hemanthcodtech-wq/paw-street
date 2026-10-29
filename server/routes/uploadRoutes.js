const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadToS3 } = require('../config/s3');

// @route   POST /api/upload
// @desc    Upload file/photo to AWS S3 Server
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const folder = req.body.folder || 'pawnear/general';
    const result = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    res.json({
      success: true,
      message: 'Image uploaded to AWS S3 successfully!',
      url: result.url,
      key: result.key,
      bucket: result.bucket,
      format: result.format
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple files (e.g. KYC docs, storefront photos) to AWS S3
router.post('/multiple', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image.' });
    }

    const folder = req.body.folder || 'pawnear/multi';
    const uploadPromises = req.files.map(file =>
      uploadToS3(file.buffer, file.originalname, file.mimetype, folder)
    );
    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: 'All images uploaded to AWS S3 successfully!',
      urls: results.map(r => r.url)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
