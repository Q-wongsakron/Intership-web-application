const { Sequelize } = require("sequelize");
require('dotenv').config()
const sequelize = new Sequelize(
  process.env.DATABASE, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
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
db.file_student = require("./models/fileStudentModel")(sequelize, Sequelize);
db.posts_job = require("./models/postWorkModel")(sequelize, Sequelize);
db.apply = require("./models/applyWorkModel")(sequelize, Sequelize);
db.confirm = require("./models/confirmWorkModel")(sequelize, Sequelize);
db.document = require("./models/documentModel")(sequelize, Sequelize);
db.news = require("./models/newsModel")(sequelize, Sequelize);
db.setup_courtesy = require("./models/setupCourtesyModel")(sequelize, Sequelize);
db.gen_document = require("./models/genDocModel")(sequelize, Sequelize);
db.gen_document_self = require("./models/genDocSelfModel")(sequelize, Sequelize);
db.edit_courtesy = require("./models/editCourtesyModel")(sequelize, Sequelize);
db.self_enroll = require("./models/selfEnrollModel")(sequelize,Sequelize);
db.std_eval = require("./models/stdEvalModel")(sequelize,Sequelize);
db.emp_question = require("./models/emQuestionnairModel")(sequelize,Sequelize);
db.emp_eval = require("./models/emEvalModel")(sequelize,Sequelize);
db.employee_tu = require("./models/employeeTuModel")(sequelize,Sequelize);
db.schedule = require("./models/scheduleModel")(sequelize,Sequelize);
db.reset_tokens = require("./models/resetTokensModel")(sequelize,Sequelize);

db.employer.hasMany(db.posts_job, {
  foreignKey: { name: "emp_id", field: "emp_id" },
});

// self enroll
db.student.hasOne(db.self_enroll, {
  foreignKey: { name: "std_id", field: "std_id" },
});
db.self_enroll.belongsTo(db.student, { foreignKey: "std_id" }); 

db.student.hasOne(db.gen_document_self, {
  foreignKey: { name: "std_id", field: "std_id" },
});
db.gen_document_self.belongsTo(db.student, { foreignKey: "std_id" }); 

db.self_enroll.hasOne(db.gen_document_self, {
  foreignKey: { name: "self_enroll_id", field: "self_enroll_id" },
});
db.gen_document_self.belongsTo(db.self_enroll, {foreignKey: "self_enroll_id"})



//document
db.student.hasOne(db.document, {
  foreignKey: { name: "std_id", field: "std_id" },
});
db.document.belongsTo(db.student, { foreignKey: "std_id" }); 

// gen document
db.student.hasOne(db.gen_document, {
  foreignKey: { name: "std_id", field: "std_id" },
});
db.gen_document.belongsTo(db.student, { foreignKey: "std_id" }); 

db.employer.hasMany(db.gen_document, {
  foreignKey: { name: "employer_id", field: "employer_id" },
});
db.gen_document.belongsTo(db.employer, {foreignKey: "employer_id"})

// edit courtesy
db.student.hasOne(db.edit_courtesy, {
  foreignKey: { name: "std_id", field: "std_id" },
});
db.edit_courtesy.belongsTo(db.student, { foreignKey: "std_id" }); 



// Apply Part
db.employer.hasMany(db.apply, {
  foreignKey: { name: "employer_id", field: "employer_id" },
});

db.student.hasOne(db.apply, {
  foreignKey: { name: "std_id", field: "std_id" },
});

db.posts_job.hasMany(db.apply, {
  foreignKey: { name: "job_id", field: "job_id" },
});

db.posts_job.belongsTo(db.employer, { foreignKey: "emp_id" });

db.apply.belongsTo(db.employer, { foreignKey: "employer_id" });
db.apply.belongsTo(db.student, { foreignKey: "std_id" });
db.apply.belongsTo(db.posts_job, { foreignKey: "job_id" });

// Confirm Part
db.student.hasOne(db.confirm, {
  foreignKey: { name: "std_id", field: "std_id" },
});

db.posts_job.hasMany(db.confirm, {
  foreignKey: { name: "job_id", field: "job_id" },
});

db.confirm.belongsTo(db.employer, { foreignKey: "employer_id" });
db.confirm.belongsTo(db.student, { foreignKey: "std_id" });
db.confirm.belongsTo(db.posts_job, { foreignKey: "job_id" });
module.exports = db;
