const Enquiry = require("../models/Enquiry");
const { sendEmail } = require("../services/emailService");
const {
  isEmail,
  isNonEmptyString,
  isRequiredPhone,
  isMongoId,
  normalizeEmail,
  normalizeString
} = require("../utils/validators");

// ─── Create Enquiry ───────────────────────────────────────────────────────────

const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const cleanName = normalizeString(name);
    const cleanEmail = normalizeEmail(email);
    const cleanMessage = normalizeString(message);
    const cleanPhone = normalizeString(phone);
    const errors = [];

    if (!isNonEmptyString(cleanName, 100)) errors.push("Name is required (max 100 chars)");
    if (!isEmail(cleanEmail)) errors.push("A valid email address is required");
    if (!isNonEmptyString(cleanMessage, 2000)) errors.push("Message is required (max 2000 chars)");
    if (!isRequiredPhone(cleanPhone)) errors.push("A valid phone number is required (7–20 digits)");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const enquiry = await Enquiry.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage
    });

    // Fire-and-forget — do not block response on email delivery
    sendEmail({
      subject: "New Enquiry — Subharati",
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone}`,
        `Message:\n${cleanMessage}`
      ].join("\n")
    }).catch((e) => console.error("Email error:", e.message));

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry
    });
  } catch (err) {
    return next(err);
  }
};

// ─── List Enquiries (admin) ────────────────────────────────────────────────────

const listEnquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      Enquiry.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Enquiry.countDocuments()
    ]);

    return res.json({
      success: true,
      data: enquiries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Delete Enquiry (admin) ────────────────────────────────────────────────────

const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid enquiry ID" });
    }

    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Enquiry record not found" });
    }

    return res.json({ success: true, message: "Enquiry record deleted" });
  } catch (err) {
    return next(err);
  }
};


// ─── Update Enquiry Status (admin) ─────────────────────────────────────────────

const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid enquiry ID" });
    }

    const allowedStatuses = ['Pending', 'Replied', 'Closed'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry record not found" });
    }

    return res.json({ success: true, message: "Status updated successfully", data: enquiry });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createEnquiry, listEnquiries, deleteEnquiry, updateEnquiryStatus };
