const db = require("../db/index");
const { student, employer, posts_job, 
  apply,confirm, studentCsv , self_enroll,document ,
  edit_courtesy, emp_eval, gen_document, gen_document_self,
  std_eval

}  = db;
const { Op } = require('sequelize');
const {findYear} = require("./authController")

db.sequelize.sync();


exports.myApply = async (req, res) => {
  try {
    const myApply = await apply.findOne({
      order: [['apply_id', 'DESC']],
      where: { std_id: req.user.username },
      include: [
        { model: posts_job },
        {
          model: employer,
          attributes: {
            exclude: ["username", "password"],
          },
        },
        { model: student },
      ],
    });

    res.status(200).json(myApply);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.studentMornitor = async (req, res) => {
  try {
    const semesterYear = await findYear();
    console.log("Year is", semesterYear);
    const studentCsvData = await studentCsv.findAll();
    const usernames = studentCsvData.map(student => student.dataValues.username);

    const stdDataModels = [];
    const stdAllData = [];

    const findStatusStd = await student.findAll();
    
    const mappedData = findStatusStd.map(item => ({
      std_id: item.std_id,
      status: item.status
    }));
  
    stdDataModels.push(...mappedData);
    console.log(stdDataModels);
    
    for(let i = 0 ; i < stdDataModels.length; i++){
      if(stdDataModels[i].status === '0'){
        const stdData1 = await student.findOne({where: {std_id: stdDataModels[i].std_id}})
        if (stdData1) stdAllData.push(stdData1.dataValues);
      }
      else if(stdDataModels[i].status === '1'){
        const stdData2 = await student.findOne({
          where: { std_id: stdDataModels[i].std_id },
          include: [{
              model: apply,
              where: { status: "รอการตอบรับ" , academic_year: semesterYear},
              include: [{ model: employer }] 
          }]
      });
        if (stdData2) stdAllData.push(stdData2.dataValues);
      }
      else if(stdDataModels[i].status === '2' || stdDataModels[i].status === '3' || stdDataModels[i].status === '4'){
          const confirmData = await confirm.findOne({where: { std_id: stdDataModels[i].std_id }});
          if (confirmData){
              const stdData3 = await student.findOne({
                where: { std_id: stdDataModels[i].std_id },
                include: [{
                    model: confirm,
                    where: { academic_year: semesterYear },
                    include: [{ model: employer }]
                }]
            })
            if (stdData3) stdAllData.push(stdData3.dataValues);
          }
          else{
            const stdData3 = await student.findOne({
              where: { std_id: stdDataModels[i].std_id },
              include: [{
                  model: self_enroll,
                  where: { academic_year: semesterYear },
              }]
            })
            if (stdData3) stdAllData.push(stdData3.dataValues);
          }
        }  
    }

    const filteredStudentStatus = stdAllData.filter(student => usernames.includes(student.std_id));

    res.status(200).json(filteredStudentStatus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};


exports.studentAllFile = async (req, res) => {
  try {

    const studentStatus = await student.findAll({
      include: [
        { model: apply, include: [{ model: employer }] },
        { model: confirm, include: [{ model: employer }] },
        { model: self_enroll }
      ],
      where: {
        [Op.or]: [
          { '$apply.status$' : "ผ่าน" },
          { '$self_enroll.status$' : "ดำเนินเอกสารเสร็จสิ้น" },
        ]
      }
    });
    res.status(200).json(studentStatus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.listDocumentStd = async(req, res) => {
  try{
    const listDocumentStd = await document.findAll(
    )
    res.status(200).json(listDocumentStd)
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

exports.listStudent = async(req, res) => {
  try{
    const stdData = await student.findAll()
    res.status(200).json(stdData)
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}

exports.resetStudent = async(req, res) => {
  try{
    const semesterYear = await findYear();
    const {std_id} = req.body;

    const studentStatus = await student.update(
      { 
        status: "0" ,
        std_eval : 0,
        emp_eval : "รอบริษัทประเมิน"
      },
      {where : {std_id : std_id}}
    )

    const resetApply = await apply.update(
      {
        status: "รีเซ็ต"
    }, 
    {
      where : {std_id : std_id, 
      academic_year : semesterYear}
    }
    )

    const deleteConfirm = await confirm.destroy({
      where : {std_id : std_id, 
      academic_year : semesterYear}
    })

    const deleteDocument = await document.destroy(
      {where : {std_id : std_id,
        academic_year : semesterYear}
      }
    )

    const deleteEditDoc = await edit_courtesy.destroy({where: {
      std_id : std_id,
      academic_year : semesterYear
    }})

    const deleteEmpEval = await emp_eval.destroy({
      where : {std_id : std_id,
        academic_year : semesterYear
      }
    })

    const deleteGenDoc = await gen_document.destroy({where: {
      std_id : std_id,
      academic_year : semesterYear
    }})

    const deleteGenDocSelf = await gen_document_self.destroy({where: {
      std_id : std_id,
      academic_year : semesterYear
    }})

    const deleteSelfEnroll = await self_enroll.destroy({where: {
      std_id : std_id,
      academic_year : semesterYear
    }})

    const deleteStdEval = await std_eval.destroy({where: {
      std_id : std_id,
      academic_year : semesterYear
    }})

    res.status(200).json({message : "reset student status successfully"})

  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}