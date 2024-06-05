const express = require("express");
const {
	createStdEval,
    listStdEval,
    listEmpEval,
    listEmpQuesEval,
    emQuestionnair,
    emCreateEval,
    
} = require("../controllers/evalController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/listStdEval", listStdEval);
router.get("/listEmpEval", listEmpEval);
router.get("/listEmpQuesEval", listEmpQuesEval);

router.post("/createStdEval",auth, createStdEval);

router.post("/emQuestionnair", emQuestionnair);

router.post("/emCreateEval", emCreateEval);

module.exports = router;
