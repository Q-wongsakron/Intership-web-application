
const express = require("express");
const {
	createSchedule,
    listSchedule,
    editSchedule,

    
} = require("../controllers/scheduleController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/listSchedule", listSchedule);
router.post("/createSchedule", createSchedule);
router.put("/editSchedule", editSchedule);

module.exports = router;
