const Admission = require("../models/Admission");
const { sendEmail } = require("../services/emailService");
const {
  isEmail,
  isNonEmptyString,
  isRequiredPhone,
  isMongoId,
  normalizeEmail,
  normalizeString
} = require("../utils/validators");

// ─── Create Admission ─────────────────────────────────────────────────────────

const createAdmission = async (req, res, next) => {
  try {
    const { name, email, phone, course, details } = req.body;
    const cleanName = normalizeString(name);
    const cleanEmail = normalizeEmail(email);
    const cleanPhone = normalizeString(phone);
    const cleanCourse = normalizeString(course);
    const cleanDetails = normalizeString(details);
    const errors = [];

    if (!isNonEmptyString(cleanName, 100)) errors.push("Name is required (max 100 chars)");
    if (!isEmail(cleanEmail)) errors.push("A valid email address is required");
    if (!isNonEmptyString(cleanCourse, 120)) errors.push("Course / grade is required (max 120 chars)");
    if (!isNonEmptyString(cleanDetails, 2000)) errors.push("Details are required (max 2000 chars)");
    if (!isRequiredPhone(cleanPhone)) errors.push("A valid phone number is required (7–20 digits)");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const admission = await Admission.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      course: cleanCourse,
      details: cleanDetails
    });

    // Fire-and-forget — do not block response on email delivery
    sendEmail({
      subject: "New Admission Request — Subharati",
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone}`,
        `Course: ${cleanCourse}`,
        `Details:\n${cleanDetails}`
      ].join("\n")
    }).catch((e) => console.error("Email error:", e.message));

    return res.status(201).json({
      success: true,
      message: "Admission request submitted successfully",
      data: admission
    });
  } catch (err) {
    return next(err);
  }
};

// ─── List Admissions (admin) ───────────────────────────────────────────────────

const listAdmissions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [admissions, total] = await Promise.all([
      Admission.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Admission.countDocuments()
    ]);

    return res.json({
      success: true,
      data: admissions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Delete Admission (admin) ─────────────────────────────────────────────────

const deleteAdmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid admission ID" });
    }

    const deleted = await Admission.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Admission record not found" });
    }

    return res.json({ success: true, message: "Admission record deleted" });
  } catch (err) {
    return next(err);
  }
};


// ─── Update Admission Status (admin) ──────────────────────────────────────────

const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid admission ID" });
    }

    const allowedStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const admission = await Admission.findByIdAndUpdate(id, { status }, { new: true });
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission record not found" });
    }

    return res.json({ success: true, message: "Status updated successfully", data: admission });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createAdmission, listAdmissions, deleteAdmission, updateAdmissionStatus };
