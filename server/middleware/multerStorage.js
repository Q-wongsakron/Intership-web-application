const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Set up Multer storage and specify the destination function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dynamicPath = getDynamicPath(file.originalname, req.user.username);
    const destinationPath = path.join("uploads", dynamicPath);

    fs.mkdirSync(destinationPath, { recursive: true });

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = file.originalname;
    cb(null, uniqueFileName);
  },
});

function getDynamicPath(filename, std_id) {
  if (filename.toLowerCase().includes("zzzzzzedawd")) {
    return path.join("test");
  } else {
    return path.join(std_id);
  }
}

const upload = multer({ storage });

// Middleware to resize image if fieldname is 'SignatureImg'
const resizeImage = async (req, res, next) => {
  if (req.file && req.file.fieldname === "SignatureImg") {
    const filePath = path.join(req.file.destination, req.file.filename);
    const tempPath = filePath + "_temp";
    
    // Resize the image
    await sharp(filePath)
      .resize(1920, 823)
      .toFile(tempPath);

    // Replace the original file with the resized image
    fs.renameSync(tempPath, filePath);
  }
  next();
};

module.exports = { upload, resizeImage };
