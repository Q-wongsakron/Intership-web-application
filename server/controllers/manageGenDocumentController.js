const db = require("../db/index");
const { student, employer, posts_job, confirm, gen_document, gen_document_self} = db;
const {findYear} = require("./authController")
db.sequelize.sync();



exports.listConfirm = async (req, res) => {
  try {
    const semesterYear = await findYear(req,res);
    const listConfirm = await confirm.findAll({
      include: [{ model: student }, { model: posts_job },{model: employer  ,attributes: {
        exclude: ["username", "password"],
      }
    }], where: {academic_year: semesterYear}
    }
    );
    res.send(listConfirm)
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// for see pdf gen doc only in semester
exports.getGenDoc = async (req, res) => {
  try{
   
    const {id, year} = req.params;
    console.log(req.params);
    const dataGenDoc = await gen_document.findOne({
      where: {std_id: id, academic_year : year}
    })
    res.send(dataGenDoc)
  }catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

// for see pdf gen doc self
exports.getGenDocSelf = async(req, res) => {
  try{
    const {id,year} = req.params;
    console.log(id)
    const dataGenDocSelf = await gen_document_self.findOne({
      where: {std_id: id, academic_year : year}
    })
    res.send(dataGenDocSelf)
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
}


exports.createDocument = async (req, res) => {
  try {
    const { confirm_id } = req.body.data;


  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
  // ส่งเมลบอกเรื่องเอกสารอนุมัติแล้วให้บริษัท
};
