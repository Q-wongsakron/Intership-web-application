const db = require("../db/index");
const { employer } = db;
db.sequelize.sync();

exports.listEmployer = async (req, res) => {
  try {
    const listEmployer = await employer.findAll();
    // console.log(listEmployer[0]);
    res.send(listEmployer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.verifyEmployer = async (req, res) => {
  try {
    console.log(req.body.data);
    const { employer_id, status } = req.body.data;
    const update_employer = await employer.update(
      { status: status },
      {
        where: { employer_id: employer_id },
      }
    );
    console.log("verify complete");
    res.send(update_employer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
