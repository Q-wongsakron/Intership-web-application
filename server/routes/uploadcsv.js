const express = require("express");
const { upload } = require("../controllers/uploadCsvController");
const { auth, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.post("/uploadcsv", auth, adminCheck, upload);
module.exports = router;
