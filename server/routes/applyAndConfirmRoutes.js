const express = require("express");

const {
  createApply,
  confirmApply,
  refuseApply,
  refuseConfirm,
  getApply,
  getConfirm,
} = require("../controllers/applyAndConfirmController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/allApply", auth, getApply);
router.get("/allConfirm", auth, getConfirm);

router.post("/createApply", auth, createApply);
router.post("/createConfirm", auth, confirmApply);
router.delete("/refuseApply/:id", auth, refuseApply);
router.delete("/refuseConfirm/:id", auth, refuseConfirm);

module.exports = router;
