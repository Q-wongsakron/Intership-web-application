const db = require("../db/index");
const { student, employer, posts_job, apply,confirm } = db;
db.sequelize.sync();

exports.myApply = async (req, res) => {
  try {
    const myApply = await apply.findOne({
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
    const studentStatus = await student.findAll({
      include: [
        { model: apply ,include: [{model: employer}]},
        { model: confirm ,include: [{model: employer}]},
      ],
    });
    res.status(200).json(studentStatus);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};