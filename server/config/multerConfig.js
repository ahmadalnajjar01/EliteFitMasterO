const multer = require("multer");
const path = require("path");

// Store files in the "uploads/reviews" folder
const storage = multer.diskStorage({
  destination: "./uploads/reviews/",
  filename: function (req, file, cb) {
    // Filename format: image-<timestamp>.<ext>
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image"); // <-- Field name expected is "image"

module.exports = upload;
