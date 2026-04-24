const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { createEnquiry, listEnquiries, deleteEnquiry, updateEnquiryStatus } = require("../controllers/enquiryController");

const router = express.Router();

// POST /api/enquiries — public (anyone can submit)
router.post("/", createEnquiry);

// GET /api/enquiries — admin only with pagination (?page=1&limit=20)
router.get("/", requireAuth, requireRole("admin"), listEnquiries);

// DELETE /api/enquiries/:id — admin only
router.delete("/:id", requireAuth, requireRole("admin"), deleteEnquiry);

// PATCH /api/enquiries/:id/status — admin only
router.patch("/:id/status", requireAuth, requireRole("admin"), updateEnquiryStatus);

module.exports = router;
