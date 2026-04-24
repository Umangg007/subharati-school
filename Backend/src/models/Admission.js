const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    course: { type: String, required: true, trim: true },
    details: { type: String, trim: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
