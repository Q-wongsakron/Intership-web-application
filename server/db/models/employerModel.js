module.exports = (sequelize, Sequelize) => {
  const employer = sequelize.define(
    "employer",
    {
      employer_id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoInclement: true,
        field: "employer_id",
      },
      username: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "username",
      },
      email : {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: "email",
      },
      
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "password",
      },
      company_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "company_name",
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "address",
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
      contact_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: "contact_name",
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
      about: {
        type: Sequelize.TEXT(),
        allowNull: true,
        field: "about",
      },
      company_pic: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: "company_pic",
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "notverify",
        field: "status",
      },
      verified : {
        type: Sequelize.BOOLEAN(),
        allowNull: false,
        defaultValue: false,
        field: "verified",
      },

      role: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "employer",
        field: "role",
      },
    },
    {
      tableName: "employer",
    }
  );
  return employer;
};
