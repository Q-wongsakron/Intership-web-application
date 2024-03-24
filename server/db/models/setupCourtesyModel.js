module.exports = (sequelize, Sequelize) => {
    const setup_courtesy = sequelize.define(
        "setup_courtesy",
        {
            id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "id",
            },
            start_date: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "start_date",
            },
            end_date: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "end_date",
            },
            end_date_year: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "end_date_year",
            },
            head_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                field: "head_name",
            },
            signature_img:{
                type: Sequelize.STRING(100),
                allowNull: true,
                field: "signature_img",
            }
        },
        {
            tableName:"setup_courtesy",
        }
    );
    return setup_courtesy;
}