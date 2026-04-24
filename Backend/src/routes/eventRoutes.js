const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { listEvents, createEvent, deleteEvent } = require("../controllers/eventController");

const router = express.Router();

// GET /api/events          — public (supports ?category=Sports&upcoming=true&page=1&limit=20)
router.get("/", listEvents);

// POST /api/events         — admin only
router.post("/", requireAuth, requireRole("admin"), createEvent);

// DELETE /api/events/:id   — admin only
router.delete("/:id", requireAuth, requireRole("admin"), deleteEvent);

module.exports = router;
