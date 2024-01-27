const db = require("../db/index");
const { student, employer } = db;
db.sequelize.sync();

exports.listAllUser = async (req, res) => {
  try {
    const listStudent = await student.findAll();
    res.send(listStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.changeRole = async (req, res) => {
  try {
    console.log(req.body);
    const { std_id, role } = req.body.data;

    const user = await student.update(
      { role: role },
      {
        where: { std_id: std_id },
      }
    );
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
