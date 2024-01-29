const express = require("express");

const { createApply } = require("../controllers/applyController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/createApply", auth, createApply);

module.exports = router;
