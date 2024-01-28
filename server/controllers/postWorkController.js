const db = require("../db/index");
const { posts_job, employer } = db;
db.sequelize.sync();
// import { db } from "../db.js";
const moment = require("moment");

exports.getPosts = async (req, res) => {
  try {
    const post = await posts_job.findAll({
      include: [{ model: employer, attributes: ["company_pic"] }],
    });

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
    const profile = await employer.findOne({
      where: { employer_id: post.emp_id },
      attributes: { exclude: ["username", "password"] },
    });
    const posts = await posts_job.findAll({
      where: {
        emp_id: post.emp_id,
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const payload = { post: post, posts: posts, profile: profile };
    return res.status(200).json(payload);
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
      district,
      subdistrict,
      province,
      country,
      pcode,
      contact_tel,
      contact_email,
      position_num,
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
      district,
      subdistrict,
      province,
      country,
      pcode,
      contact_tel,
      contact_email,
      position_num,
      work_hours,
      salary,
      contract,
      qualifications,
      desc,
      cat: JSON.stringify(categories), // Convert categories to JSON
      dateStartPost,
      dateEndPost,
    });

    return res.status(200).json({ message: "Post has been created.", post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
