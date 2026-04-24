const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { env } = require("../config/env");
const {
  isEmail,
  isNonEmptyString,
  isStrongPassword,
  normalizeEmail,
  normalizeString
} = require("../utils/validators");

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const cleanName = normalizeString(name);
    const cleanEmail = normalizeEmail(email);
    const errors = [];

    if (!isNonEmptyString(cleanName, 100)) errors.push("Name is required (max 100 chars)");
    if (!isEmail(cleanEmail)) errors.push("A valid email address is required");
    if (!isStrongPassword(password))
      errors.push("Password must be 8–128 characters and include uppercase, lowercase, and a digit");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ success: false, message: "This email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const role = env.adminEmails.includes(cleanEmail) ? "admin" : "user";
    const user = await User.create({ name: cleanName, email: cleanEmail, passwordHash, role });

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = normalizeEmail(email);
    const errors = [];

    if (!isEmail(cleanEmail)) errors.push("A valid email address is required");
    if (!isNonEmptyString(password, 128)) errors.push("Password is required");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      // Use the same message for both "not found" and "wrong password" to prevent enumeration
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { sub: user._id, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Get Current User ─────────────────────────────────────────────────────────

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    return next(err);
  }
};


// ─── Change Password ─────────────────────────────────────────────────────────

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const errors = [];

    if (!isNonEmptyString(currentPassword, 128)) errors.push("Current password is required");
    if (!isStrongPassword(newPassword))
      errors.push("New password must be 8–128 characters and include uppercase, lowercase, and a digit");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const user = await User.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = passwordHash;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, getMe, changePassword };
