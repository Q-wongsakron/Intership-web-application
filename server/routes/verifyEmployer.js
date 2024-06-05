const express = require("express");
const {
	listEmployer,
	verifyEmployer,
} = require("../controllers/verifyEmployer");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/listEmployer", auth, listEmployer);

router.post("/verifyEmployer", auth, verifyEmployer);

module.exports = router;
