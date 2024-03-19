module.exports = (sequelize, Sequelize) => {
    const document = sequelize.define(
      "document",
      {
        doc_id: {
          type: Sequelize.INTEGER(11),
          primaryKey: true,
          autoInclement: true,
          field: "doc_id",
        },
        report_pdf: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "report_pdf",
        },
        report_docx: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "report_docx",
        },
        timestamp_pdf: {
          type: Sequelize.STRING(100),
          allowNull: true,
          field: "timestamp_pdf",
        },
        present_pdf: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: "present_pdf",
        },
        present_ppt: {
            type: Sequelize.STRING(100),
            allowNull: true,
            field: "present_pdf",
        },
        date_upload: {
            type: Sequelize.DATE(),
            allowNull: false,
            defaultValue: Sequelize.NOW(),
            field: "date_upload",
          },
      },
      {
        tableName: "document",
      }
    );
    return document;
  };
 
  