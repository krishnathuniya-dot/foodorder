const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads folder path
const uploadDir = path.join(__dirname, "..", "uploads");

// Create uploads folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpg|jpeg|png|webp/;
  const ext = allowedExt.test(path.extname(file.originalname).toLowerCase());

  const allowedMime = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  const mime = allowedMime.includes(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer upload
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;