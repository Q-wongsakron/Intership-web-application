const db = require("../db/index");
const { secret } = require("../config");
const { employer, student, posts_job } = db;
db.sequelize.sync();

exports.getProfileStudent = async (req, res) => {
  try {
    const profile = await student.findOne({
      where: { std_id: req.user.username },
    });
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getProfileEmployer = async (req, res) => {
  try {
    const employer_id = req.params.id;
    const profile = await employer.findOne({
      where: { employer_id: employer_id },
      attributes: {
        exclude: ["username", "password"],
      },
    });
    const post = await posts_job.findAll({
      where: { emp_id: employer_id },
    });
    const payload = { profile: profile, post: post };
    res.status(200).json(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfileStudent = async (req, res) => {
  try {
    const {
      displayname_th,
      displayname_en,
      email,
      department,
      faculty,
      experience,
      skill,
      gpa,
    } = req.body;
    const update_profile = await student.update(
      {
        displayname_th: displayname_th,
        displayname_en: displayname_en,
        email: email,
        department: department,
        faculty: faculty,
        experience: experience,
        skill: skill,
        gpa: gpa,
      },
      { where: { std_id: req.user.username } }
    );
    return res.status(200).send("Update Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfileEmployer = async (req, res) => {
  try {
    const {
      company_name,
      address,
      subdistrict,
      district,
      province,
      country,
      pcode,
      contact_name,
      contact_email,
      contact_tel,
      about,
      company_pic,
    } = req.body;
    const update_profile = await employer.update(
      {
        company_name: company_name,
        address: address,
        subdistrict: subdistrict,
        district: district,
        province: province,
        country: country,
        pcode: pcode,
        contact_name: contact_name,
        contact_email: contact_email,
        contact_tel: contact_tel,
        about: about,
        company_pic: company_pic,
      },
      { where: { employer_id: req.user.id } }
    );
    return res.status(200).send("Update Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
