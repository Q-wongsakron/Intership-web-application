const db = require("../db/index");
const { student, employer , employee_tu} = db;
db.sequelize.sync();

exports.listAllUser = async (req, res) => {
  try {
    const listUser = await employee_tu.findAll();
    res.send(listUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};


exports.changeRole = async (req, res) => {
  try {
    console.log(req.body);
    const { emp_tu_id, role } = req.body.data;

    const user = await employee_tu.update(
      { role: role },
      {
        where: { emp_tu_id: emp_tu_id },
      }
    );
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
