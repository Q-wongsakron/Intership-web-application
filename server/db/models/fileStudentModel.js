module.exports = (sequelize, Sequelize) => {
  const file_student = sequelize.define(
    "file_student",
    {
      file_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoInclement: true,
        field: "file_id",
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "name",
      },
      file_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "file_type",
      },
      file_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "file_url",
      },
    },
    {
      tableName: "file_student",
    }
  );
  return file_student;
};
