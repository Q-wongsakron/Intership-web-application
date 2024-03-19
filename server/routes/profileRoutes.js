const express = require("express");
const { auth } = require("../middleware/auth");
const upload = require("../middleware/multerStorage");
const {
	getProfileStudent,
	getProfileEmployer,
	updateProfileStudent,
	updateProfileEmployer,
	getProfileEmployerId,
	getProfileStudentPublic

} = require("../controllers/profileController");


const router = express.Router();

router.get("/profileStudent", auth, getProfileStudent);
router.get("/profileStudent/:id", getProfileStudentPublic);
router.put(
	"/updateProfileStudent",
	auth,
	upload.single("file_resume"),
	updateProfileStudent
);

router.get("/profileEmployer", auth, getProfileEmployer);
router.put("/updateProfileEmployer", auth, updateProfileEmployer);
router.get("/profileEmployerId/:id", getProfileEmployerId);

// router.post("/uploadFileSlide", upload.single("file_slide"), uploadFileSlide);
module.exports = router;
