require("dotenv").config({ path: "./config/.env" });

module.exports = {
  port: process.env.PORT,
  host: process.env.HOST,
  dbPort: process.env.DB_PORT,
  user: process.env.USER,
  pass: process.env.PASS,
  database: process.env.DATABASE,
  secret: process.env.JWT_SECRET,
  apiToken: process.env.REGTU_API_TOKEN,
};
