const mongoose = require("mongoose");

const ALLOWED_CATEGORIES = ["Sports", "Culture", "Academic", "Camp", "General"];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    date: {
      type: Date,
      required: [true, "Event date is required"]
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      trim: true,
      maxlength: [100, "Time cannot exceed 100 characters"]
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
      maxlength: [200, "Venue cannot exceed 200 characters"]
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: { values: ALLOWED_CATEGORIES, message: "Category must be one of: " + ALLOWED_CATEGORIES.join(", ") },
      default: "General"
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    isUpcoming: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Virtual: recalculate isUpcoming based on current date
eventSchema.virtual("isFuture").get(function () {
  return this.date > new Date();
});

// Index
eventSchema.index({ date: -1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model("Event", eventSchema);
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
