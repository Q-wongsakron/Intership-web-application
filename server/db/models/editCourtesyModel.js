module.exports = (sequelize, Sequelize) => {
    const edit_courtesy = sequelize.define(
      "edit_courtesy",
      {
        edit_id: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          autoInclement: true,
          field: "edit_id",
        },
        number_courtesy: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "number_courtesy",
        },
        number_letter: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "number_letter",
        },
        date: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "date",
        },
        name_to: {
          type: Sequelize.STRING(100),
          allowNull: false,
          field: "name_to",
        },
      },
      {
        tableName: "edit_courtesy",
      }
    );
    return edit_courtesy;
  };
  