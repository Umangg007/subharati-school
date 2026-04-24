const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { createAdmission, listAdmissions, deleteAdmission, updateAdmissionStatus } = require("../controllers/admissionController");

const router = express.Router();

// POST /api/admissions — public (anyone can submit)
router.post("/", createAdmission);

// GET /api/admissions — admin only with pagination (?page=1&limit=20)
router.get("/", requireAuth, requireRole("admin"), listAdmissions);

// DELETE /api/admissions/:id — admin only
router.delete("/:id", requireAuth, requireRole("admin"), deleteAdmission);

// PATCH /api/admissions/:id/status — admin only
router.patch("/:id/status", requireAuth, requireRole("admin"), updateAdmissionStatus);

module.exports = router;
