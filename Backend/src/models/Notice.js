const mongoose = require("mongoose");

const ALLOWED_TAGS = ["Academic", "Admin", "Circular", "Meeting", "General"];

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    description: {
      type: String,
      required: [true, "Notice description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [2000, "Description cannot exceed 2000 characters"]
    },
    tag: {
      type: String,
      required: [true, "Notice tag is required"],
      enum: { values: ALLOWED_TAGS, message: "Tag must be one of: " + ALLOWED_TAGS.join(", ") },
      default: "General"
    },
    date: {
      type: Date,
      required: [true, "Notice date is required"],
      default: Date.now
    },
    isNew: {
      type: Boolean,
      default: true
    },
    publishedBy: {
      type: String,
      trim: true,
      default: "Admin Desk",
      maxlength: [100, "Publisher name cannot exceed 100 characters"]
    }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

// Auto-set isNew = false for notices older than 7 days on read
noticeSchema.pre(/^find/, function () {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  this.transform((docs) => {
    return docs.map((doc) => {
      if (doc.createdAt && doc.createdAt < sevenDaysAgo) {
        doc.isNew = false;
      }
      return doc;
    });
  });
});

// Index for fast sorting
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ tag: 1 });

module.exports = mongoose.model("Notice", noticeSchema);
module.exports.ALLOWED_TAGS = ALLOWED_TAGS;
