const express = require("express");

const {
  createApply,
  confirmApply,
  refuseApplyStd,
  refuseApplyEmp,
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
router.put("/refuseApplyStd/:id", auth, refuseApplyStd);
router.put("/refuseApplyEmp/:id", auth, refuseApplyEmp);
router.delete("/refuseConfirm/:id", auth, refuseConfirm);

module.exports = router;
