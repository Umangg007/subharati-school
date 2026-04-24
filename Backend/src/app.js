const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const { env } = require("./config/env");
const { notFound, errorHandler } = require("./middleware/error");

const authRoutes = require("./routes/authRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const videoRoutes = require("./routes/videoRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ─── Rate Limiters Removed ──────────────────────────────────────────────────


// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv !== "test") app.use(morgan("dev"));

// ─── Rate Limiting Removed ──────────────────────────────────────────────────


// ─── Static Upload Serving ────────────────────────────────────────────────────

app.use("/uploads", express.static(path.resolve(env.uploadDir)));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);

// ─── 404 & Error Handlers ─────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

module.exports = { app };
