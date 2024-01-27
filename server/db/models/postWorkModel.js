module.exports = (sequelize, Sequelize) => {
  const posts_job = sequelize.define(
    "posts_job",
    {
      job_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoInclement: true,
        field: "job_id",
      },
      job_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "job_title",
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "location",
      },
      skill: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "skill",
      },
      work_hours: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "work_hours",
      },
      salary: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "salary",
      },
      contract: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "contract",
      },
      qualifications: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "qualifications",
      },
      desc: {
        type: Sequelize.STRING(1000),
        allowNull: false,
        field: "desc",
      },
      cat: {
        type: Sequelize.JSON(),
        allowNull: false,
        field: "cat",
      },
      dateStartPost: {
        type: Sequelize.DATE(),
        allowNull: false,
        defaultValue: Sequelize.NOW(),
        field: "dateStartPost",
      },
      dateEndPost: {
        type: Sequelize.DATE(),
        allowNull: false,
        field: "dateEndPost",
      },
    },
    {
      tableName: "posts_job",
    }
  );
  return posts_job;
};
