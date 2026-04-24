const path = require("path");
const { env } = require("../config/env");

const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const urlPath = `/uploads/${req.file.filename}`;

    return res.status(201).json({
      filename: req.file.filename,
      url: urlPath,
      path: path.resolve(env.uploadDir, req.file.filename)
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { uploadSingle };
