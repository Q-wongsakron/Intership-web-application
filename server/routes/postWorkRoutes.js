const express = require("express");
const {
  getPosts,
  addPost,
  getPost,
} = require("../controllers/postWorkController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/listPosts", getPosts);
router.post("/addPost", auth, addPost);
router.get("/post/:id", getPost);
module.exports = router;
