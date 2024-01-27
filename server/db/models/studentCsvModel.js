module.exports = (sequelize, Sequelize) => {
  const studentCsv = sequelize.define(
    "studentCsv",
    {
      permission_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        field: "permission_id",
      },
      username: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: "username",
      },
    },
    {
      tableName: "studentcsv",
    }
  );

  return studentCsv;
};

// const db = require("../../util/dbSQL");

// module.exports = class Studentscsv {
//   constructor(username) {
//     this.username = username;
//   }
//   static searchStudentByName(username) {
//     return db.execute(
//       "SELECT COUNT(*) AS count FROM studentcsv WHERE username = ?",
//       [username]
//     );
//   }

//   static addStudent(username) {
//     return db.execute(
//       "INSERT INTO `studentcsv` (`id`,`username`) VALUES (NULL,?) ",
//       [username]
//     );
//   }
// };
