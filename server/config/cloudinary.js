const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pawnear-media',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789012345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'sample_secret'
});

/**
 * Upload a buffer or file to Cloudinary with folder organization
 * @param {Buffer} fileBuffer - Buffer from Multer memory storage
 * @param {string} folder - Destination folder (e.g., 'pawnear/products', 'pawnear/vendors', 'pawnear/kyc')
 * @returns {Promise<Object>} Cloudinary upload response object
 */
const uploadToCloudinary = (fileBuffer, folder = 'pawnear/general') => {
  return new Promise((resolve, reject) => {
    // If running in development with sample keys, return a safe simulated URL fallback
    if (
      !process.env.CLOUDINARY_API_KEY ||
      process.env.CLOUDINARY_API_KEY === '123456789012345'
    ) {
      return resolve({
        secure_url: `/images/promo_puppy.jpg`,
        public_id: `simulated_${Date.now()}`,
        format: 'jpg'
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
