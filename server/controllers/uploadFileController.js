// controllers/csvController.js
const path = require("path");
const fs = require("fs");
const moment = require('moment-timezone');
const db = require("../db/index");
const { studentCsv,student,document,setup_courtesy,employer, gen_document, gen_document_self } = db;
const { Op } = require("sequelize");
const newsModel = require("../db/models/newsModel");
const { isModuleNamespaceObject } = require("util/types");
db.sequelize.sync();
const {findYear} = require("./authController")

exports.getFileCourtesy = async (req, res) => {
  try {  
    const { id } = req.params
    const File = await gen_document.findOne({where: {std_id : id}})
    if (File){
      const filePath = path.join(__dirname, `../uploads/`, File.courtesy_license);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.sendFile(filePath);
    }else{
      const FileSelf = await gen_document_self.findOne({where: {std_id : id}})
      const filePath = path.join(__dirname, `../uploads/`, FileSelf.courtesy_license);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.sendFile(filePath);
    } 


  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}


exports.getFileLetter = async (req, res) => {
  try {  
    const { id } = req.params
    const File = await gen_document.findOne({where: {std_id : id}})
    if (File){
      const filePath = path.join(__dirname, `../uploads/`, File.intern_letter);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.sendFile(filePath);
    }else{
      const FileSelf = await gen_document_self.findOne({where: {std_id : id}})
      const filePath = path.join(__dirname, `../uploads/`, FileSelf.intern_letter);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
      res.sendFile(filePath);
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.getFileReportPdf = async (req, res) => {
  try {  
    const { id } = req.params
    const File = await document.findOne({where: {std_id : id}})

    const filePath = path.join(__dirname, `../uploads/`, File.report_pdf);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.getFileReportDocx = async (req, res) => {
  try {  
    const { id } = req.params
    const File = await document.findOne({where: {std_id : id}})

    const filePath = path.join(__dirname, `../uploads/`, File.report_docx);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.getFileTimesheet= async (req, res) => {
  try {  
    const { id } = req.params
    const File = await document.findOne({where: {std_id : id}})

    const filePath = path.join(__dirname, `../uploads/`, File.timestamp_pdf);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.getFilePresentationPdf= async (req, res) => {
  try {  
    const { id } = req.params
    const File = await document.findOne({where: {std_id : id}})

    const filePath = path.join(__dirname, `../uploads/`, File.PresentationPdf);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.getFilePresentationPpt= async (req, res) => {
  try {  
    const { id } = req.params
    const File = await document.findOne({where: {std_id : id}})

    const filePath = path.join(__dirname, `../uploads/`, File.present_ppt);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");
    res.sendFile(filePath);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Get File Failed" });
  }
}

exports.setup_courtesy_sig_img = async (req, res) => {
  try{
  
    const setup = await setup_courtesy.findAll();
    const lastSetup = setup.length - 1;
    console.log(setup)
    if(req.file){
    const upload_sig_img = await setup_courtesy.update({
      signature_img: `${req.user.username}/${req.file.originalname}`
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
        company_pic: `${req.user.username}/${req.file.originalname}`
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
        resume: `${req.user.username}/${req.file.originalname}`
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
    // Get the current date and time in the specified timezone
    const sendDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    if (req.file) {
      // Update the document with the uploaded file details
      const ReportPdf = await document.update({
        report_pdf: `${req.user.username}/${req.file.originalname}`,
        date_upload_report_pdf: sendDate
      }, { where: { std_id: req.user.username } });

      if (ReportPdf[0] === 1) { // Check if any row was updated
        res.status(200).send("Upload Successfully");
      } else {
        res.status(404).send("Record not found");
      }
    } else {
      res.status(400).send("No file uploaded");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed", error: err.message });
  }
};
exports.uploadReportDocx = async (req, res) => {
  try {
    const sendDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    if(req.file){
      console.log(req)
      const ReportDocx = await document.update({
        report_docx: `${req.user.username}/${req.file.originalname}`,
        date_upload_report_docx: sendDate
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
    const sendDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    if(req.file){
      const Timestamp = await document.update({
        timestamp_pdf: `${req.user.username}/${req.file.originalname}`,
        date_upload_timestamp_pdf: sendDate
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
    console.log("hello pdf")
    const sendDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    if(req.file){
      const PresentPdf = await document.update({
        present_pdf: `${req.user.username}/${req.file.originalname}`,
        date_upload_present_pdf: sendDate
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
    console.log("hello ppt")
    const sendDate = moment.tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    console.log(req.file)
    if(req.file){
      const PresentPpt = await document.update({
        present_ppt: `${req.user.username}/${req.file.originalname}`,
        date_upload_present_ppt: sendDate
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
//       file_url: `uploads/documentStudent/resume/${req.file.originalname}`,
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

exports.getAllDocStudent = async(req, res) => {
  try{
    const allDocStudent = await document.findAll()
    res.status(200).json(allDocStudent)
  }catch(error){
    console.error(error)
    res.status(500).json({message: "internal server error"})
  }
}

exports.allCsvData = async(req, res) => {
  try{
    const semesterYear = await findYear(req,res);
    const allCsvData = await studentCsv.findAll({where: {
      academic_year: semesterYear
    }})
    res.status(200).json(allCsvData)
  }catch(error){
    console.error(error)
    res.status(500).json({message: "internal server error"})
  }
}