const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { env } = require("../config/env");

const uploadRoot = path.resolve(env.uploadDir);
if (!fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

// Disk storage for local uploads (images, PDFs)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${timestamp}-${safeName}`);
  }
});

// Memory storage for Cloudinary uploads (videos)
const memoryStorage = multer.memoryStorage();

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Unsupported file type"));
};

// File filter for videos
const videoFileFilter = (req, file, cb) => {
  const allowed = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
  if (allowed.includes(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Unsupported video format. Use MP4, WebM, MOV, or MKV."));
};

// Upload middleware for local files (5MB limit)
const upload = multer({ 
  storage: diskStorage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// Upload middleware for videos to Cloudinary (100MB limit)
const uploadVideo = multer({ 
  storage: memoryStorage, 
  fileFilter: videoFileFilter, 
  limits: { fileSize: 100 * 1024 * 1024 } 
});

module.exports = { upload, uploadVideo };
