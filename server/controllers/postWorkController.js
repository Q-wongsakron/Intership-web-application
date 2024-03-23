const db = require("../db/index");
const { posts_job, employer } = db;
const { Op } = require("sequelize");
db.sequelize.sync();
// import { db } from "../db.js";
const moment = require("moment");


exports.getPosts = async (req, res) => {
  try {
    let ts = Date.now();

    let currentDate = new Date(ts);

    //console.log("current Date is : ",year + " - " + month + " - " + date)
    const post = await posts_job.findAll({
      include: [
        { model: employer, attributes: ["company_pic", "company_name"] },
      ],
    });

    const sitllPosts = await posts_job.findAll({
      include: [
        { model: employer, attributes: ["company_pic", "company_name"] },
      ],
      where: {
        dateEndPost: {
          [Op.gte]: currentDate // Exclude posts where the end date is less than or equal to the current date
        }
      }
    });


    console.log(sitllPosts);

    return res.status(200).json(sitllPosts);
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
    const employer_id = req.user.id;
    const permitsion  = await employer.findOne({ where: { employer_id : employer_id}})
    if (permitsion.status == "verified") {
      // console.log(req.user.id);
      const {
        job_title,
        location,
        district,
        subdistrict,
        province,
        pcode,
        contact_tel,
        contact_email,
        position_num,
        work_hours,
        salary,
        welfare,
        qualifications,
        desc,
        other,
        cats,
        name_to,
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
        pcode,
        contact_tel,
        contact_email,
        position_num,
        work_hours,
        salary,
        welfare,
        qualifications,
        other,
        desc,
        cat: JSON.stringify(categories), // Convert categories to JSON
        name_to,
        dateStartPost,
        dateEndPost,
      });

      return res.status(200).json({ message: "โพสต์ถูกสร้างสำเร็จ", post });
    } else {
      return res
      .status(400)
      .json({ message: "คุณไม่มีสิทธิ์ในการสร้างประกาศ กรุณาติดต่อภาควิชา" });
    }


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
