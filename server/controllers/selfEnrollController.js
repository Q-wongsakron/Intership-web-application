const db = require("../db/index");
const { student, self_enroll,document } = db;
const {findYear} = require("./authController")
db.sequelize.sync();


exports.selfEnroll = async (req, res) => {
  try {
    const semesterYear = await findYear(req,res); // or it use find std year?
    console.log(req.body.formData)
    const { displayname_th,company_name,company_address,to_who,tel,email} = req.body.formData
    const {require_doc} =  req.body.require_doc
    const std_id = req.user.username;

    // student data
    const studentData = await student.findOne({
      where: { std_id: req.user.username },
    });
    if (studentData.status === "0") {
      // create self enroll
      const newSelfEnroll = await self_enroll.create({
          displayname_th,
          std_id,
          company_name,
          company_address,
          to_who,
          tel,
          email,
          require_doc,
          academic_year: semesterYear
      })
      const updateStatusStd = await student.update(
        {
            status: "2",
          },
          {
            where: { std_id: std_id },
          }
      )
      const haveDoc = await document.findOne({
        where: {std_id: std_id}
      })

      if (!haveDoc){
        const initDoc = await document.create({
          std_id : std_id,
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
      res.status(200).json({message: "ยื่นข้อมูลที่ฝึกงานเองสำเร็จ"});
    }else{
      res.status(400).json({message: "ยื่นข้อมูลที่ฝึกงานเองไม่สำเร็จ คุณสมัครฝึกงานแล้วกรุณาติดต่อภาควิชา"});
    }
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }

};

exports.getSelfEnroll = async (req, res) => {
  try{
    const getSelfEnroll = await self_enroll.findOne({where: {std_id : req.user.username}})
    res.status(200).send(getSelfEnroll)
  }catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

exports.editSelfEnroll = async (req, res) => {
  try {
    const semesterYear = await findYear(req,res); // or it use find std year?
    //console.log(req.body.formData)
    const { displayname_th,company_name,company_address,to_who,tel,email} = req.body.formData
    const {require_doc} =  req.body.require_doc
    const std_id = req.user.username;

    // student data
    const studentData = await student.findOne({
      where: { std_id: req.user.username },
    });
    if (studentData.status === "2") {
      // create self enroll
      const editSelfEnroll = await self_enroll.update({
          displayname_th,
          std_id,
          company_name,
          company_address,
          to_who,
          tel,
          email,
          require_doc,
          academic_year: semesterYear
      }, {where: { std_id: req.user.username }},)

      res.status(200).json({message: "แก้ไชข้อมูลที่ฝึกงานเองสำเร็จ"});
    }else{
      res.status(400).json({message: "แก้ไขข้อมูลที่ฝึกงานเองไม่สำเร็จ ภาควิชาออกเอกสารแล้วกรุณาติดต่อภาควิชา"});
    }
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

exports.allSelfEnroll = async (req, res) => {
    try {
      const semesterYear = await findYear(req,res);
      let whereClause;
      if(req.user.role === "student"){
        whereClause = {std_id: req.user.username, academic_year: semesterYear}
      }else{
        whereClause = {academic_year: semesterYear}
      }
      // all data self enroll all year
      const allSelfEnroll = await self_enroll.findAll({
        where: whereClause,
        include: { model: student }
      });
 
      res.status(200).send(allSelfEnroll);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
    
  };

exports.updatePrint = async (req, res) => {
  try{
    const {print, selfEnrollId} =req.body;
    console.log(req.body);
    const updatePrint = await self_enroll.update({
      print: print
    },{where : {
      self_enroll_id: selfEnrollId
  }})
  }catch(err){
    console.error(err);
    res.status(500).send(err.message);
  }
}

