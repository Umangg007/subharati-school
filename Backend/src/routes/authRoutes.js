const express = require("express");
const { register, login, getMe, changePassword } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me  — requires valid JWT
router.get("/me", requireAuth, getMe);

// POST /api/auth/change-password — requires valid JWT
router.post("/change-password", requireAuth, changePassword);

module.exports = router;
