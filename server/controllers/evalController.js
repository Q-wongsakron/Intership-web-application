const db = require("../db/index");
require('dotenv').config()
const { student, std_eval, self_enroll, confirm, employer, emp_question, emp_eval} = db;
const {findYear} = require("./authController");
db.sequelize.sync();

// Student Evaluation
exports.createStdEval = async (req, res) => {
	try {
		const semesterYear = await findYear(req,res);
		const {
			email,
			std_id,
			displayname_th,
			std_year,
			department,
			//ดึงมาใส่เลยให้นักศึกษาล็อกอิน
			company_name, // มี
			company_address, //มี
			company_tel, //มี
			company_fax,
			company_business_type,
			std_task,
			//ส่วนประเมินคะแนน
			q1,
			q2,
			q3,
			q4,
			q5,
			q6,
			q7,
			q8,
			other_comment,
			} = req.body.formData

		// const findStd = await student.findOne({
		// 	where: { std_id : req.user.username }
		// })
		// const findSelfEnroll = await self_enroll.findOne({
		// 	where: { std_id : req.user.username, academic_year : semesterYear }
		// })
		// const findConfirm = await confirm.findOne({
		// 	where: { std_id : req.user.username, academic_year : semesterYear  },
		// 	include: [
        //         {
        //             model: employer,
        //         }
        //     ]
		// })

		const findStdEval = await std_eval.findOne({
			where: { std_id : req.user.username, academic_year : semesterYear  }
		})
		// เเบบเเก้ได้เเต่ใช้ค่าจาก front end
		if(!findStdEval){
			const updateStatus = await student.update({
				std_eval : 1
			},{where : {std_id : std_id}})

			console.log(updateStatus)
			const createEval = await std_eval.create({
				email : email,
				std_id : std_id,
				displayname_th : displayname_th,
				std_year : std_year,
				department : department,
				//ดึงมาใส่เลยให้นักศึกษาล็อกอิน
				company_name : company_name, // มี
				company_address : company_address, //มี
				company_tel : company_tel, //มี
				company_fax : company_fax,
				company_business_type : company_business_type,
				std_task : std_task,
				//ส่วนประเมินคะเเนน
				org_coop : q1,
				work_safety : q2,
				assign_workload : q3,
				guide_concern : q4,
				prior_knowledge : q5,
				apply_knowledge : q6,
				benefit_intern :q7,
				future_placement : q8,
				comments : other_comment,
				academic_year : semesterYear,
				});

				res.status(200).json({ message: "ประเมินฝึกงานสำเร็จ ขอบคุณ" });
			}

			else{
				res.status(400).json({ message: "คุณเคยกรอกเเบบประเมินเเล้ว กรุณาติดต่อภาควิชา" });
			}
		
		//เเบบเเก้ไม่ได้
		// if(findSelfEnroll){
		// 	if(!findStdEval){
		// 		const createEval = await std_eval.create({
		// 			email: findStd.email,
		// 			std_id: findStd.std_id,
		// 			std_name: findStd.displayname_th,
		// 			place_name : findSelfEnroll.company_name,
		// 			place_address : findSelfEnroll.company_address,
		// 			phone : findSelfEnroll.tel,
		// 			fax,
		// 			type_job,
		// 			job_desc,
		// 			org_coop,
		// 			work_safety,
		// 			assign_workload,
		// 			guide_concern,
		// 			prior_knowledge,
		// 			apply_knowledge,
		// 			future_placement,
		// 			comments,
		// 			academic_year : semesterYear,
		// 		});
		// 		res.status(200).send("create succress");
		// 	}
		// 		else{
		// 			res.status(400).send("used to create");
		// 		}
		// }else if(findConfirm){
		// 	if(!findStdEval){
		// 		const createEval = await std_eval.create({
		// 			email: findStd.email,
		// 			std_id: findStd.std_id,
		// 			std_name: findStd.displayname_th,
		// 			place_name : findConfirm.employer.company_name,
		// 			place_address : findConfirm.employer.address,
		// 			phone : findConfirm.employer.contact_tel,
		// 			fax,
		// 			type_job,
		// 			job_desc,
		// 			org_coop,
		// 			work_safety,
		// 			assign_workload,
		// 			guide_concern,
		// 			prior_knowledge,
		// 			apply_knowledge,
		// 			future_placement,
		// 			comments,
		// 			academic_year: semesterYear
		// 		});
		// 		res.status(200).send("create succress");
		// 	}
		// 	else{
		// 		res.status(400).send("used to create");
		// 	}
		// }else{
		// 	res.status(400).send("please application work");
		// }
	
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Server Error" });
	}
};

exports.findStdEval = async(req,res) => {
	try{
		const listStdEval = await std_eval.findOne({
			where: { std_id : req.user.username }
		})
		res.status(200).json(listStdEval)
	}catch(err){
		console.error(err)
        res.status(500).json({message: "server error"})
	}
	
}

exports.emQuestionnair = async(req,res) => {
	try{

		const semesterYear = await findYear(req,res);
		const {
			email,
			questionnaire_q1,
			questionnaire_q2,
			questionnaire_q3_1,
			questionnaire_q3_2,

		} = req.body.formData

		const createEmQuestion = await emp_question.create({
			email : email,
            additional_courses : questionnaire_q1,
            important_student_traits : questionnaire_q2,
            outstanding_traits_students : questionnaire_q3_1,
            improvement_students : questionnaire_q3_2,
            academic_year : semesterYear,
		})

		res.status(200).json({message: "Create Succress Thanks You"})

	}catch(err){
		console.error(err)
        res.status(500).json({message: "Server Error"})
	}
}

// exports.emCreateEval = async(req,res) =>{
// 	try{
// 		const semesterYear = await findYear(req,res);
// 		const {
// 			email,
// 			company_name,
// 			address,
// 			supervisor_name,
// 			position,
// 			phone,
// 			fax,
// 			intern_full_name,
// 			std_id,
// 			major,
// 			intern_job_description,
// 			start_internship_date,
// 			end_internship_date,
// 			is_std_pass,
// 		} = req.body.formData
		
// 		const findEmpEval = await emp_eval.findOne({
// 			where: { std_id : std_id, academic_year : semesterYear  }
// 		})
// 		// เเบบเเก้ได้เเต่ใช้ค่าจาก front end
// 		if(!findEmpEval){

// 			let std_pass
// 			if (is_std_pass === 1){
// 				std_pass = "ผ่าน"
// 			}else{
// 				std_pass = "ไม่ผ่าน"
// 			}
// 			const updateStatus = await student.update({
// 				emp_eval : std_pass
// 			},{where : {std_id : std_id}})
// 			const createEmEval = await emp_eval.create({
// 				email : email,
// 				company_name : company_name,
// 				address : address,
// 				supervisor_name : supervisor_name,
// 				position : position,
// 				phone : phone,
// 				fax : fax,
// 				intern_full_name : intern_full_name,
// 				std_id : std_id,
// 				major : major,
// 				intern_job_description : intern_job_description,
				
// 				start_internship_date : start_internship_date,
// 				end_internship_date : end_internship_date,
// 				student_evaluation : std_pass, // ผ่านไม่ผ่าน
			

// 				academic_year : semesterYear,
// 			})
// 			res.status(200).json({ message: "ประเมินฝึกงานสำเร็จ ขอบคุณ" });
// 		}
// 		else
// 		{
// 			res.status(400).json({ message: "คุณเคยกรอกเเบบประเมินเเล้ว กรุณาติดต่อภาควิชา" });
// 		}
	
// 	}catch(err){
// 		console.error(err)
//         res.status(500).json({message: "Server Error"})
// 	}
// }
exports.emCreateEval = async (req, res) => {
    try {
        const semesterYear = await findYear(req, res);
        const {
            email,
            company_name,
            company_address,
            mentor_name,
            mentor_position,
            company_tel,
            company_fax,
            displayname_th,
            std_id,
            std_task,
            dateStartIntern,
            dateEndIntern,
            is_std_pass,
            character_questions,
            knowledge_questions,
            attitude_questions,
            work_ability_questions,
            other_radio_questions,
        } = req.body.formData;

        const findEmpEval = await emp_eval.findOne({
            where: { std_id: std_id, academic_year: semesterYear }
        });

        if (!findEmpEval) {
            let std_pass = is_std_pass === 1 ? "ผ่าน" : "ไม่ผ่าน";

            await student.update({
                emp_eval: std_pass
            }, { where: { std_id: std_id } });

            const createEmEval = await emp_eval.create({
                email: email,
                company_name: company_name,
                address: company_address,
                supervisor_name: mentor_name,
                position: mentor_position,
                phone: company_tel,
                fax: company_fax,
                intern_full_name: displayname_th,
                std_id: std_id,
                major: "Unknown", // Adjust as necessary
                intern_job_description: std_task,
                start_internship_date: dateStartIntern,
                end_internship_date: dateEndIntern,
                student_evaluation: std_pass,
                academic_year: semesterYear,
                character_questions: JSON.stringify(character_questions),
                knowledge_questions: JSON.stringify(knowledge_questions),
                attitude_questions: JSON.stringify(attitude_questions),
                work_ability_questions: JSON.stringify(work_ability_questions),
                other_radio_questions: JSON.stringify(other_radio_questions)
            });

            res.status(200).json({ message: "ประเมินฝึกงานสำเร็จ ขอบคุณ" });
        } else {
            res.status(400).json({ message: "คุณเคยกรอกเเบบประเมินเเล้ว กรุณาติดต่อภาควิชา" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};



exports.listStdEval = async(req,res) => {
	try{
		const listStdEval = await std_eval.findAll(
		)
		res.status(200).json(listStdEval)
	}catch(err){
		console.error(err)
        res.status(500).json({message: "server error"})
	}
	
}

exports.listEmpEval = async(req,res) => {
	try{
		const listEmpEval = await emp_eval.findAll(
		)
		res.status(200).json(listEmpEval)
	}catch(err){
		console.error(err)
        res.status(500).json({message: "server error"})
	}
	
}

exports.listEmpQuesEval = async(req,res) => {
	try{
		const listEmpQuesEval = await emp_question.findAll(
		)
		res.status(200).json(listEmpQuesEval)
	}catch(err){
		console.error(err)
        res.status(500).json({message: "server error"})
	}
	
}