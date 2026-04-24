const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    // Primary fields (new schema)
    title: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized"
    },
    section: {
      type: String,
      trim: true,
      default: "Primary"
    },
    // Legacy field aliases (from older uploads — kept for backward compatibility)
    url: {
      type: String,
      trim: true,
      default: ""
    },
    caption: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

// Virtual: resolve imageUrl from either new or legacy field
galleryItemSchema.virtual("resolvedImageUrl").get(function () {
  return this.imageUrl || this.url || "";
});

// Virtual: resolve title from either new or legacy field
galleryItemSchema.virtual("resolvedTitle").get(function () {
  return this.title || this.caption || "Gallery Image";
});

galleryItemSchema.set("toJSON", { virtuals: true });
galleryItemSchema.set("toObject", { virtuals: true });

// Index for fast sorting
galleryItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model("GalleryItem", galleryItemSchema);
