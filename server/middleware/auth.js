const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const Admins = require("../models/adminModel");
exports.auth = async (req, res, next) => {
	try {
		const token = req.headers["authtoken"];
		if (!token) {
			return res.status(400).send("No token");
		}
		const decoded = jwt.verify(token, secret);
		req.user = decoded.user;
		next();
	} catch (err) {
		console.log(err);
		res.status(500).send("Token Invalid");
	}
};

exports.adminCheck = async (req, res, next) => {
	try {
		// const rawadmin = await Admins.getAdminByName(req.user.username);
		// const admin = rawadmin[0][0];

		if (req.user.role !== "admin") {
			res.status(403).send("access denied");
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
};
