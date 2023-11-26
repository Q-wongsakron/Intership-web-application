const Students = require("../models/studentModel");
const Employers = require("../models/employerModel");

exports.listAllUser = async (req, res) => {
  try {
    const listStudent = await Students.listStudent();
    res.send(listStudent[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body.data;
    const user = await Students.updateStudent(id, role);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
