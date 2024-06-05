const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
const path = require("path");
// const fileUpload = require("express-fileupload");
const cors = require("cors");
const { readdirSync } = require("fs");
const https = require("https"); 
const app = express();
const fs = require("fs"); 
const port = 3000;
const { auth } = require("./middleware/auth.js");
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(cors({ origin: '*', credentials: true }));

//app.use(cors())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//เอา config set dynamically
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));
const options = { 
    key: fs.readFileSync("server.key"), 
    cert: fs.readFileSync("server.cert"), 
  }; 

// app.get("/api/pdf-file", (req, res) => {
// 	const filePath = path.join(
// 		__dirname,
// 		"uploads/2566/6310611006/6310611006_resume.pdf"
// 	);
// 	res.setHeader("Content-Type", "application/pdf");
// 	res.setHeader("Content-Disposition", "inline");
// 	res.sendFile(filePath);
// });
// Endpoint to fetch and return the image file
app.listen(5500, () => console.log("listening on port 5500"));
// https.createServer(options, app) 
// .listen(5500, function (req, res) { 
//   console.log("Server started at port 5500"); 
// });