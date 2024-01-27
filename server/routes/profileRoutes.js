const express = require("express");
const { auth } = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/updateprofile", auth, updateProfile);
module.exports = router;
