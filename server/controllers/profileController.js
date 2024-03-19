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
exports.getProfileStudentPublic = async (req, res) => {
	try {
		const {id} = req.params
		const profile = await student.findOne({
			where: { std_id: id},
		});
		res.status(200).json(profile);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

exports.getProfileEmployer = async (req, res) => {
	try {
		const profile = await employer.findOne({
			where: { employer_id: req.user.id },
		});
		const post = await posts_job.findAll({
			where: { emp_id: req.user.id },
		});
		const payload = { profile: profile, post: post };
		res.status(200).json(payload);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err.message });
	}
};

exports.getProfileEmployerId = async (req, res) => {
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

		if (!profile) {
			return res.status(404).json({ error: "Profile not found" });
		}

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
			name_title_th,
			displayname_th,
			name_title_en,
			displayname_en,
			email,
			experience,
			skill,
			gpa,
			tel,
		} = req.body.formData;
		const update_profile = await student.update(
			{
				name_title_th:name_title_th,
				displayname_th: displayname_th,
				name_title_en:name_title_en,
				displayname_en: displayname_en,
				email: email,
				tel: tel,
				experience: experience,
				skill: skill,
				gpa: gpa,
				// resume: `http://localhost:5500/api/resume/${req.file.originalname}`,
			},
			{ where: { std_id: req.user.username } }
		);
		console.log(req.body);
		return res.status(200).json({ message: "Update Success" });
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
			pcode,
			contact_name,
			contact_email,
			contact_tel,
			about,
			company_pic,
		} = req.body.formData;
		const update_profile = await employer.update(
			{
				company_name: company_name,
				address: address,
				subdistrict: subdistrict,
				district: district,
				province: province,
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

// exports.getResume = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const resume = await student.findOne({
//       where: { std_id: id },
//       exclude: ["std_id", "displayname_th", displayname_en"],
//     });
//     res.status(200).send(resume);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
