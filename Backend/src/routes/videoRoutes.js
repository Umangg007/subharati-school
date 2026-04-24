const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { uploadVideo: uploadVideoMiddleware } = require('../middleware/upload');
const { uploadVideo, listVideos, deleteVideo, updateVideo } = require('../controllers/videoController');

const router = express.Router();

// GET /api/videos - public
router.get('/', listVideos);

// POST /api/videos - admin only (upload)
router.post('/', requireAuth, requireRole('admin'), uploadVideoMiddleware.single('file'), uploadVideo);

// PATCH /api/videos/:id - admin only (update metadata)
router.patch('/:id', requireAuth, requireRole('admin'), updateVideo);

// DELETE /api/videos/:id - admin only
router.delete('/:id', requireAuth, requireRole('admin'), deleteVideo);

module.exports = router;
