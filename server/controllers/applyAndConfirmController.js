const db = require("../db/index");
const nodemailer = require('nodemailer');
const { student, employer, posts_job, apply, confirm, studentCsv,document,edit_courtesy,gen_document } = db;
const { smtpPass } = require("../config");
db.sequelize.sync();

//for new apply
exports.createApply = async (req, res) => {
  try {
    const { job_id, position } = req.body;

   

    const studentData = await student.findOne({
      where: { std_id: req.user.username },
    });

    const canApply = await studentCsv.findOne({
      where: { username: req.user.username }
    })

    if (canApply){
      if (studentData.status === "0") {
        const posts_data = await posts_job.findOne({
          where: { job_id: job_id },
        });
        console.log(posts_data);
        const createApply = await apply.create({
          std_id: req.user.username,
          employer_id: posts_data.emp_id,
          job_id: posts_data.job_id,
          position: position,
        });
  
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
      } else if (studentData.status === "1") {
        res.status(400).json({
          message: "สมัครฝึกงานไม่สำเร็จ คุณเคยสมัครฝึกงานเเล้ว กรุณารอการตอบรับ",
        });
      } else {
        res
          .status(400)
          .json({ message: "สมัครฝึกงานไม่สำเร็จ คุณเคยสมัครฝึกงานเเล้ว กรุณาติดต่อภาควิชา" });
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

    
    const applyDetails = await apply.findOne({ where: { apply_id: apply_id }, include:{model: posts_job } });
    console.log(applyDetails)
    const stdData = await student.findOne({ where : { std_id: applyDetails.std_id}})
    if (applyDetails) {
      const applyConfirm = await confirm.create({
        std_id: applyDetails.std_id,
        employer_id: applyDetails.employer_id,
        job_id: applyDetails.job_id,
        position: applyDetails.position,
        require_doc: require_doc,
      });
      const updateStatus = await student.update(
        {
          status: "2",
        },
        {
          where: { std_id: applyDetails.std_id },
        }
      );
      const deleteApply = await apply.destroy({
        where: { apply_id: apply_id },
      });

      await sendConfirmationEmail(stdData.email, applyDetails.posts_job.job_title, applyDetails.position );

      const initDoc = await document.create({
        std_id :applyDetails.std_id,
        report_pdf : "",
        report_docx : "",
        timestamp_pdf : "",
        present_pdf : "",
        present_ppt : ""
      })
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
      user: 'wongsakronkongkamud@gmail.com',
      pass: smtpPass, 
    },
  });

  const mailOptions = {
    from: 'wongsakronkongkamud@gmail.com',
    to: email,
    subject: 'Job Application Confirmation',
    text: `ยินดีด้วย คุณได้รับการตอบรับการเข้าฝึกงาน ${job_title} ตำเเหน่ง ${position} `,
  };
  //เอาไปเรียกใช้ข้างนอกเข้ามา   เพิ่มกระบวนการว่าต้องทำอะไรต่อ นักศึกษา(รอหัวหน้าภาคอนุมัติ ปมน)

  await transporter.sendMail(mailOptions);
}

// for cancle apply
exports.refuseApply = async (req, res) => {
  try {
    const { id } = req.params;
    const applyDetails = await apply.findOne({
      where: { apply_id: id },
    });

    const refuseApply = await apply.destroy({
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

// for cancle confirm
exports.refuseConfirm = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmDetails = await confirm.findOne({
      where: { confirm_id: id },
    });

    await edit_courtesy.destroy({
      where: { std_id: confirmDetails.std_id },
    })

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

    const refuseConfirm = await confirm.destroy({
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
    const listApply = await apply.findAll({
      where: { employer_id: req.user.id },
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
    let whereClause;
    if (req.user.role === "employer") {
      whereClause = { employer_id: req.user.id };
    } else {
      whereClause = { std_id: req.user.username };
    }

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
