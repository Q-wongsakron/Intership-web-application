module.exports = (sequelize, Sequelize) => {
    const emp_eval = sequelize.define(
      "emp_eval",
      {
        emp_eval_id: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          autoIncrement: true,
          field: "emp_eval_id",
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          field: "email",
        },
        company_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "company_name",
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "address",
        },
        supervisor_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "supervisor_name",
        },
        position: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "position",
        },
        phone: {
          type: Sequelize.STRING(20),
          allowNull: true,
          field: "phone",
        },
        fax: {
          type: Sequelize.STRING(20),
          allowNull: true,
          field: "fax",
        },
        intern_full_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "intern_full_name",
        },
        std_id: {
          type: Sequelize.STRING(20),
          allowNull: true,
          field: "std_id",
        },
        major: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "major",
        },
        intern_job_description: {
          type: Sequelize.TEXT(),
          allowNull: true,
          field: "intern_job_description",
        },

        start_internship_date: {
          type: Sequelize.DATE,
          allowNull: true,
          field: "start_internship_date",
        },
        end_internship_date: {
          type: Sequelize.DATE,
          allowNull: true,
          field: "end_internship_date",
        },
        student_evaluation: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "student_evaluation",
        },
        character_questions: {
          type: Sequelize.JSON(),
          allowNull: true,
          field: "character_questions",
        },
        knowledge_questions: {
          type: Sequelize.JSON(),
          allowNull: true,
          field: "knowledge_questions",
        },
        attitude_questions: {
          type: Sequelize.JSON(),
          allowNull: true,
          field: "attitude_questions",
        },
        work_ability_questions: {
          type: Sequelize.JSON(),
          allowNull: true,
          field: "work_ability_questions",
        },
        other_radio_questions: {
          type: Sequelize.JSON(),
          allowNull: true,
          field: "other_radio_questions",
        },
        academic_year:{
            type: Sequelize.STRING(20),
            allowNull: false,
            field: "academic_year",
        }
      },
      {
        tableName: "emp_eval",
      }
    );
    return emp_eval;
  };
  