const express = require("express");
const { upload } = require("../controllers/uploadCsvController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/uploadcsv", auth, upload);
module.exports = router;
