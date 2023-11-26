const mysql = require("mysql2");
const { host, user, pass, dbPort, database, port } = require("../config");

const pool = mysql.createPool({
  host: host,
  port: dbPort,
  user: user,
  password: pass,
  database: database,
});

module.exports = pool.promise();
