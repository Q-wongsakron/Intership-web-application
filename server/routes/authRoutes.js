const express = require("express");
const {
  loginStudent,
  loginAdmin,
  registerEmployer,
  getCurrentUser,
  loginEmployer,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/registerEmployer", registerEmployer);

router.post("/loginStudent", loginStudent);
router.post("/loginAdmin", loginAdmin);
router.post("/loginEmployer", loginEmployer);

router.post("/current-user", auth, getCurrentUser);
module.exports = router;
