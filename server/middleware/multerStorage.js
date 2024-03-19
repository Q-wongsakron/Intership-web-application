const multer = require("multer");
const path = require("path");
// Set up Multer storage and specify the destination function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dynamicPath = getDynamicPath(file.originalname,req.user.username);
    const destinationPath = path.join("uploads", dynamicPath);

    require("fs").mkdirSync(destinationPath, { recursive: true });

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = file.originalname;
    cb(null, uniqueFileName);
  },
});
//ไม่ต้องตั้งชื่อไฟล์ฟิก  เเละ 

function getDynamicPath(filename, std_id) {
  // Check if the filename contains the string "resume"
  if (filename.toLowerCase().includes("zzzzzzedawd")) {
    return path.join("2566", "test");
  } else {
    // Default path if "resume" is not in the filename
    return path.join("2566", std_id);
  }
}

const upload = multer({ storage });

module.exports = upload;
