// controllers/csvController.js
const path = require("path");
const fs = require("fs");

const db = require("../db/index");
const { studentCsv,student,document,setup_courtesy } = db;
db.sequelize.sync();


exports.setup_courtesy_sig_img = async (req, res) => {
  try{
  
    const setup = await setup_courtesy.findAll();
    const lastSetup = setup.length - 1;
    console.log(setup)
    const upload_sig_img = await setup_courtesy.update({
      signature_img: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { id : setup[lastSetup].id}})
    res.send("Signature Upload Successfully");
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Resume Upload Failed" });
  }
}

exports.uploadFileResume = async (req, res) => {
  try {
    const uploadResume = await student.update({
      resume: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Resume Upload Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resume Upload Failed" });
  }
};

// Document Uplaod
exports.uploadReportPdf = async (req, res) => {
  try {
    const  ReportPdf = await document.update({
      report_pdf: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Upload Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadReportDocx = async (req, res) => {
  try {
    console.log(req)
    const ReportDocx = await document.update({
      report_docx: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Upload Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadTimestampPdf = async (req, res) => {
  try {
    const Timestamp = await document.update({
      timestamp_pdf: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Upload Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadPresentPdf= async (req, res) => {
  try {
    const PresentPdf = await document.update({
      present_pdf: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Upload Successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload Failed" });
  }
};
exports.uploadPresentPpt = async (req, res) => {
  try {
    const PresentPpt = await document.update({
      present_ppt: `2566/${req.user.username}/${req.file.originalname}`
    },{where: { std_id : req.user.username}});
    res.send("Upload Successfully");
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
//       file_url: `uploads/2566/documentStudent/resume/${req.file.originalname}`,
//     });
//     res.send("Resume Upload Successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Resume Upload Failed" });
//   }
// };

exports.uploadcsv = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const csvFile = req.files.csvFile;
    const csvBuffer = csvFile.data.toString("utf8");

    const stream = require("stream");
    const Readable = stream.Readable;
    const csvStream = new Readable();

    csvStream.push(csvBuffer);
    csvStream.push(null);

    let isFirstRow = true;

    csvStream
      .pipe(require("csv-parser")({ headers: ["username"] }))
      .on("data", async (row) => {
        // Skip the first row (header row)
        if (isFirstRow) {
          isFirstRow = false;
          return;
        }

        const username = row.username;

        // Check if username is valid (not undefined or null)
        if (username) {
          const countResult = await studentCsv.findOne({
            where: { username: username },
          });

          if (!countResult) {
            await studentCsv.create({
              username: username,
            });
            console.log(`Student '${username}' added to the database`);
          } else {
            console.log(`Student '${username}' already exists in the database`);
          }
        }
      })
      .on("end", () => {
        res.status(200).json({ message: "CSV Upload Successful" });
      });
  } catch (error) {
    console.error("Error processing CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
