const jwt = require("jsonwebtoken");
const { secret } = require("../config");

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
