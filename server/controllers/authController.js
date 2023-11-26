const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { apiToken, secret } = require("../config");
const Students = require("../models/studentModel");
const Admins = require("../models/adminModel");
const Employers = require("../models/employerModel");

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
      const user = response.data;
      // Check if the user exists in the database
      const userExists = await Students.searchStudentByName(username);
      if (!userExists[0][0].count) {
        const result =
          // If the user does not exist, add them to the database
          await Students.createStudent(
            user.username,
            user.displayname_th,
            user.displayname_en,
            user.email,
            user.department,
            user.faculty,
            user.type
          );
      }
      let payload = {
        user: {
          username: user.username,
          role: user.type,
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
    // res.status(500).json({ message: "Internal server error" });
    const errMesg = err.response.data.Description;
    res.status(err.response.status).json({ message: errMesg });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const rawuser = await Admins.getAdminByName(username);
    if (rawuser[0][0] != undefined) {
      const user = rawuser[0][0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("The Username or Password is Incorrect");
      }
      // send payload
      let payload = {
        user: {
          username: user.username,
          role: user.role,
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
    res.status(500).json({ message: "internalServerError" });
  }
};

exports.loginEmployer = async (req, res) => {
  try {
    const { username, password } = req.body;
    const rawuser = await Employers.getEmployerByName(username);
    console.log(rawuser[0][0]);
    if (rawuser[0][0] != undefined) {
      const user = rawuser[0][0];
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(user);
      if (!isMatch) {
        return res.status(400).send("The Username or Password is Incorrect");
      }
      // send payload
      let payload = {
        user: {
          username: user.username,
          role: user.role,
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
    const rawuser = await Employers.searchEmployerByName(username);
    if (rawuser[0][0].count != 0) {
      const exitsuser = rawuser[0][0];
      if (exitsuser.count) {
        return res.send("User already Exits!!").status(400);
      }
    } else {
      console.log("section2");
      const salt = await bcrypt.genSalt(10);
      const role = "employer";
      const hashpassword = await bcrypt.hash(password, salt);
      await Employers.createEmployer(
        username,
        hashpassword,
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
        company_pic
      );

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
    res.status(500).json({ message: "internalServerError" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    let currentUserRole = req.user.role;
    if (currentUserRole === "student") {
      console.log(req.user.username);
      let rawuser = await Students.getStudentByName(req.user.username);
      let user = rawuser[0][0];
      res.send(user);
    } else if (currentUserRole === "admin") {
      let rawuser = await Admins.getAdminByName(req.user.username);
      let user = rawuser[0][0];
      res.send(user);
    } else if (currentUserRole === "employer") {
      let rawuser = await Employers.getEmployerByName(req.user.username);
      let user = rawuser[0][0];
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
