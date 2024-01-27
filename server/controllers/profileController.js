const db = require("../db/index");
const { employer, student } = db;
db.sequelize.sync();

exports.getProfile = async (req, res) => {
  try {
    const role = req.user.role;
    if (role === "student") {
      const profile = await student.findOne({
        where: { std_id: req.user.username },
      });
      return res.status(200).json(profile);
    } else if (role === "employer") {
      const profile = await employer.findOne({
        where: { employer_id: req.user.id },
      });
      return res.status(200).json(profile);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "student") {
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
    } else if (role === "employer") {
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
          company_pic: company_pic,
        },
        { where: { employer_id: req.user.id } }
      );
      return res.status(200).send("Update Success");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
