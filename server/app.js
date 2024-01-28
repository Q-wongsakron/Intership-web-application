const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
// const fileUpload = require("express-fileupload");
const cors = require("cors");
const { readdirSync } = require("fs");

const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
// app.use(fileUpload());

readdirSync("./routes").map((r) => app.use("/api", require("./Routes/" + r)));

app.listen(5500, () => console.log("listening on port 5500"));
