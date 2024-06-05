module.exports = (sequelize, Sequelize) => {
    const gen_document_self = sequelize.define(
      "gen_document_self",
      {
        gen_self_id: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          autoInclement: true,
          field: "gen_self_id",
        },
        doc_nonlicense: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "doc_nonlicense",
        },
        doc_nonlicense_courtesy: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "doc_nonlicense_courtesy",
        },
        doc_nonlicense_letter : {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "doc_nonlicense_letter",
        },
        courtesy_license: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "courtesy_license",
        },
        intern_letter: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "intern_letter",
        },
        date_gen: {
          type: Sequelize.DATE(),
          allowNull: false,
          defaultValue: Sequelize.NOW(),
          field: "date_gen",
        },
        academic_year: {
          type: Sequelize.STRING(50),
          allowNull: false,
          field: "academic_year",
        }
      },
      {
        tableName: "gen_document_self",
      }
    );
    return gen_document_self;
  };
  