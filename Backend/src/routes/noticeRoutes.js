const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { listNotices, createNotice, deleteNotice } = require("../controllers/noticeController");

const router = express.Router();

// GET /api/notices         — public (supports ?tag=Academic&page=1&limit=20)
router.get("/", listNotices);

// POST /api/notices        — admin only
router.post("/", requireAuth, requireRole("admin"), createNotice);

// DELETE /api/notices/:id  — admin only
router.delete("/:id", requireAuth, requireRole("admin"), deleteNotice);

module.exports = router;
