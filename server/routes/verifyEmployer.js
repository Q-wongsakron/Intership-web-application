const express = require("express");
const {
	listEmployer,
	verifyEmployer,
} = require("../controllers/verifyEmployer");
const { auth, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.get("/listEmployer", auth, adminCheck, listEmployer);

router.post("/verifyEmployer", auth, adminCheck, verifyEmployer);

module.exports = router;
