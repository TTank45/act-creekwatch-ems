const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  getUploads,
  uploadCsvFile,
} = require("../controllers/uploadController");

const router = express.Router();

const uploadsDirectory = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.get("/", getUploads);
router.post("/", upload.single("csvFile"), uploadCsvFile);

module.exports = router;