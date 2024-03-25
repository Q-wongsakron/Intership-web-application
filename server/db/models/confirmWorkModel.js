module.exports = (sequelize, Sequelize) => {
  const confirm = sequelize.define(
    "confirm",
    {
      confirm_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoInclement: true,
        field: "confirm_id",
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "position",
      },
      date_confirm: {
        type: Sequelize.DATE(),
        allowNull: false,
        defaultValue: Sequelize.NOW(),
        field: "date_confirm",
      },
      date_gen_doc:{
        type: Sequelize.DATE(),
        allowNull: true,
        field: "date_gen_doc",
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "status",
      },
      require_doc: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        field: "require_doc",
      },
      academic_year: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: "academic_year",
      }
    },
    {
      tableName: "confirm",
    }
  );
  return confirm;
};
