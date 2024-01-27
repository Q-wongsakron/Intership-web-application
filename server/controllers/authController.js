const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { apiToken, secret } = require("../config");

const db = require("../db/index");
const { admin, student, employer } = db;
db.sequelize.sync();

// const Students = require("../db/models/studentModel");
// const Admins = require("../db/models/adminModel");
// const Employers = require("../db/models/employerModel");

exports.loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;
    const url = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify";
    const data = {
      UserName: username,
      PassWord: password,
    };
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Application-Key": apiToken,
      },
    });
    if (response.data.status) {
      const {
        username,
        displayname_th,
        displayname_en,
        email,
        department,
        faculty,
        type,
      } = response.data;
      // Check if the user exists in the database
      const userExists = await student.findOne({
        where: { std_id: username },
      });
      console.log(username);
      if (!userExists) {
        const result =
          // If the user does not exist, add them to the database
          await student.create({
            std_id: username,
            displayname_th: displayname_th,
            displayname_en: displayname_en,
            email: email,
            department: department,
            faculty: faculty,
            role: type,
          });
      }
      let payload = {
        user: {
          username: username,
          role: type,
        },
      };
      jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (err) {
    res.status(500).send(err);
    // const errMesg = err.response.data.Description;
    // res.status(err.response.status).json({ message: errMesg });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // const rawuser = await Admins.getAdminByName(username);
    userAdmin = await admin.findOne({
      where: { username: username },
    });
    if (!userAdmin) {
      res.sendStatus(500);
    } else {
      const isMatch = await bcrypt.compare(password, userAdmin.password);
      if (!isMatch) {
        return res.status(400).send("The Username or Password is Incorrect");
      }
      // send payload
      let payload = {
        user: {
          id: userAdmin.admin_id,
          username: userAdmin.username,
          role: userAdmin.role,
        },
      };
      // generate token
      jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.loginEmployer = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userEmployer = await employer.findOne({
      where: { username: username },
    });
    // const rawuser = await Employers.getEmployerByName(username);

    if (userEmployer) {
      const isMatch = await bcrypt.compare(password, userEmployer.password);

      if (!isMatch) {
        return res.status(400).send("The Username or Password is Incorrect");
      }
      // send payload
      let payload = {
        user: {
          id: userEmployer.employer_id,
          username: userEmployer.username,
          role: userEmployer.role,
        },
      };
      // generate token
      jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      return res.status(400).send("User not found!!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internalServerError" });
  }
};

exports.registerEmployer = async (req, res) => {
  try {
    const {
      username,
      password,
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
    const userEmployer = await employer.findOne({
      where: { username: username },
    });
    // const rawuser = await Employers.searchEmployerByName(username);
    if (userEmployer) {
      return res.send("User already Exits!!").status(400);
    } else {
      console.log("section2");
      const salt = await bcrypt.genSalt(10);
      const role = "employer";
      const hashpassword = await bcrypt.hash(password, salt);
      result = await employer.create({
        username: username,
        password: hashpassword,
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
      });

      let user = {
        user: {
          username: username,
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
      };
      console.log(user);
      return res.send(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    let currentUserRole = req.user.role;
    if (currentUserRole === "student") {
      let userStudent = await student.findOne({
        where: { stdID: req.user.username },
      });
      res.send(userStudent);
    } else if (currentUserRole === "admin") {
      let userAdmin = await admin.findOne({
        where: { username: req.user.username },
      });
      res.send(userAdmin);
    } else if (currentUserRole === "employer") {
      let userEmployer = await employer.findOne({
        where: { username: req.user.username },
      });
      res.send(userEmployer);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
