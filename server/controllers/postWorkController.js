const db = require("../db/index");
const { posts_job } = db;
db.sequelize.sync();
// import { db } from "../db.js";
const moment = require("moment");

exports.getPosts = async (req, res) => {
  try {
    const post = await posts_job.findAll();
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await posts_job.findOne({
      where: { job_id: req.params.id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.addPost = async (req, res) => {
  try {
    // console.log(req.user.id);
    const {
      job_title,
      location,
      skill,
      work_hours,
      salary,
      contract,
      qualifications,
      desc,
      cats,
      dateStartPost,
      dateEndPost,
    } = req.body;

    // cats is an array
    const categories = Array.isArray(cats) ? cats : [cats];

    const post = await posts_job.create({
      emp_id: req.user.id,
      job_title,
      location,
      skill,
      work_hours,
      salary,
      contract,
      qualifications,
      desc,
      cat: JSON.stringify(categories), // Convert categories to JSON
      dateStartPost,
      dateEndPost,
      date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    });

    return res.status(201).json({ message: "Post has been created.", post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
