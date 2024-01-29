const db = require("../db/index");
const { student, employer, posts_job, apply } = db;
db.sequelize.sync();

exports.createApply = async (req, res) => {
  try {
    const { job_id, position } = req.body;

    const posts_data = await posts_job.findOne({
      where: { job_id: job_id },
    });
    console.log(posts_data);
    const createApply = await apply.create({
      std_id: req.user.username,
      employer_id: posts_data.emp_id,
      job_id: posts_data.job_id,
      position: position,
    });
    res.status(200).json({ message: "Apply Success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Apply Fail" });
  }
};
