const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("internship32", "root", "", {
  host: "localhost",
  dialect: "mysql",
  define: {
    timestamps: false,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("./models/adminModel")(sequelize, Sequelize);
db.student = require("./models/studentModel")(sequelize, Sequelize);
db.employer = require("./models/employerModel")(sequelize, Sequelize);
db.studentCsv = require("./models/studentCsvModel")(sequelize, Sequelize);

db.posts_job = require("./models/postWorkModel")(sequelize, Sequelize);

db.employer.hasMany(db.posts_job, {
  foreignKey: { name: "emp_id", field: "emp_id" },
});

db.posts_job.belongsTo(db.employer, { foreignKey: "emp_id" });

module.exports = db;
