const express = require("express");
const { listAllUser, changeRole } = require("../controllers/roleManage");
const { auth, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.get("/listAllUser", auth, adminCheck, listAllUser);
router.post("/changeRole", auth, adminCheck, changeRole);

module.exports = router;
