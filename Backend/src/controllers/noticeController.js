const Notice = require("../models/Notice");
const { ALLOWED_TAGS } = require("../models/Notice");
const {
  isNonEmptyString,
  isAllowedValue,
  isValidDate,
  isMongoId,
  normalizeString
} = require("../utils/validators");

// ─── List Notices (public) ────────────────────────────────────────────────────

const listNotices = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Optional tag filter from query string
    const filter = {};
    if (req.query.tag && isAllowedValue(req.query.tag, ALLOWED_TAGS)) {
      filter.tag = req.query.tag;
    }

    const [notices, total] = await Promise.all([
      Notice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notice.countDocuments(filter)
    ]);

    // Auto-compute isNew based on age (7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const enriched = notices.map((n) => ({
      ...n.toObject(),
      isNew: n.createdAt > sevenDaysAgo
    }));

    return res.json({
      success: true,
      data: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Create Notice (admin) ────────────────────────────────────────────────────

const createNotice = async (req, res, next) => {
  try {
    const { title, description, tag, date, publishedBy } = req.body;
    const cleanTitle = normalizeString(title);
    const cleanDescription = normalizeString(description);
    const cleanTag = normalizeString(tag) || "General";
    const cleanPublishedBy = normalizeString(publishedBy) || "Admin Desk";
    const errors = [];

    if (!isNonEmptyString(cleanTitle, 200)) errors.push("Title is required (max 200 chars)");
    if (!isNonEmptyString(cleanDescription, 2000)) errors.push("Description is required (max 2000 chars)");
    if (!isAllowedValue(cleanTag, ALLOWED_TAGS))
      errors.push(`Tag must be one of: ${ALLOWED_TAGS.join(", ")}`);
    if (date && !isValidDate(date)) errors.push("Date must be a valid date value");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const notice = await Notice.create({
      title: cleanTitle,
      description: cleanDescription,
      tag: cleanTag,
      date: date ? new Date(date) : new Date(),
      publishedBy: cleanPublishedBy
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Delete Notice (admin) ────────────────────────────────────────────────────

const deleteNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid notice ID" });
    }

    const deleted = await Notice.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Notice not found" });
    }

    return res.json({ success: true, message: "Notice deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listNotices, createNotice, deleteNotice };
