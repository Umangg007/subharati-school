const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');
const Video = require('../models/Video');

// Upload video to Cloudinary with auto compression
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Check Cloudinary config
    const { env } = require('../config/env');
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      return res.status(500).json({ 
        success: false, 
        message: 'Cloudinary not configured. Please restart the server.' 
      });
    }

    // Upload to Cloudinary with video optimization
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'subharati/infrastructure',
            // Auto compression settings
            quality: 'auto:good',
            fetch_format: 'auto',
            // For large videos, don't use eager transformations
            // We'll generate thumbnail URL manually
          },
          (error, result) => {
            if (error) {
              console.error('[CLOUDINARY ERROR]', error);
              reject(error);
            } else {
              console.log('[CLOUDINARY SUCCESS] Upload complete');
              resolve(result);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Save to database
    const video = await Video.create({
      title: req.body.title || req.file.originalname.replace(/\.[^/.]+$/, ''),
      description: req.body.description || '',
      category: req.body.category || 'Infrastructure',
      cloudinaryId: result.public_id,
      url: result.secure_url,
      thumbnailUrl: result.secure_url.replace(/\.[^/.]+$/, '.jpg'),
      duration: result.duration || 0,
      format: result.format,
      size: result.bytes
    });

    return res.status(201).json({
      success: true,
      data: video
    });
  } catch (err) {
    return next(err);
  }
};

// Get all videos (public)
const listVideos = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      data: videos,
      pagination: { total: videos.length }
    });
  } catch (err) {
    return next(err);
  }
};

// Delete video
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
    
    // Delete from database
    await Video.findByIdAndDelete(req.params.id);
    
    return res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    return next(err);
  }
};

// Update video metadata
const updateVideo = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, category },
      { new: true }
    );
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    return res.json({ success: true, data: video });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  deleteVideo,
  updateVideo
};
