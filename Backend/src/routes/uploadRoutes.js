const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { uploadSingle } = require("../controllers/uploadController");

const router = express.Router();

router.post("/", requireAuth, requireRole("admin"), upload.single("file"), uploadSingle);

module.exports = router;
