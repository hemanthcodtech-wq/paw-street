const https = require('https');
const crypto = require('crypto');
const path = require('path');

/**
 * AWS S3 Storage Configuration
 * Direct native implementation with AWS Signature Version 4 (SigV4)
 * Zero external package dependencies needed, fully compatible with all AWS S3 regions.
 */

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '';
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'pawstreet-media-storage';
const AWS_S3_CUSTOM_DOMAIN = process.env.AWS_S3_CUSTOM_DOMAIN || '';

/**
 * Helper to compute HMAC SHA256
 */
function hmac(key, string, encoding) {
  return crypto.createHmac('sha256', key).update(string, 'utf8').digest(encoding);
}

/**
 * Generate AWS Signature V4 Signing Key
 */
function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = hmac('AWS4' + key, dateStamp);
  const kRegion = hmac(kDate, regionName);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'aws4_request');
  return kSigning;
}

/**
 * Upload a file buffer directly to AWS S3 using AWS REST API & SigV4
 * @param {Buffer} fileBuffer - Multer memory file buffer
 * @param {string} originalName - Original filename
 * @param {string} mimetype - Content-Type of the file (e.g., 'image/jpeg')
 * @param {string} folder - Folder prefix (e.g., 'pawnear/products', 'pawnear/kyc')
 * @returns {Promise<{ url: string, key: string, bucket: string, format: string }>}
 */
const uploadToS3 = (fileBuffer, originalName = 'upload.jpg', mimetype = 'image/jpeg', folder = 'pawnear/general') => {
  return new Promise((resolve, reject) => {
    // Determine extension
    const ext = path.extname(originalName).replace('.', '') || (mimetype.includes('png') ? 'png' : mimetype.includes('webp') ? 'webp' : 'jpg');
    const sanitizedFolder = folder.replace(/^\/+|\/+$/g, '');
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const key = `${sanitizedFolder}/${uniqueSuffix}.${ext}`;

    const bucket = AWS_S3_BUCKET_NAME;
    const region = AWS_REGION;
    const host = region === 'us-east-1' ? `${bucket}.s3.amazonaws.com` : `${bucket}.s3.${region}.amazonaws.com`;
    const publicUrl = AWS_S3_CUSTOM_DOMAIN
      ? `https://${AWS_S3_CUSTOM_DOMAIN}/${key}`
      : `https://${host}/${key}`;

    // If AWS credentials are missing or default dummy placeholders in local dev, return simulated S3 URL
    const isMock = !AWS_ACCESS_KEY_ID ||
      !AWS_SECRET_ACCESS_KEY ||
      AWS_ACCESS_KEY_ID.includes('EXAMPLE') ||
      AWS_ACCESS_KEY_ID.length < 10;

    if (isMock) {
      console.log(`[AWS S3] Dev simulation upload -> ${publicUrl}`);
      return resolve({
        url: publicUrl,
        key,
        bucket,
        format: ext,
        provider: 'AWS_S3_DEV'
      });
    }

    // Prepare SigV4 Request
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const canonicalUri = `/${encodeURI(key)}`;
    const canonicalHeaders = `content-type:${mimetype}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';

    const canonicalRequest = [
      'PUT',
      canonicalUri,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex')
    ].join('\n');

    const signingKey = getSignatureKey(AWS_SECRET_ACCESS_KEY, dateStamp, region, 's3');
    const signature = hmac(signingKey, stringToSign, 'hex');

    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const options = {
      hostname: host,
      port: 443,
      path: canonicalUri,
      method: 'PUT',
      headers: {
        'Host': host,
        'Content-Type': mimetype,
        'Content-Length': fileBuffer.length,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            url: publicUrl,
            key,
            bucket,
            format: ext,
            provider: 'AWS_S3'
          });
        } else {
          console.error(`[AWS S3] Upload failed status ${res.statusCode}:`, responseBody);
          reject(new Error(`AWS S3 Upload Failed: HTTP ${res.statusCode} - ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('[AWS S3] Network Error:', err.message);
      reject(err);
    });

    req.write(fileBuffer);
    req.end();
  });
};

module.exports = {
  uploadToS3,
  AWS_S3_BUCKET_NAME,
  AWS_REGION
};

