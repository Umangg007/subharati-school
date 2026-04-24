const GalleryItem = require("../models/GalleryItem");
const {
  isNonEmptyString,
  isPublicImageUrl,
  isMongoId,
  normalizeString
} = require("../utils/validators");

// ─── List Gallery (public) ────────────────────────────────────────────────────

const listGallery = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    // Filter by section if provided
    if (req.query.section) {
      const section = req.query.section.trim();
      if (section) {
        const sectionRegex = new RegExp(`^${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        filter.section = sectionRegex;
      }
    }

    // Filter by category if provided and not 'All'
    if (req.query.category && req.query.category !== 'All') {
      const category = req.query.category.trim();
      if (category) {
        const categoryRegex = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        filter.category = categoryRegex;
      }
    }

    // Search filter
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { caption: searchRegex }
      ];
    }

    const [items, total] = await Promise.all([
      GalleryItem.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      GalleryItem.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Create Gallery Item (admin) ───────────────────────────────────────────────

const createGallery = async (req, res, next) => {
  try {
    const { title, description, imageUrl, category, section } = req.body;
    const cleanTitle = normalizeString(title);
    const cleanDescription = normalizeString(description);
    const cleanImageUrl = normalizeString(imageUrl);
    const cleanCategory = normalizeString(category) || "Uncategorized";
    const cleanSection = normalizeString(section) || "Primary";
    const errors = [];

    if (!isNonEmptyString(cleanTitle, 120)) errors.push("Title is required (max 120 chars)");
    if (cleanDescription && !isNonEmptyString(cleanDescription, 1000))
      errors.push("Description is too long (max 1000 chars)");
    if (!isPublicImageUrl(cleanImageUrl)) errors.push("A valid image URL is required (http/https or /uploads/)");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const item = await GalleryItem.create({
      title: cleanTitle,
      description: cleanDescription || undefined,
      imageUrl: cleanImageUrl,
      category: cleanCategory,
      section: cleanSection
    });

    return res.status(201).json({
      success: true,
      message: "Gallery item created",
      data: item
    });
  } catch (err) {
    return next(err);
  }
};

// ─── Delete Gallery Item (admin) ───────────────────────────────────────────────

const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid gallery item ID" });
    }

    const deleted = await GalleryItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    return res.json({ success: true, message: "Gallery item deleted" });
  } catch (err) {
    return next(err);
  }
};


// ─── Update Gallery Item (admin) ───────────────────────────────────────────────

const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isMongoId(id)) {
      return res.status(400).json({ success: false, message: "Invalid gallery item ID" });
    }

    const { title, description, category, section } = req.body;
    const cleanTitle       = normalizeString(title);
    const cleanDescription = normalizeString(description);
    const cleanCategory    = normalizeString(category);
    const cleanSection     = normalizeString(section);
    const errors = [];

    if (cleanTitle && !isNonEmptyString(cleanTitle, 120)) errors.push("Title is too long (max 120 chars)");
    if (cleanDescription && !isNonEmptyString(cleanDescription, 1000)) errors.push("Description is too long (max 1000 chars)");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const updateFields = {};
    if (cleanTitle)       updateFields.title       = cleanTitle;
    if (cleanDescription !== undefined) updateFields.description = cleanDescription;
    if (cleanCategory)    updateFields.category    = cleanCategory;
    if (cleanSection)     updateFields.section     = cleanSection;

    const updated = await GalleryItem.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    return res.json({ success: true, message: "Gallery item updated", data: updated });
  } catch (err) {
    return next(err);
  }
};

// ─── Bulk Delete Gallery Items (admin) ────────────────────────────────────────

const bulkDeleteGallery = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids must be a non-empty array" });
    }
    const validIds = ids.filter(id => isMongoId(id));
    if (validIds.length === 0) {
      return res.status(400).json({ success: false, message: "No valid IDs provided" });
    }
    const result = await GalleryItem.deleteMany({ _id: { $in: validIds } });
    return res.json({ success: true, message: `Deleted ${result.deletedCount} item(s)` });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listGallery, createGallery, deleteGallery, updateGallery, bulkDeleteGallery };
