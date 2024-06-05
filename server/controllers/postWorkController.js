const db = require("../db/index");
const { posts_job, employer, confirm,apply } = db;
const { Op } = require("sequelize");
db.sequelize.sync();
// import { db } from "../db.js";
const moment = require("moment");


exports.getPosts = async (req, res) => {
  try {
    let ts = Date.now();

    let currentDate = new Date(ts);

    //console.log("current Date is : ",year + " - " + month + " - " + date)
    //ไม่ได้ใช้
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
        },
        status: "active"
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
      attributes: { exclude: ["password"] },
    });
    const posts = await posts_job.findAll({
      where: {
        emp_id: post.emp_id,
        status: "active"
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
        work_hours,
        salary,
        welfare,
        qualifications,
        desc,
        other,
        cats,
        categoryValues,
        name_to,
        dateStartPost,
        dateEndPost,
      } = req.body;
     
      // cats is an array
      const categories = Array.isArray(cats) ? cats : [cats];
      const categories_values = Array.isArray(categoryValues) ? categoryValues : [categoryValues]
      console.log(categoryValues)
      console.log(categories_values)
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
        work_hours,
        salary,
        welfare,
        qualifications,
        other,
        desc,
        cat: JSON.stringify(categories), // Convert categories to JSON
        cat_values: categoryValues,
        count_values: categoryValues,
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


exports.editPost = async (req, res) => {
  try {
    const employer_id = req.user.id;
    const { id } = req.params;
    const permitsion  = await employer.findOne({ where: { employer_id : employer_id}})

    const existingConfirmation = await confirm.findOne({ where: { job_id: id } });
    const existingApply = await apply.findOne({ where: { job_id: id , status: "รอการตอบรับ"} });

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
        work_hours,
        salary,
        welfare,
        qualifications,
        desc,
        other,
        cats,
        categoryValues,
        name_to,
        dateStartPost,
        dateEndPost,
      } = req.body;
     
      // cats is an array
      const categories = Array.isArray(cats) ? cats : [cats];
      const categories_values = Array.isArray(categoryValues) ? categoryValues : [categoryValues]
      console.log(categoryValues)
      console.log(categories_values)

      if (existingConfirmation) {
        return res.status(400).json({ message: "ไม่สามารถลบโพสต์ได้เนื่องจากโพสต์นี้มีการรับนักศึกษาฝึกงานแล้ว" });
      } 
      else if (existingApply){
        return res.status(400).json({ message: "ไม่สามารถลบโพสต์ได้เนื่องจากโพสต์นี้มีนักศึกษารอการตอบรับอยู่" });
      }
      else{
        const post = await posts_job.update({
          emp_id: req.user.id,
          job_title,
          location,
          district,
          subdistrict,
          province,
          pcode,
          contact_tel,
          contact_email,
          work_hours,
          salary,
          welfare,
          qualifications,
          other,
          desc,
          cat: JSON.stringify(categories), // Convert categories to JSON
          cat_values: categoryValues,
          count_values: categoryValues,
          name_to,
          dateStartPost,
          dateEndPost,
        },{where: {job_id : id}});
  
        return res.status(200).json({ message: "แก้ไขโพสต์สำเร็จ", post });
      }

    } else {
      return res
      .status(400)
      .json({ message: "คุณไม่มีสิทธิ์ในการแก้ไขประกาศ กรุณาติดต่อภาควิชา" });
    }


  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingConfirmation = await confirm.findOne({ where: { job_id: id } });
    const existingApply = await apply.findOne({ where: { job_id: id , status: "รอการตอบรับ"} });
    
    if (existingConfirmation) {
      return res.status(400).json({ message: "ไม่สามารถลบโพสต์ได้เนื่องจากโพสต์นี้มีการรับนักศึกษาฝึกงานแล้ว" });
    } 
    else if (existingApply){
      return res.status(400).json({ message: "ไม่สามารถลบโพสต์ได้เนื่องจากโพสต์นี้มีนักศึกษารอการตอบรับอยู่" });
    }
    else {
      const deletedPost = await posts_job.update(
         {status : "notActive"} 
        ,{ where: { job_id: id } });

      if (deletedPost) {
        const applyStd = await apply.findAll({ where: { job_id: id } });

        const updateStatus = await apply.update({ status: "บริษัทยกเลิกรับสมัคร" }, { where: { job_id: id } });
  
        for (let i = 0; i < applyStd.length; i++) {
          await student.update({ status: 0 }, { where: { std_id: applyStd[i].std_id } });
        }

        return res.status(200).json({ message: `ลบโพสต์สำเร็จ` });
      } else {
        return res.status(404).json({ message: "ไม่พบโพสต์" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "มีข้อผิดพลาดเกิดขึ้น" });
  }
}