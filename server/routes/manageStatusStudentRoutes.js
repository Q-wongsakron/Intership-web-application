const express = require("express");

const { myApply,studentMornitor } = require("../controllers/manageStatusStudentController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/myStatus", auth, myApply);
router.get("/studentMornitor", studentMornitor);

module.exports = router;
