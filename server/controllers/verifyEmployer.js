const Employers = require("../models/employerModel");

exports.listEmployer = async (req, res) => {
  try {
    const listEmployer = await Employers.listEmployer();
    // console.log(listEmployer[0]);
    res.send(listEmployer[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.verifyEmployer = async (req, res) => {
  try {
    const { id, status } = req.body.data;
    const employer = await Employers.verifyEmployer(id, status);
    console.log("verify complete");
    res.send(employer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
