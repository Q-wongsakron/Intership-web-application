module.exports = (sequelize, Sequelize) => {
    const schedule = sequelize.define(
        "schedule",
        {
            schedule_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "schedule_id",
            },
            detail: {
                type: Sequelize.TEXT(),
                allowNull: false,
                field: "detail",
            },

        },
        {
            tableName:"schedule",
        }
    );
    return schedule;
}