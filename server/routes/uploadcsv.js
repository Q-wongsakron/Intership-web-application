const express = require("express");
const { upload, resizeImage } = require("../middleware/multerStorage");
const {
  getFileCourtesy,
  getFileLetter,
  getFileReportPdf,
  getFileReportDocx,
  getFileTimesheet,
  getFilePresentationPdf,
  getFilePresentationPpt,

  uploadcsv,
  uploadFileResume,
  uploadPresentPdf,
  uploadPresentPpt,
  uploadReportPdf,
  uploadReportDocx,
  uploadTimestampPdf,
  setup_courtesy_sig_img,
  employerImg,
  getAllDocStudent,
  allCsvData
} = require("../controllers/uploadFileController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/getFileCourtesy/:id", getFileCourtesy)
router.get("/getFileLetter/:id", getFileLetter)
router.get("/getFileReportPdf/:id", getFileReportPdf)
router.get("/getFileReportDocx/:id", getFileReportDocx)
router.get("/getFileTimesheet/:id", getFileTimesheet)
router.get("/getFilePresentationPdf/:id", getFilePresentationPdf)
router.get("/getFilePresentationPpt/:id", getFilePresentationPpt)

router.get("/getAllDocStudent", getAllDocStudent)
router.get("/allCsvData", allCsvData)
router.put("/uploadSignatureImg",auth,upload.single("SignatureImg"),resizeImage, setup_courtesy_sig_img)
router.put("/uploadEmployerImg",auth,upload.single("EmployerImg"), employerImg)

router.post("/uploadCsv", auth, upload.single("csvFile"), uploadcsv);

router.put("/uploadFileResume",auth, upload.single("stdResumeFile"), uploadFileResume);
router.put("/uploadReportPdf",auth, upload.single("ReportPdfFile"), uploadReportPdf);
router.put("/uploadReportDocx",auth, upload.single("ReportDocxFile"), uploadReportDocx);
router.put("/uploadTimestampPdf",auth, upload.single("TimestampFile"), uploadTimestampPdf);
router.put("/uploadPresentPdf",auth, upload.single("PresentPdfFile"), uploadPresentPdf);
router.put("/uploadPresentPpt",auth, upload.single("PresentPptFile"), uploadPresentPpt);


module.exports = router;
