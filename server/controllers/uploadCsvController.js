// controllers/csvController.js

const StudentsCsv = require("../models/studentCsvModel");

exports.upload = async (req, res) => {
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
          const countResult = await StudentsCsv.searchStudentByName(username);

          if (countResult && countResult[0][0].count === 0) {
            await StudentsCsv.addStudent(username);
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
