module.exports = (sequelize, Sequelize) => {
    const employee_tu = sequelize.define(
      "employee_tu",
      {
        emp_tu_id: {
          type: Sequelize.STRING(100),
          primaryKey: true,
          autoIncrement: false,
          field: "emp_tu_id",
        },
        displayname_th: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "displayname_th",
        },

        displayname_en: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "displayname_en",
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "email",
        },
        department: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "department",
        },
        organization: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "organization",
        },
        role: {
          type: Sequelize.STRING(55),
          allowNull: false,
          field: "role",
        },

      },
      {
        tableName: "employee_tu",
      }
    );
    return employee_tu;
  };
  
  