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
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "report_pdf",
        },
        date_upload_report_pdf: {
          type: Sequelize.DATE(),
          allowNull: true,
          defaultValue: Sequelize.NOW(),
          field: "date_upload_report_pdf",
        },
        
        report_docx: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "report_docx",
        },
        date_upload_report_docx: {
          type: Sequelize.DATE(),
          allowNull: true,
          defaultValue: Sequelize.NOW(),
          field: "date_upload_report_docx",
        },
        timestamp_pdf: {
          type: Sequelize.STRING(255),
          allowNull: true,
          field: "timestamp_pdf",
        },
        date_upload_timestamp_pdf: {
          type: Sequelize.DATE(),
          allowNull: true,
          defaultValue: Sequelize.NOW(),
          field: "date_upload_timestamp_pdf",
        },
        present_pdf: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: "present_pdf",
        },
        date_upload_present_pdf: {
          type: Sequelize.DATE(),
          allowNull: true,
          defaultValue: Sequelize.NOW(),
          field: "date_upload_present_pdf",
        },
        present_ppt: {
            type: Sequelize.STRING(255),
            allowNull: true,
            field: "present_ppt",
        },
        date_upload_present_ppt: {
            type: Sequelize.DATE(),
            allowNull: true,
            defaultValue: Sequelize.NOW(),
            field: "date_upload_present_ppt",
        },
          academic_year: {
            type: Sequelize.STRING(50),
            allowNull: false,
            field: "academic_year",
        }
      },
      {
        tableName: "document",
      }
    );
    return document;
  };
 
  