module.exports = (sequelize, Sequelize) => {
    const news = sequelize.define(
        "news",
        {
            news_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "news_id",
            },
            topic: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "topic",
            },
            detail: {
                type: Sequelize.TEXT(),
                allowNull: false,
                field: "detail",
            },
            cover_img: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "cover_img",
            },
            images: {
                type: Sequelize.STRING(255),
                allowNull: true,
                field: "images",
            },
            postedTime: {
                type: Sequelize.DATE(),
                allowNull: false,
                defaultValue: Sequelize.NOW(),
                field: "postedTime"
            }
        },
        {
            tableName:"news",
        }
    );
    return news;
}