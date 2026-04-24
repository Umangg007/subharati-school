const Event = require("../models/Event");
const { ALLOWED_CATEGORIES } = require("../models/Event");
const {
  isNonEmptyString,
  isAllowedValue,
  isValidDate,
  isPublicImageUrl,
  isMongoId,
  normalizeString
} = require("../utils/validators");

// ─── List Events (public) ─────────────────────────────────────────────────────

const listEvents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {};
    // Optional category filter
    if (req.query.category && isAllowedValue(req.query.category, ALLOWED_CATEGORIES)) {
      filter.category = req.query.category;
    }
    // Optional upcoming-only filter
    if (req.query.upcoming === "true") {
      filter.date = { $gte: new Date() };
    }

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limit),
      Event.countDocuments(filter)
    ]);

    // Dynamically compute isUpcoming based on real date
    const enriched = events.map((ev) => ({
      ...ev.toObject(),
      isUpcoming: ev.date >= new Date()
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

// ─── Create Event (admin) ─────────────────────────────────────────────────────

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, time, venue, category, imageUrl } = req.body;
    const cleanTitle = normalizeString(title);
    const cleanDescription = normalizeString(description);
    const cleanTime = normalizeString(time);
    const cleanVenue = normalizeString(venue);
    const cleanCategory = normalizeString(category) || "General";
    const cleanImageUrl = normalizeString(imageUrl);
    const errors = [];

    if (!isNonEmptyString(cleanTitle, 200)) errors.push("Title is required (max 200 chars)");
    if (!isNonEmptyString(cleanDescription, 2000)) errors.push("Description is required (max 2000 chars)");
    if (!isValidDate(date)) errors.push("A valid event date is required");
    if (!isNonEmptyString(cleanTime, 100)) errors.push("Event time is required");
    if (!isNonEmptyString(cleanVenue, 200)) errors.push("Venue is required");
    if (!isAllowedValue(cleanCategory, ALLOWED_CATEGORIES))
      errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
    if (cleanImageUrl && !isPublicImageUrl(cleanImageUrl))
      errors.push("Image URL must start with http://, https://, or /uploads/");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const eventDate = new Date(date);
    const event = await Event.create({
      title: cleanTitle,
      description: cleanDescription,
      date: eventDate,
      time: cleanTime,
      venue: cleanVenue,
      category: cleanCategory,
      imageUrl: cleanImageUrl || "",
      isUpcoming: eventDate >= new Date()
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Delete Event (admin) ─────────────────────────────────────────────────────

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listEvents, createEvent, deleteEvent };
