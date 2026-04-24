const mongoose = require("mongoose");

/**
 * 404 handler — must be placed AFTER all routes.
 */
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

/**
 * Global error handler — handles all thrown/next(err) errors.
 * Normalises Mongoose, JWT, and generic errors into clean API responses.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = [];

  // Mongoose — Validation Error (required fields, enum, minlength, etc.)
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose — Cast Error (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  // MongoDB — Duplicate key (e.g., unique email)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `A record with this ${field} already exists`;
  }

  // JWT — errors from jsonwebtoken
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
  }

  // Multer — file upload errors
  else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "File size exceeds the 5 MB limit";
  } else if (err.message === "Unsupported file type") {
    statusCode = 415;
    message = "Unsupported file type. Allowed: JPEG, PNG, WebP, PDF";
  }

  // Never leak stack traces in production
  const response = { success: false, message };
  if (errors.length > 0) response.errors = errors;
  if (process.env.NODE_ENV === "development") response.stack = err.stack;

  return res.status(statusCode).json(response);
};

module.exports = { notFound, errorHandler };
