const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { listGallery, createGallery, deleteGallery, updateGallery, bulkDeleteGallery } = require("../controllers/galleryController");

const router = express.Router();

// GET  /api/gallery           — public
router.get("/", listGallery);

// POST /api/gallery           — admin only
router.post("/", requireAuth, requireRole("admin"), createGallery);

// PATCH /api/gallery/:id      — admin only (edit metadata)
router.patch("/:id", requireAuth, requireRole("admin"), updateGallery);

// POST /api/gallery/bulk-delete — admin only
router.post("/bulk-delete", requireAuth, requireRole("admin"), bulkDeleteGallery);

// DELETE /api/gallery/:id     — admin only
router.delete("/:id", requireAuth, requireRole("admin"), deleteGallery);

module.exports = router;
