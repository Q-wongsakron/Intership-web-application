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
      subdistrict: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "subdistrict",
      },
      district: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "district",
      },
      province: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "province",
      },

      pcode: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "pcode",
      },
      contact_email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "contact_email",
      },
      contact_tel: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "contact_tel",
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
      welfare: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: "welfare",
      },
      qualifications: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "qualifications",
      },
      desc: {
        type: Sequelize.TEXT(),
        allowNull: false,
        field: "desc",
      },
      other: {
        type: Sequelize.TEXT(),
        allowNull: true,
        field: "other",
      },
      cat: {
        type: Sequelize.JSON(),
        allowNull: false,
        field: "cat",
      },
      cat_values: {
        type: Sequelize.JSON(),
        allowNull: false,
        field: "cat_values",
      },
      count_values: {
        type: Sequelize.JSON(),
        allowNull: false,
        field: "count_values",
      },
      name_to: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "name_to",
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
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "status",
      }
    },
    {
      tableName: "posts_job",
    }
  );
  return posts_job;
};
