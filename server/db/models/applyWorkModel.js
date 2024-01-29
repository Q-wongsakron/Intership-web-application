module.exports = (sequelize, Sequelize) => {
  const apply = sequelize.define(
    "apply",
    {
      apply_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoInclement: true,
        field: "apply_id",
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "position",
      },
      date: {
        type: Sequelize.DATE(),
        allowNull: false,
        defaultValue: Sequelize.NOW(),
        field: "date",
      },
    },
    {
      tableName: "apply",
    }
  );
  return apply;
};
