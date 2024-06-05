module.exports = (sequelize, Sequelize) => {
    const reset_tokens = sequelize.define(
        "reset_tokens",
        {
            token: {
                type: Sequelize.STRING(255),
                primaryKey: true,
                field: "token",
            },
            created_at: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "created_at",
            },
            expires_at: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "expires_at",
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                field: "user_id",
            },

        },
        {
            tableName:"reset_tokens",
        }
    );
    return reset_tokens;
}