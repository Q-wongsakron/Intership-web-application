const express = require('express')
const {
    createNews,
    uploadCoverImg,
    uploadImages,
    allNews,
    oneNews
} = require("../controllers/newsController")


const { auth } = require("../middleware/auth")
const upload = require("../middleware/multerStorage");

const router = express.Router()

router.post("/createNews", auth, createNews)
router.get("/allNews", allNews)
router.get("/oneNews/:id", oneNews)
// router.put("/uploadCover", auth, uploadCoverImg)
router.put("/uploadCover",auth, upload.single("coverImg"), uploadCoverImg);
router.put("/uploadImages", auth, upload.array("images"),uploadImages);

module.exports = router