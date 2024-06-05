const express = require("express");

const { myApply,studentMornitor,listDocumentStd, 
    studentAllFile,listStudent,resetStudent } = require("../controllers/manageStatusStudentController");

const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/myStatus", auth, myApply);
router.get("/studentMornitor", studentMornitor);
router.get("/listDocumentStd", listDocumentStd);
router.get("/studentAllFile", studentAllFile);
router.get("/listStudent", listStudent);

router.put("/resetStudent", resetStudent)


module.exports = router;
