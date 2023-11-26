const db = require("../util/dbSQL");

module.exports = class Students {
  constructor(
    id,
    username,
    displayname_th,
    displayname_en,
    email,
    department,
    faculty,
    experience,
    skill,
    gpa,
    status,
    role
  ) {
    this.id = id;
    this.username = username;
    this.displayname_th = displayname_th;
    this.displayname_en = displayname_en;
    this.email = email;
    this.department = department;
    this.faculty = faculty;
    this.experience = experience;
    this.skill = skill;
    this.gpa = gpa;
    this.status = status;
    this.role = role;
  }

  static searchStudentByName(username) {
    return db.execute(
      "SELECT COUNT(*) AS count FROM student WHERE username = ?",
      [username]
    );
  }
  static createStudent(
    username,
    displayname_th,
    displayname_en,
    email,
    department,
    faculty,
    role
  ) {
    return db.execute(
      "INSERT INTO `student` (`id`,`username`,`displayname_th`,`displayname_en`,`email`,`department`,`faculty`,`role`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?) ",
      [
        username,
        displayname_th,
        displayname_en,
        email,
        department,
        faculty,
        role,
      ]
    );
  }
  static getStudentByName(username) {
    return db.execute("SELECT * FROM student WHERE username = ?", [username]);
  }

  static listStudent() {
    return db.execute("SELECT * FROM student");
  }
  static updateStudent(id, role) {
    return db.execute("UPDATE `student` SET `role`=? WHERE `id`=?", [role, id]);
  }
};
