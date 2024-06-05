const db = require("../db/index");
const nodemailer = require('nodemailer');
const { student, employer, posts_job, apply, confirm, studentCsv,document
  ,edit_courtesy,gen_document,employee_tu } = db;

db.sequelize.sync();
const {findYear} = require("./authController");

require('dotenv').config()

//for new apply
exports.createApply = async (req, res) => {
  try {
    const { job_id, position } = req.body;
    const semesterYear = await findYear(req,res);
   
    // ดึงข้อมูล student
    const studentData = await student.findOne({
      where: { std_id: req.user.username },
    });
    // ดึงข้อูล csv
    const canApply = await studentCsv.findOne({
      where: { username: req.user.username }
    })
    if (canApply){
      if (studentData.status === "0") {
        // ดึงข้อมูล job
        const posts_data = await posts_job.findOne({
          where: { job_id: job_id },
        });
        console.log(posts_data);

        let countValuesObject = JSON.parse(posts_data.count_values)
        console.log(countValuesObject[0]);
        const countPosition = countValuesObject[position]
        // เช็คจำนวนตำแหน่งสมัครที่เหลือ ไม่เท่ากับ 0 
        if (countPosition != 0) {
          // สร้าง apply
          const createApply = await apply.create({
            std_id: req.user.username,
            employer_id: posts_data.emp_id,
            job_id: posts_data.job_id,
            position: position,
            academic_year: semesterYear
          });
          // update student
          const updateStatus = await student.update(
            {
              status: "1",
            },
            {
              where: { std_id: req.user.username },
            }
          );
          res
            .status(200)
            .json({ message: "สมัครฝึกงานสำเร็จ กรุณารอการตอบรับทาง อีเมล" });
        }else{
          res.status(400).json({
            message: "ตำแหน่งฝึกงานนี้เต็มแล้ว",
          });
        }
      } else if (studentData.status === "1") {
        res.status(400).json({
          message: "สมัครฝึกงานไม่สำเร็จ คุณเคยสมัครฝึกงานแล้ว กรุณารอการตอบรับ",
        });
      } else {
        res
          .status(400)
          .json({ message: "สมัครฝึกงานไม่สำเร็จ คุณเคยสมัครฝึกงานแล้ว กรุณาติดต่อภาควิชา" });
      }

    }else {
      res
        .status(400)
        .json({ message: "คุณไม่มีสิทธิ์ในการสมัครฝึกงาน กรุณาติดต่อภาควิชา" });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

// for confirm apply
exports.confirmApply = async (req, res) => {
  try {
    const { apply_id, require_doc } = req.body;
    const semesterYear = await findYear();

    // see apply data
    const applyDetails = await apply.findOne({ where: { apply_id: apply_id }, include:{model: posts_job } });
    console.log(applyDetails)
    // see student data
    const stdData = await student.findOne({ where : { std_id: applyDetails.std_id}})

    const secretaryTuData = await employee_tu.findOne({where: { role: 'secretary'}});
    

    
    if (applyDetails) {
      // create confirm
      const applyConfirm = await confirm.create({
        std_id: applyDetails.std_id,
        employer_id: applyDetails.employer_id,
        job_id: applyDetails.job_id,
        position: applyDetails.position,
        require_doc: require_doc,
        academic_year: semesterYear
      });
      
      // update count value position 
      // string to json
      let countValuesObject = JSON.parse(applyDetails.posts_job.count_values);
      const valuePosition = countValuesObject[applyDetails.position] - 1
      countValuesObject[applyDetails.position] = valuePosition
      console.log(countValuesObject)
      const updatePositionValue = await posts_job.update({
        count_values : countValuesObject
      },{where: { job_id: applyDetails.posts_job.job_id}})

      // refues all student apply this position if posittion Count = 0
      // รีเซตนักศึกษาทุกคนตำแหน่งนี้และจ็อปไอดีนี้
      if(countValuesObject[applyDetails.position] == 0){

        const findStudent = await apply.findAll({
          where: {
            position: applyDetails.position,
            job_id: applyDetails.posts_job.job_id
          }
        });
        for( let i = 0; i < findStudent.length; i++ ){
          if(findStudent[i] != applyDetails.std_id) {
            const updateStatus = await student.update(
              {
                status: "0",
              },
              {
                where: { std_id: findStudent[i].std_id },
              }
            );
          }

        }
        const refuesAllStudent = await apply.update({
          status: "ไม่ผ่าน"
        },{ where: {
          position: applyDetails.position,
          job_id: applyDetails.posts_job.job_id
        }})
        
      }

      // send mail
      await sendConfirmationEmail(stdData.email, applyDetails.posts_job.job_title, applyDetails.position );
      await sendRequestDocSecretaryEmail(applyDetails.std_id,secretaryTuData.email, stdData.name_title_th, stdData.displayname_th, applyDetails.posts_job.job_title, applyDetails.position )
      // create initial document
      const haveDoc = await document.findOne({
        where: {std_id: applyDetails.std_id}
      })
      if (!haveDoc){
        const initDoc = await document.create({
          std_id :applyDetails.std_id,
          report_pdf : null,
          report_docx : null,
          timestamp_pdf : null,
          present_pdf : null,
          present_ppt : null,
          date_upload_report_pdf : null,
          date_upload_report_docx: null,
          date_upload_timestamp_pdf: null,
          date_upload_present_pdf: null,
          date_upload_present_ppt: null,
          academic_year : semesterYear
        })
      }
      // update student
      const updateStatus = await student.update(
        {
          status: "2",
        },
        {
          where: { std_id: applyDetails.std_id },
        }
      );
      // update apply
      const deleteApply = await apply.update({
        status: "ผ่าน"
      },{
        where: { apply_id: apply_id },
      });

      res.status(200).json({ message: "ยืนยันการรับสมัคร สำเร็จ" });
    } else {
      res.status(402).json({ message: "ไม่พบข้อมูล" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};
// Function to send confirmation email
async function sendConfirmationEmail(email,job_title ,position) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.SMTP_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: email,
    subject: 'Job Application Confirmation',
    text: `ยินดีด้วย คุณได้รับการตอบรับการเข้าฝึกงาน ${job_title} ตำแหน่ง ${position} `,
  };
  //เอาไปเรียกใช้ข้างนอกเข้ามา   เพิ่มกระบวนการว่าต้องทำอะไรต่อ นักศึกษา(รอหัวหน้าภาคอนุมัติ ปมน)

  await transporter.sendMail(mailOptions);
}

async function sendRequestDocSecretaryEmail(std_id,secretaryTuData_email, name_title_th, displayname_th ,job_title ,position) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.SMTP_PASS, 
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: secretaryTuData_email,
    subject: 'Request Setup Documentation',
    text: `ขอความกรุณาตั้งค่าเอกสารให้กับ นักศึกษา เลขประจำตัว ${std_id} ชื่อ ${name_title_th}${displayname_th}  จากโพสต์ฝึกงาน ${job_title} ตำแหน่ง ${position} `,
  };
  //เอาไปเรียกใช้ข้างนอกเข้ามา   เพิ่มกระบวนการว่าต้องทำอะไรต่อ นักศึกษา(รอหัวหน้าภาคอนุมัติ ปมน)

  await transporter.sendMail(mailOptions);
}

// for cancle apply student
exports.refuseApplyStd = async (req, res) => {
  try {
    // apply id
    const { id } = req.params;
    const applyDetails = await apply.findOne({
      where: { apply_id: id },
    });
    // update apply
    const refuseApply = await apply.update({
      status: "นักศึกษายกเลิก"
    },{
      where: { apply_id: id },
    });

    const updateStatus = await student.update(
      {
        status: "0",
      },
      {
        where: { std_id: applyDetails.std_id },
      }
    );
    res.status(200).json({ message: "success refuse" });
  } catch (err) {
    console.error(err);
    req.status(500).json({ message: "server error" });
  }
};

// for cancle apply Employer
exports.refuseApplyEmp = async (req, res) => {
  try {
    // apply id
    const { id } = req.params;
    const applyDetails = await apply.findOne({
      where: { apply_id: id },
    });
    // update apply
    const refuseApply = await apply.update({
      status: "ไม่ผ่าน"
    },{
      where: { apply_id: id },
    });

    const updateStatus = await student.update(
      {
        status: "0",
      },
      {
        where: { std_id: applyDetails.std_id },
      }
    );
    res.status(200).json({ message: "success refuse" });
  } catch (err) {
    console.error(err);
    req.status(500).json({ message: "server error" });
  }
};

// for cancle confirm ไม่ใช้
exports.refuseConfirm = async (req, res) => {
  try {
    // id confirm
    const { id } = req.params;
    const confirmDetails = await confirm.findOne({
      where: { confirm_id: id },
    });
    // delete edit courtesy
    await edit_courtesy.destroy({
      where: { std_id: confirmDetails.std_id },
    })
    // delete gen doc
    await gen_document.destroy({
      where: { std_id: confirmDetails.std_id },
    })

    const updateStatus = await student.update(
      {
        status: "0",
      },
      {
        where: { std_id: confirmDetails.std_id },
      }
    );
    // delete confirm
    const delConfirm = await confirm.destroy({
      where: { confirm_id: id },
    });
    res.status(200).json({ message: "success refuse" });
  } catch (err) {
    console.error(err);
    req.status(500).json({ message: "server error" });
  }
};

exports.getApply = async (req, res) => {
  try {
    const semesterYear = await findYear();
    // show all apply ต้องแสดงแค่ปีนั้นไหม? only in semesterYear
    const listApply = await apply.findAll({
      where: { employer_id: req.user.id, academic_year : semesterYear },
      include: [{ model: student }, { model: posts_job }],
    });
    res.send(listApply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};

exports.getConfirm = async (req, res) => {
  try {
    const semesterYear = await findYear();
    let whereClause;

    if (req.user.role === "employer") {
      whereClause = { employer_id: req.user.id,academic_year : semesterYear};
    } else {
      whereClause = { std_id: req.user.username, academic_year : semesterYear};
    }
    // show all confirm only in semesterYear
    const listConfirm = await confirm.findAll({
      where: whereClause,
      include: [
        { model: student },
        { model: posts_job },
        {
          model: employer,
          attributes: {
            exclude: ["username", "password"],
          },
        },
      ],
    });

    res.send(listConfirm);
  } catch (err) {
    console.error("Error in getConfirm:", err);
    res.status(500).json({ message: "server error" });
  }
};
