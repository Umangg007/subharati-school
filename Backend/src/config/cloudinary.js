const cloudinary = require('cloudinary').v2;
const { env } = require('./env');

// Validate Cloudinary config
if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
  console.error('[ERROR] Cloudinary configuration missing. Please check your .env file has:');
  console.error('  - CLOUDINARY_CLOUD_NAME');
  console.error('  - CLOUDINARY_API_KEY');
  console.error('  - CLOUDINARY_API_SECRET');
}

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true
});

module.exports = { cloudinary };
