const db = require("../db/index");
const { student, self_enroll } = db;
db.sequelize.sync();

exports.selfEnroll = async (req, res) => {
  try {
    console.log(req.body.formData)
    const { displayname_th,company_name,company_address,to_who,tel,email} = req.body.formData
    const {require_doc} =  req.body.require_doc
    const std_id = req.user.username;

    const studentData = await student.findOne({
      where: { std_id: req.user.username },
    });
    if (studentData.status === "0") {
      const newSelfEnroll = await self_enroll.create({
          displayname_th,
          std_id,
          company_name,
          company_address,
          to_who,
          tel,
          email,
          require_doc
      })
      const updateStatusStd = await student.update(
        {
            status: "2",
          },
          {
            where: { std_id: std_id },
          }
      )
      res.status(200).json({message: "ยื่นข้อมูลที่ฝึกงานเองสำเร็จ"});
    }else{
      res.status(400).json({message: "ยื่นข้อมูลที่ฝึกงานเองไม่สำเร็จ คุณสมัครฝึกงานเเล้วกรุณาติดต่อภาควิชา"});
    }
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }

};

exports.allSelfEnroll = async (req, res) => {
    try {
      
      const allSelfEnroll = await self_enroll.findAll()
     
      res.status(200).send(allSelfEnroll);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
    
  };

