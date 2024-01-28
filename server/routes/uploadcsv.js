const express = require("express");
const upload = require("../middleware/multerStorage");
const {
  uploadcsv,
  uploadFileSlide,
} = require("../controllers/uploadCsvController");
const { auth, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/uploadCsv", auth, adminCheck, uploadcsv);

router.post("/uploadFileSlide", upload.single("file_slide"), uploadFileSlide);
module.exports = router;
