const express = require("express");
const {
	selfEnroll,
    allSelfEnroll
} = require("../controllers/selfEnrollController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/allSelfEnroll", auth, allSelfEnroll);

router.post("/newSelfEnroll",auth, selfEnroll);


module.exports = router;
