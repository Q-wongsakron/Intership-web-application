const express = require("express");
const {
  getPosts,
  addPost,
  getPost,
  editPost,
  deletePost,
} = require("../controllers/postWorkController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.get("/listPosts", getPosts);
router.post("/addPost", auth, addPost);
router.put("/editPost/:id", auth, editPost);
router.get("/post/:id", getPost);

router.put("/deletePost/:id", auth, deletePost);

module.exports = router;
