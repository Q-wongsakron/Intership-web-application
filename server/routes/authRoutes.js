const express = require("express");
const {
  loginStudent,
  loginAdmin,
  registerEmployer,
  getCurrentUser,
  loginEmployer,
  findYearStd,
  forgotPassword,
  resetPassword,
  verifyEmail,

} = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/registerEmployer", registerEmployer);
router.post("/verify-email", verifyEmail);
router.post("/loginStudent", loginStudent);
router.post("/loginAdmin", loginAdmin);
router.post("/loginEmployer", loginEmployer);

router.post("/current-user", auth, getCurrentUser);
router.get("/findYearStd/:id", findYearStd);

router.post("/forgotPassword",forgotPassword)
router.post("/resetPassword",resetPassword)
module.exports = router;
