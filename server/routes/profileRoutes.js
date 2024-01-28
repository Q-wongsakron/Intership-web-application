const express = require("express");
const { auth } = require("../middleware/auth");
const {
  getProfileStudent,
  getProfileEmployer,
  updateProfileStudent,
  updateProfileEmployer,
} = require("../controllers/profileController");
const router = express.Router();

router.get("/profileStudent", auth, getProfileStudent);
router.get("/profileEmployer/:id", getProfileEmployer);
router.put("/updateProfileStudent", auth, updateProfileStudent);
router.put("/updateProfileEmployer", auth, updateProfileEmployer);

module.exports = router;
