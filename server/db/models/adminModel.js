module.exports = (sequelize, Sequelize) => {
  const admin = sequelize.define(
    "admin",
    {
      admin_id: {
        type: Sequelize.INTEGER(100),
        primaryKey: true,
        autoInclement: true,
        field: "admin_id",
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "username",
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "password",
      },
      role: {
        type: Sequelize.STRING(55),
        allowNull: false,
        field: "role",
      },
    },
    {
      tableName: "admin",
    }
  );
  return admin;
};
// const db = require("../../util/dbSQL");
// module.exports = class Admin {
//   constructor(id, username, password, role) {
//     this.id = id;
//     this.username = username;
//     this.password = password;
//     this.role = role;
//   }

//   static getAdminByName(username) {
//     // return db.execute("SELECT username,role FROM admin WHERE username = ?", [
//     // 	username,
//     // ]);
//     return db.execute("SELECT * FROM admin WHERE username = ?", [username]);
//   }
//   static createAdmin(username, password, role) {
//     return db.execute(
//       "INSERT INTO `admin` (`id`,`username`,`password`,`role`) VALUES (NULL, ?, ?, ?) ",
//       [username, password, role]
//     );
//   }
// };
