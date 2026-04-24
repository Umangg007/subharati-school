const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getStats } = require("../controllers/adminController");

const router = express.Router();

// GET /api/admin/stats — admin only
router.get("/stats", requireAuth, requireRole("admin"), getStats);

module.exports = router;
