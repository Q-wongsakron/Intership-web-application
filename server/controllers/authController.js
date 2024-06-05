const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail, mailTemplate } = require("../util/email");
const { Op } = require('sequelize');
const NumSaltRounds = Number(process.env.NO_OF_SALT_ROUNDS);

require('dotenv').config()
const db = require("../db/index");
const { admin, student, employer, studentCsv, employee_tu, reset_tokens } = db;
db.sequelize.sync();

// const Students = require("../db/models/studentModel");
// const Admins = require("../db/models/adminModel");
// const Employers = require("../db/models/employerModel");

exports.findYear = (req,res) => {
  return studentCsv.findOne({
    order: [['academic_year', 'DESC']] // Order by academic_year in descending order
  }).then(async (latestRecord) => {
    if (latestRecord) {
      const semesterYear = latestRecord.academic_year;
      return semesterYear;
    } else {
      return null;
    }
  }).catch(error => {
    console.error("Error fetching semester year:", error);
    return null;
  });
};

exports.findYearStd = async(req,res) => {
  try{
    const {id} = req.params;
    const latestRecord = await studentCsv.findOne({
        where: {username: id},
        order: [['academic_year', 'DESC']] // Order by academic_year in descending order
      })
    if (latestRecord) {
      const semesterYear = latestRecord.academic_year;
      res.send(semesterYear).status(200)
    } else {
      res.send(null).status(400)
    }
  }catch(err){
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
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
    //backdoor
    const findUser = await employee_tu.findOne({where : {emp_tu_id : username}})
    if (findUser){
      let payload = {
        user: {
          username: username,
          role: findUser.role,
        },
      };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    }else{
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "Application-Key": process.env.REGTU_API_TOKEN,
        },
      });
      if (response.data.status) {
        if(response.data.type == "student"){
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
                status: userExists.status,
              },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
              if (err) throw err;
              res.json({ token, payload });
            });
        } else if (response.data.type == "employee") {
            const {
              username,
              displayname_th,
              displayname_en,
              email,
              department,
              organization,
              type,
            } = response.data;
            // Check if the user exists in the database
            const userExists = await employee_tu.findOne({
              where: { emp_tu_id : username },
            });
            console.log(username);
            if (!userExists) {
              const result =
                // If the user does not exist, add them to the database
                await employee_tu.create({
                  emp_tu_id: username,
                  displayname_th: displayname_th,
                  displayname_en: displayname_en,
                  email: email,
                  department: department,
                  organization: organization,
                  role: type,
                });
            }
            let payload = {
              user: {
                username: username,
                role: type,
                status: userExists.status,
              },
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
              if (err) throw err;
              res.json({ token, payload });
            });
        }
  
      } else {
        res.status(400).json({ message: "Authentication failed" });
      }
    }

  } catch (err) {
    console.log(err);
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
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
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
    const { usernameOrEmail, password } = req.body;
    const userEmployer = await employer.findOne({
      where: {
        [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
      },
    });

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
          email: userEmployer.email,
          role: userEmployer.role,
          verified: userEmployer.verified,
        },
      };

      // generate token
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
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
      email,
      password,
      company_name,
      address,
      subdistrict,
      district,
      province,
      pcode,
      contact_name,
      contact_email,
      contact_tel,
      company_pic,
    } = req.body;

    // Check if the email is already registered
    const existingEmail = await employer.findOne({
      where: { email: email },
    });

    const userEmployer = await employer.findOne({
      where: { username: username },
    });

    if (userEmployer && existingEmail) {
      return res.status(400).send("Username and Email already exists!");
    }else if (userEmployer){
      return res.status(400).send("Username already exists!");
    }else if (existingEmail){
      return res.status(400).send("Email already exists!");
    }

    console.log("section2");
    const salt = await bcrypt.genSalt(10);
    const role = "employer";
    const hashpassword = await bcrypt.hash(password, salt);
    const result = await employer.create({
      username: username,
      email: email,
      password: hashpassword,
      company_name: company_name,
      address: address,
      subdistrict: subdistrict,
      district: district,
      province: province,
      pcode: pcode,
      contact_name: contact_name,
      contact_email: contact_email,
      contact_tel: contact_tel,
      company_pic: company_pic,
    });

    let user = {
      user: {
        username: username,
        email : email,
        company_name: company_name,
        address: address,
        subdistrict: subdistrict,
        district: district,
        province: province,
        pcode: pcode,
        contact_name: contact_name,
        contact_email: contact_email,
        contact_tel: contact_tel,
        company_pic: company_pic,
      },
    };
    const employerId = await employer.findOne({where:{username: username}})
    // create token
    const token = crypto.randomBytes(20).toString("hex");
    const verifyToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const createdAt = new Date().toISOString(); // Convert Date object to string
    const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(); // Convert Date object to string
      
    console.log(createdAt);
    //save token and expires date
    await reset_tokens.create({
        token: verifyToken,
        created_at: createdAt,
        expires_at: expiresAt,
        user_id: employerId.employer_id
      });

    const mailOption = {
      email: email,
      subject: "verify Email Link",
      message: mailTemplate(
        "Please verify you email using the link below.",
        `${process.env.FRONTEND_URL}/verify-email?id=${employerId.employer_id}&token=${verifyToken}`,
        "Verify Email"
      ),
    };
    await sendEmail(mailOption);
    res.status(200).json({
      success: true,
      message: "A verify email link has been sent to your email.",
    });

    //console.log(user);
    //return res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token, userId } = req.body;
    // const userToken = await db.get_password_reset_token(userId);
    const userToken = await reset_tokens.findOne({
      where: { user_id : userId },
      order: [['created_at', 'DESC']],
      limit: 1
    });
    if (!res || res.length === 0) {
      res.json({
        success: false,
        message: "Some problem occurred!",
      });
    } else {
      const currDateTime = new Date();
      const expiresAt = new Date(userToken.expires_at);
      console.log(currDateTime)
      console.log(expiresAt)
      console.log(currDateTime > expiresAt)
      
      if (currDateTime > expiresAt) {
        res.json({
          success: false,
          message: "Verify Email link has expired!",
        });
      } else if (userToken.token !== token) {
        res.json({
          success: false,
          message: "Verify Email Token link is invalid!",
        });
      } else {
        // await db.update_password_reset_token(userId);
        await reset_tokens.destroy({ where: { user_id: userId } });
        
        // await db.update_user_password(userId, hashedPassword);
        await employer.update(
          { 
            verified : true
           },
          { where: { employer_id: userId } }
        );
        //const token = createToken(user._id);

        // res.status(200).json({
        //   _id: user._id,
        //   name: user.name,
        //   email: user.email,
        //   token,
        //   isVerified: user?.isVerified,
        // });
      
        res.json({
          success: true,
          message: "verify email successfully!",
        });
      }
    }
  } catch(err){
    console.log(err);
    res.json({
      success: false,
      message: "Verify Email link has expired!",
    });
    //res.status(500).json(err.message);
  }
}

exports.getCurrentUser = async (req, res) => {
  try {
    let currentUserRole = req.user.role;
    if (currentUserRole === "student") {
      let userStudent = await student.findOne({
        where: { std_id: req.user.username },
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
    }else if (currentUserRole === "head") {
      let userEmployeeTu = await employee_tu.findOne({
        where: { emp_tu_id: req.user.username },
      });
      res.send(userEmployeeTu);
    }else if (currentUserRole === "secretary") {
      let userEmployeeTu = await employee_tu.findOne({
        where: { emp_tu_id: req.user.username },
      });
      res.send(userEmployeeTu);
    }else if (currentUserRole === "teacher") {
      let userEmployeeTu = await employee_tu.findOne({
        where: { emp_tu_id: req.user.username },
      });
      res.send(userEmployeeTu);
     } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.forgotPassword = async (req,res) => {
  try {
    const email = req.body.email;
    // const user = await db.get_user_by_email(email);
    const user = await employer.findOne({ where: { email } });

    if (!user || user.length === 0) {
      res.json({
        success: false,
        message: "Your are not registered!",
      });
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      const resetToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

        const createdAt = new Date().toISOString(); // Convert Date object to string
        const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(); // Convert Date object to string
        
        console.log(createdAt);
        
        await reset_tokens.create({
          token: resetToken,
          created_at: createdAt,
          expires_at: expiresAt,
          user_id: user.employer_id
        });

      const mailOption = {
        email: email,
        subject: "Forgot Password Link",
        message: mailTemplate(
          "We have received a request to reset your password. Please reset your password using the link below.",
          `${process.env.FRONTEND_URL}/resetPassword?id=${user.employer_id}&token=${resetToken}`,
          "Reset Password"
        ),
      };
      await sendEmail(mailOption);
      res.json({
        success: true,
        message: "A password reset link has been sent to your email.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.resetPassword = async (req,res) => {
  try {
    const { password, token, userId } = req.body;
    // const userToken = await db.get_password_reset_token(userId);
    const userToken = await reset_tokens.findOne({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 1
    });
    if (!res || res.length === 0) {
      res.json({
        success: false,
        message: "Some problem occurred!",
      });
    } else {
      const currDateTime = new Date();
      const expiresAt = new Date(userToken.expires_at);

      if (currDateTime > expiresAt) {
        res.json({
          success: false,
          message: "Reset Password link has expired!",
        });
      } else if (userToken.token !== token) {
        res.json({
          success: false,
          message: "Reset Password Token link is invalid!",
        });
      } else {
        // await db.update_password_reset_token(userId);
        await reset_tokens.destroy({ where: { user_id: userId } });
        const salt = await bcrypt.genSalt(NumSaltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        // await db.update_user_password(userId, hashedPassword);
        await employer.update({ password : hashedPassword }, { where:  {employer_id : userId} });
        res.json({
          success: true,
          message: "Your password reset was successfully!",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
}
