module.exports = (sequelize, Sequelize) => {
    const emp_question = sequelize.define(
        "emp_question",
        {
            emp_question_id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                autoInclement: true,
                field: "emp_question_id",
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: "email",
            },
            additional_courses: {
                type: Sequelize.TEXT(),
                allowNull: true,
                field: "additional_courses",
            },
            important_student_traits: {
                type: Sequelize.TEXT(),
                allowNull: true,
                field: "important_student_traits",
            },
            outstanding_traits_students: {
                type: Sequelize.TEXT(),
                allowNull: true,
                field: "outstanding_traits_students",
            },
            improvement_students: {
                type: Sequelize.TEXT(),
                allowNull: true,
                field: "improvement_students",
            },
            academic_year:{
                type: Sequelize.STRING(50),
                allowNull: false,
                field: "academic_year",
            }
        },
        {
            tableName:"emp_question",
        }
    );
    return emp_question;
}