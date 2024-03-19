const db = require("../db/index");
const { student, self_enroll } = db;
db.sequelize.sync();

exports.selfEnroll = async (req, res) => {
  try {
    console.log(req.body.formData)
    const { displayname_th,company_name,company_address,to_who,tel,email} = req.body.formData
    const {require_doc} =  req.body.require_doc
    const std_id = req.user.username;
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
   
    res.status(200).send("created successfully");
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

