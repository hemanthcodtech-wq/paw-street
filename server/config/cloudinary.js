/**
 * Legacy Cloudinary Wrapper (Deprecated)
 * Fully migrated to AWS S3 Server Storage
 */
const { uploadToS3 } = require('./s3');

module.exports = {
  uploadToCloudinary: (fileBuffer, folder = 'pawnear/general') => {
    return uploadToS3(fileBuffer, 'upload.jpg', 'image/jpeg', folder).then(res => ({
      secure_url: res.url,
      url: res.url,
      public_id: res.key,
      format: res.format
    }));
  },
  uploadToS3
};
