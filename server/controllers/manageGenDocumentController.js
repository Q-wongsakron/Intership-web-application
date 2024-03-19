const db = require("../db/index");
const { student, employer, posts_job, confirm, gen_document, gen_document_self} = db;
db.sequelize.sync();

exports.listConfirm = async (req, res) => {
  try {
    const listConfirm = await confirm.findAll({
      include: [{ model: student }, { model: posts_job },{model: employer  ,attributes: {
        exclude: ["username", "password"],
      }
    }]
    }
    );
    res.send(listConfirm)
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};


exports.getGenDoc = async (req, res) => {
  try{
    const {id} = req.params;
    const dataGenDoc = await gen_document.findOne({
      where: {std_id: id}
    })
    res.send(dataGenDoc)
  }catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

exports.getGenDocSelf = async(req, res) => {
  try{
    const {id} = req.params;
    console.log(id)
    const dataGenDocSelf = await gen_document_self.findOne({
      where: {std_id: id}
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
  // ส่งเมลบอกเรื่องเอกสารอนุมัติเเล้วให้บริษัท
};
