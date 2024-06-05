const express = require('express');
const {listConfirm,getGenDoc,getGenDocSelf} = require("../controllers/manageGenDocumentController")
const {auth} = require("../middleware/auth")
const {preCreateCourtesyOld,preCreateCourtesy,preCreateLetter,editPreCreateCourtesyOld,editPreCreateCourtesy,
    editPreCreateLetter,createCourtesy,setup_courtesy,editCourtesyOld,editCourtesy, editLetter, showEditCourtasy,
    showAllEditCourtasy,createMultiCourtesy,genPdfSelfCourtesy,genPdfSelfLetter,createMultiCourtesySelf} = require("../controllers/generatePdfController")

const router = express.Router();


router.post("/genPdfSelfCourtesy",genPdfSelfCourtesy)
router.put("/genPdfSelfLetter",genPdfSelfLetter)

router.post("/genMultiCourtesy",createMultiCourtesy)
router.post("/genMultiCourtesySelf",createMultiCourtesySelf)

router.post("/preCreateCourtesyOld",preCreateCourtesyOld)
router.post("/preCreateCourtesy",preCreateCourtesy)
router.put("/preCreateLetter",preCreateLetter)

router.put("/editPreCreateCourtesyOld",editPreCreateCourtesyOld)
router.put("/editPreCreateCourtesy",editPreCreateCourtesy)
router.put("/editPreCreateLetter",editPreCreateLetter)

router.get("/manageDocument",auth,listConfirm);

router.get("/getGenDoc/:id/:year",getGenDoc)
router.get("/getGenDocSelf/:id/:year",getGenDocSelf)
router.post("/genPdf",createCourtesy)

router.post("/setupCourtesy",setup_courtesy)
router.put("/editCourtesyOld",editCourtesyOld)
router.put("/editCourtesy",editCourtesy)
router.put("/editLetter",editLetter)

router.get("/showEditCourtesy/:id/:year",showEditCourtasy)
router.get("/showAllEditCourtesy",showAllEditCourtasy)
module.exports = router;