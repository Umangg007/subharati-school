const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    trim: true,
    default: 'Infrastructure'
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  format: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

videoSchema.index({ createdAt: -1 });
videoSchema.index({ category: 1 });

module.exports = mongoose.model('Video', videoSchema);
