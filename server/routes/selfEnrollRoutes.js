const express = require("express");
const {
	selfEnroll,
    allSelfEnroll,
    updatePrint,
    getSelfEnroll,
    editSelfEnroll
} = require("../controllers/selfEnrollController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/allSelfEnroll", auth, allSelfEnroll);

router.post("/newSelfEnroll",auth, selfEnroll);

router.put("/updatePrint",auth, updatePrint);

router.get("/getSelfEnroll", auth, getSelfEnroll);

router.put("/editSelfEnroll", auth, editSelfEnroll);

module.exports = router;
