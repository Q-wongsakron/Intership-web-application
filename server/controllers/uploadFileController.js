// controllers/csvController.js
const path = require("path");
const fs = require("fs");

const db = require("../db/index");
const { studentCsv,student,document,setup_courtesy,employer } = db;
const { Op } = require("sequelize");
db.sequelize.sync();

let currentDate = Date.now();
let date_ob = new Date(currentDate);
let currentMonth = date_ob.getMonth() + 1;
let currentYear = date_ob.getFullYear() + 543

if(currentMonth >= 7 && currentMonth <= 12){
  currentYear = date_ob.getFullYear() + 543
}else if(currentMonth >= 1 && currentMonth <= 6)
  currentYear = date_ob.getFullYear() + 542

exports.setup_courtesy_sig_img = async (req, res) => {
  try{
  
    const setup = await setup_courtesy.findAll();
    const lastSetup = setup.length - 1;
    console.log(setup)
    if(req.file){
    const upload_sig_img = await setup_courtesy.update({
      signature_img: `${currentYear}/${req.user.username}/${req.file.originalname}`
    },{where: { id : setup[lastSetup].id}})
    res.status(200).send("Signature Upload Successfully");
    }else{
      res.status(200).send("Signature no file");
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Resume Upload Failed" });
  }
}

exports.employerImg = async (req, res) => {
  try{
    console.log(req.file)
    if(req.file){
      const uploadImg = await employer.update({
        company_pic: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { employer_id : req.user.id}})
      res.status(200).json({message: "upload employer image succress"})
    }
    else{
      res.status(200).json({message: "not have image"})
    }
    
  }catch(err){
    console.error(err)
    res.status(500).json({message: "internal server error"})
  }
}

exports.uploadFileResume = async (req, res) => {
  try {
    if(req.file){
      const uploadResume = await student.update({
        resume: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Resume Upload Successfully");
    }else{
      res.status(200).send("Resume no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume Upload Failed" });
  }
};

// Document Uplaod
exports.uploadReportPdf = async (req, res) => {
  try {
    if(req.file){
      const  ReportPdf = await document.update({
        report_pdf: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Upload Successfully");
    }else{
      res.status(200).send("Upload no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadReportDocx = async (req, res) => {
  try {
    if(req.file){
      console.log(req)
      const ReportDocx = await document.update({
        report_docx: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Upload Successfully");
    }else{
      res.status(200).send("Upload no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadTimestampPdf = async (req, res) => {
  try {
    if(req.file){
      const Timestamp = await document.update({
        timestamp_pdf: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Upload Successfully");
    }else{
      res.status(200).send("Upload no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadPresentPdf= async (req, res) => {
  try {
    if(req.file){
      const PresentPdf = await document.update({
        present_pdf: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Upload Successfully");
    }else{
      res.status(200).send("Upload no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadPresentPpt = async (req, res) => {
  try {
    if(req.file){
      const PresentPpt = await document.update({
        present_ppt: `${currentYear}/${req.user.username}/${req.file.originalname}`
      },{where: { std_id : req.user.username}});
      res.status(200).send("Upload Successfully");
    }else{
      res.status(200).send("Upload no file");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};

// exports.uploadFileResume = async (req, res) => {
//   try {
//     const uploadFile = await file_student.create({
//       name: req.file.originalname,
//       file_type: req.file.mimetype,
//       file_url: `uploads/${currentYear}/documentStudent/resume/${req.file.originalname}`,
//     });
//     res.send("Resume Upload Successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Resume Upload Failed" });
//   }
// };

exports.uploadcsv = async (req, res) => {
  try {
    if (!req.file || Object.keys(req.file).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const csvFile = req.file;
    const csvBuffer = require("fs").readFileSync(csvFile.path, "utf8");

    const rows = csvBuffer.split(/\r?\n/);

    let isFirstRow = true;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();

      // Skip empty rows
      if (!row) {
        continue;
      }

      // Split the row into columns
      const columns = row.split(",");

      // Skip the first row (header row)
      if (isFirstRow) {
        isFirstRow = false;
        continue;
      }

      const username = columns[0].trim(); // Assuming username is in the first column
      const year = columns[1].trim(); // Assuming year is in the second column

      // Check if username is valid (not empty)
      // งง อยู่
      if (username) {
        const countResult = await studentCsv.findOne({
          where: { 
            username: username,
            academic_year: year // Op.ne means not equal to
          },
        });
        
        if (!countResult) {
          await studentCsv.create({
            username: username,
            academic_year: year
          });
          const resetStatusStd = await student.update({
            status: 0
          },{
            where: { std_id : username}
          })
          console.log(`Student '${username}' added to the database`);
        } else {
          console.log(`Student '${username}' already exists in the database`);
        }
      }
    }

    res.status(200).json({ message: "CSV Upload Successful" });
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
