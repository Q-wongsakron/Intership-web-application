const express = require('express');
const {listConfirm,getGenDoc,getGenDocSelf} = require("../controllers/manageGenDocumentController")
const {auth} = require("../middleware/auth")
const {preCreateCourtesy,editPreCreateCourtesy,createCourtesy,setup_courtesy,editCourtesy, showEditCourtasy,
    showAllEditCourtasy,createMultiCourtesy,createCourtesySelf,createMultiCourtesySelf} = require("../controllers/generatePdfController")

const router = express.Router();


router.post("/genPdfSelf",createCourtesySelf)
router.post("/genMultiCourtesy",createMultiCourtesy)
router.post("/genMultiCourtesySelf",createMultiCourtesySelf)
router.post("/preCreateCourtesy",preCreateCourtesy)
router.put("/editPreCreateCourtesy",editPreCreateCourtesy)
router.get("/manageDocument",auth,listConfirm);
router.get("/getGenDoc/:id",getGenDoc)
router.get("/getGenDocSelf/:id",getGenDocSelf)
router.post("/genPdf",createCourtesy)
router.post("/setupCourtesy",setup_courtesy)
router.put("/editCourtesy",editCourtesy)
router.get("/showEditCourtesy/:id",showEditCourtasy)
router.get("/showAllEditCourtesy",showAllEditCourtasy)
module.exports = router;