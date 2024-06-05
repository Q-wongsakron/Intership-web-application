module.exports = (sequelize, Sequelize) => {
    const self_enroll = sequelize.define(
        "self_enroll",
        {
            self_enroll_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "self_enroll_id",
            },
            company_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "company_name",
            },
            company_address: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "company_address",
            },
            to_who:{
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "to_who",
            },
            tel:{
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "tel",
            },
            email:{
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "email",
            },
            date_enroll:{
                type: Sequelize.DATE(),
                allowNull: false,
                defaultValue: Sequelize.NOW(),
                field: "date_enroll",
            },
            date_gen_doc:{
                type: Sequelize.DATE(),
                allowNull: true,
                field: "date_gen_doc",
              },
            displayname_th:{
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "displayname_th",
            },
            require_doc:{
                type: Sequelize.INTEGER(11),
                allowNull: false,
                field: "require_doc",
            },
            print:{
                type: Sequelize.INTEGER(10),
                allowNull: true,
                field: "print",
            },
            status:{
                type: Sequelize.STRING(100),
                allowNull: true,
                field: "status",
            },
            academic_year: {
                type: Sequelize.STRING(50),
                allowNull: false,
                field: "academic_year",
              }
        },
        {
            tableName:"self_enroll",
        }
    );
    return self_enroll;
}