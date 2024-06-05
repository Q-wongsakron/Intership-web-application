module.exports = (sequelize, Sequelize) => {
    const std_eval = sequelize.define(
        "std_eval",
        {
            std_eval_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "std_eval_id",
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "email",
            },
            std_id: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "std_id",
            },
            displayname_th: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "displayname_th",
            },
            std_year: {
                type: Sequelize.STRING(50),
                allowNull: false,
                field: "std_year",
            },
            department: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "department",
            },
            company_name : {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "company_name",
            },
            company_address: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "company_address",
            },
            company_tel: {
                type: Sequelize.STRING(20),
                allowNull: true,
                field: "company_tel",
            },
            company_fax: {
                type: Sequelize.STRING(20),
                allowNull: true,
                field: "company_fax",
            },
            company_business_type: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "company_business_type",
            },
            std_task:{
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "std_task",
            },
            org_coop:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "org_coop",
            },
            work_safety:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "work_safety",
            },
            assign_workload:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "assign_workload",
            },
            guide_concern:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "guide_concern",
            },
            prior_knowledge:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "prior_knowledge",
            },
            apply_knowledge:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "apply_knowledge",
            },
            future_placement:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "future_placement",
            },
            benefit_intern:{
                type: Sequelize.INTEGER(11),
                allowNull: true,
                field: "benefit_intern",
            },
            comments:{
                type: Sequelize.TEXT(),
                allowNull: true,
                field: "comments",
            },
            academic_year:{
                type: Sequelize.STRING(50),
                allowNull: false,
                field: "academic_year",
            }
            
        },
        {
            tableName:"std_eval",
        }
    );
    return std_eval;
}