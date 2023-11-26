const db = require("../util/dbSQL");

module.exports = class Studentscsv {
  constructor(username) {
    this.username = username;
  }
  static searchStudentByName(username) {
    return db.execute(
      "SELECT COUNT(*) AS count FROM studentcsv WHERE username = ?",
      [username]
    );
  }

  static addStudent(username) {
    return db.execute(
      "INSERT INTO `studentcsv` (`id`,`username`) VALUES (NULL,?) ",
      [username]
    );
  }
};
