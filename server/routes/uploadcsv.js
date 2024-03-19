const express = require("express");
const upload = require("../middleware/multerStorage");
const {
  uploadcsv,
  uploadFileResume,
  uploadPresentPdf,
  uploadPresentPpt,
  uploadReportPdf,
  uploadReportDocx,
  uploadTimestampPdf,
  setup_courtesy_sig_img,
} = require("../controllers/uploadFileController");
const { auth, adminCheck } = require("../middleware/auth");
const router = express.Router();

router.put("/uploadSignatureImg",auth,upload.single("SignatureImg"), setup_courtesy_sig_img)

router.post("/uploadCsv", auth, adminCheck, uploadcsv);

router.put("/uploadFileResume",auth, upload.single("stdResumeFile"), uploadFileResume);
router.put("/uploadReportPdf",auth, upload.single("ReportPdfFile"), uploadReportPdf);
router.put("/uploadReportDocx",auth, upload.single("ReportDocxFile"), uploadReportDocx);
router.put("/uploadTimestampPdf",auth, upload.single("TimestampFile"), uploadTimestampPdf);
router.put("/uploadPresentPdf",auth, upload.single("PresentPdfFile"), uploadPresentPdf);
router.put("/uploadPresentPpt",auth, upload.single("PresentPptFile"), uploadPresentPpt);

module.exports = router;
