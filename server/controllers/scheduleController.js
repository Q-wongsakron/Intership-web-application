const db = require("../db/index");
const { schedule} = db;
db.sequelize.sync();

exports.listSchedule = async (req, res) => {
  try {
    const listSchedule = await schedule.findAll();
    res.send(listSchedule);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};


exports.createSchedule = async (req, res) => {
  try {
    console.log(req.body)
    const {  scheduleContent } = req.body;

    const createSchedule = await schedule.create(
      { 
        detail: scheduleContent,
      }

    );

    res.status(200).json({ message: "สร้างกำหนดการสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.editSchedule = async (req, res) => {
    try {
      const listSchedule = await schedule.findAll();
      const {  scheduleContent  } = req.body;
      const id  = listSchedule[0].schedule_id
      
      const editSchedule = await schedule.update(
        { 
          detail: scheduleContent,
          
        }, {where: {schedule_id : id}}
  
      );
  
      res.status(200).json({ message: "แก้ไขกำหนดการสำเร็จ" });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  };
exports.deleteSchedule = async (req, res) => {
    try {
  
      const {id} = req.params
      const deleteSchedule = await schedule.delete({where: {schedule_id : id}}
  
      );
  
      res.status(200).json({ message: "ลบกำหนดการสำเร็จ" });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  };