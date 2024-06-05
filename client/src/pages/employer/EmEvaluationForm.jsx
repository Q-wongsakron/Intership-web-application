import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import { getEmployerProfile } from "../../services/user.service";
import axios from "axios";

function EmEvaluationForm() {
	const [apiResponse, setApiResponse] = useState(null);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

	const branches = [
		"ไฟฟ้ากำลัง",
		"ไฟฟ้าสื่อสาร",
		"ไฟฟ้าอิเล็คทรอนิกส์",
		"คอมพิวเตอร์",
		"อื่น ๆ",
	]; // ยังไม่ได้ใช้

	const defaultChoices = ["5", "4", "3", "2", "1", "0"];
	const questionCategories = [
		{ value: "character_questions", label: "อุปนิสัย" },
		{
			value: "knowledge_questions",
			label: "ความรู้และทักษะ",
		},
		{ value: "attitude_questions", label: "ทัศนคติ" },
		{ value: "work_ability_questions", label: "ความสามารถในการปฏิบัติงาน" },
		{ value: "other_radio_questions", label: "คำถามอื่น ๆ" },
	];

	const characterQuestions = [
		{
			question: "ก. การแต่งกาย",
			answers: defaultChoices,
		},
		{
			question: "ข. การตรงต่อเวลา",
			answers: defaultChoices,
		},
		{
			question: "ค. กิริยามารยาท",
			answers: defaultChoices,
		},
		{
			question: "ง. บุคลิกภาพ",
			answers: defaultChoices,
		},
		{
			question: "จ. มนุษย์สัมพันธ์",
			answers: defaultChoices,
		},
		{
			question: "ฉ. การควบคุมอารมณ์",
			answers: defaultChoices,
		},
		{
			question: "ช. การรับฟังความคิดเห็นของผู้อื่น",
			answers: defaultChoices,
		},
	];
	const knowledgeQuestions = [
		{
			question: "ก. มีความรู้พื้นฐานในการทำงาน",
			answers: defaultChoices,
		},
		{
			question: "ข. ความละเอียดรอบคอบ",
			answers: defaultChoices,
		},
		{
			question: "ค. ความปลอดภัยในการทำงาน",
			answers: defaultChoices,
		},
		{
			question: "ง. ความคิดริเริ่มสร้างสรรค์",
			answers: defaultChoices,
		},
		{
			question: "จ. การแก้ไขปัญหาเฉพาะหน้า",
			answers: defaultChoices,
		},
		{
			question: "ฉ. คุณภาพของงาน",
			answers: defaultChoices,
		},
		{
			question: "ช. สื่อสารอย่างชัดเจน",
			answers: defaultChoices,
		},
		{
			question: "ซ. คิดอย่างเป็นระบบและการตัดสินใจ",
			answers: defaultChoices,
		},
	];
	const attitudeQuestions = [
		{
			question: "ก. ความรับผิดชอบในหน้าที่",
			answers: defaultChoices,
		},
		{
			question: "ข. ความซื่อสัตย์",
			answers: defaultChoices,
		},
		{
			question: "ค. ความอดทน",
			answers: defaultChoices,
		},
		{
			question: "ง. ความกระตือรือร้น",
			answers: defaultChoices,
		},
		{
			question: "จ. การให้ความร่วมมือ",
			answers: defaultChoices,
		},
		{
			question: "ฉ. ความมั่นใจในการทำงาน",
			answers: defaultChoices,
		},
		{
			question: "ช. ความเป็นผู้นำ",
			answers: defaultChoices,
		},
		{
			question: "ซ. การทำงานร่วมกับผู้อื่น",
			answers: defaultChoices,
		},
	];
	const workAbilityChoices = ["0", "1", "2", "3", "4", "5"];
	const workAbilityQuestions = [
		{
			question: "1. สามารถระบุปัญหา สร้างกระบวนการในการแก้ปัญหาทางวิศวกรรมได้",
			answers: workAbilityChoices,
		},
		{
			question:
				"2. สามารถประยุกต์ใช้ความรู้ ด้านคณิตศาสตร์ วิทยาศาสตร์ และ วิศวกรรม ได้",
			answers: workAbilityChoices,
		},
		{
			question: "3. สามารถแก้ปัญหาทางวิศวกรรม ออกแบบ  วิเคราะห์ข้อมูลได้",
			answers: workAbilityChoices,
		},
		{
			question:
				"4. นักศึกษาสามารถทำงานหรือแก้ปัญหาภายใต้ ข้อจำกัดเช่น ด้านงบประมาณ มาตรฐานความปลอดภัย สิ่งแวดล้อม",
			answers: workAbilityChoices,
		},
		{
			question: "5. สามารถแสวงหาองค์ความรู้ใหม่ด้วยตนเอง",
			answers: workAbilityChoices,
		},
	];
	const otherRadioQuestions = [
		{
			question:
				"ก. มาตรฐานความรู้ ความสามารถของนักศึกษาโดยรวม เมื่อเปรียบเทียบกับนักศึกษาจากมหาวิทยาลัยอื่น",
			answers: [
				"ด้อยกว่ามหาวิทยาลัยอื่น",
				"มีมาตรฐานเท่ากัน",
				"ค่อนข้างดีกว่า",
			],
		},
		{
			question:
				"ข. การบรรจุเป็นพนักงานประจำในหน่วยงานของท่าน ท่านเห็นว่านักศึกษาผู้นี้",
			answers: ["มีคุณสมบัติเหมาะสม", "ไม่เหมาะสม"],
		},
		{
			question: "หากในข้อ ข.ไม่เหมาะสม กรุณากรอกเหตุผล",
			answers: [],
		},
		{
			question: "ค. ระยะเวลาฝึกงานเมื่อเทียบกับลักษณะงานที่ฝึก",
			answers: ["เหมาะสม", "ไม่เหมาะสม"],
		},
		{
			question: "หากในข้อ ค.ไม่เหมาะสม กรุณากรอกเหตุผล",
			answers: [],
		},
		{
			question:
				"ง. การฝึกงานของนักศึกษาเป็นประโยชน์ต่อหน่วยงานของท่านหรือไม่ อย่างไร",
			answers: [],
		},
		{
			question:
				"จ. ท่านเห็นว่านักศึกษาควรจะมีความพร้อมและความรู้ในด้านใดบ้าง ก่อนที่จะเข้ารับการฝึกงาน (โปรดกรอกให้ละเอียด)",
			answers: [],
		},
		{
			question: "ฉ. ข้อเสนอแนะอื่น ๆ",
			answers: [],
		},
		{
			question: "ยินดีที่จะรับนักศึกษาเข้าร่วมฝึกงานในครั้งต่อไปหรือไม่",
			answers: ["รับ", "ไม่รับ"],
		},
		{
			question: "หากรับ ต้องการรับในจำนวนเท่าใด",
			answers: [],
		},
	];

	const [loading, setLoading] = useState(true);
	const [disabledFieldset, setDisabledFieldset] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [isFormDirty, setIsFormDirty] = useState(false);

	const navigate = useNavigate();

	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

	const fetchData = async (authtoken) => {
		try {
			const profileResponse = await getEmployerProfile(authtoken);

			if (profileResponse.data) {
				setFormData({
					...formData,
					email: profileResponse.data.profile.contact_email || "",
					company_name: profileResponse.data.profile.company_name || "",
					company_address: profileResponse.data.profile.address || "",
				});
			}

			const stdResponse = await axios.get(
				import.meta.env.VITE_APP_API + "/studentMornitor"
			);

			if (stdResponse.data) {
				setStudentData(
					stdResponse.data
						.filter((item) => item.emp_eval === "รอบริษัทประเมิน")
						.map((item) => ({
							std_id: item.std_id,
							displayname_th:
								item.name_title_th !== null
									? item.name_title_th + item.displayname_th
									: item.displayname_th,
						}))
				);
			}

			//// ของเก่าดึงจากตาราง Confirm (เฉพาะในระบบ) ////
			// const confirmRes = await axios.get(
			// 	import.meta.env.VITE_APP_API + "/allConfirm",
			// 	{
			// 		headers: {
			// 			authtoken: authtoken,
			// 		},
			// 	}
			// );
			// // console.log(confirmRes.data);

			// if (confirmRes.data) {
			// 	setFormData({
			// 		...formData,
			// 		email: confirmRes.data[0].employer.contact_email || "",
			// 		company_name: confirmRes.data[0].employer.company_name || "",
			// 		company_address: confirmRes.data[0].employer.address || "",
			// 		// std_id: confirmRes.data[0].std_id || "",
			// 		// displayname_th:
			// 		// 	confirmRes.data[0].student.name_title_th !== null
			// 		// 		? confirmRes.data[0].student.name_title_th +
			// 		// 		  confirmRes.data[0].student.displayname_th
			// 		// 		: confirmRes.data[0].student.displayname_th || "",
			// 	});
			// 	setStudentData(
			// 		confirmRes.data.map((item) => ({
			// 			std_id: item.std_id,
			// 			displayname_th:
			// 				item.student.name_title_th !== null
			// 					? item.student.name_title_th + item.student.displayname_th
			// 					: item.student.displayname_th,
			// 		}))
			// 	);
			// }

			// setDisabledFieldset(confirmRes.data ? false : true); // ถ้าไม่มี confirm data จะไม่สามารถทำแบบประเมินได้ เพราะยังไม่มี นศ. สมัครกับบริษัท
		} catch (error) {
			console.log(
				"Load data failed: ",
				error.response ? error.response.data : error.message
			);
			// setDisabledFieldset(error ? true : false); // ถ้าไม่มี confirm data จะไม่สามารถทำแบบประเมินได้ เพราะยังไม่มี นศ. สมัครกับบริษัท
		} finally {
			setLoading(false);
		}
	};

	const [studentData, setStudentData] = useState([]);
	const [selectedStdId, setSelectedStdId] = useState("");
	const [selectedStdName, setSelectedStdName] = useState("");

	const [formData, setFormData] = useState({
		character_questions: [],
		knowledge_questions: [],
		attitude_questions: [],
		work_ability_questions: [],
		other_radio_questions: [],
		is_std_pass: "",
		dateStartIntern: "",
		dateEndIntern: "",
	});
	const [errors, setErrors] = useState({});
	const [isPassErr, setIsPassErr] = useState("");

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;

		if (name === "std_id") {
			const stdId = studentData.filter((item) => item.std_id === value);
			setFormData({
				...formData,
				std_id: value,
				displayname_th: stdId.length > 0 ? stdId[0].displayname_th : "",
			});
		} else if (name === "displayname_th") {
			const displaynameTh = studentData.filter(
				(item) => item.displayname_th === value
			);
			setFormData({
				...formData,
				std_id: displaynameTh.length > 0 ? displaynameTh[0].std_id : "",
				displayname_th: value,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}

		// setFormData({
		// 	...formData,
		// 	[name]: value,
		// });
		setErrors({
			...errors,
			[name]: "",
		});
		setIsFormDirty(true);
	};
	const handleSelectInputChange = (newValue, actionMeta) => {
		if (actionMeta.name === "std_id") {
			const stdId = studentData.filter(
				(item) => item.std_id === newValue.value
			);
			setSelectedStdId(newValue);
			setSelectedStdName(
				stdId.length > 0
					? stdId.map((item) => {
							return {
								label: item.displayname_th,
								value: item.displayname_th,
							};
					  })
					: ""
			);
			setFormData({
				...formData,
				std_id: newValue.value,
				displayname_th: stdId.length > 0 ? stdId[0].displayname_th : "",
			});
		} else if (actionMeta.name === "displayname_th") {
			const displaynameTh = studentData.filter(
				(item) => item.displayname_th === newValue.value
			);
			setSelectedStdName(newValue);
			setSelectedStdId(
				displaynameTh.length > 0
					? displaynameTh.map((item) => {
							return {
								label: item.std_id,
								value: item.std_id,
							};
					  })
					: ""
			);
			setFormData({
				...formData,
				std_id: displaynameTh.length > 0 ? displaynameTh[0].std_id : "",
				displayname_th: newValue.value,
			});
		}
	};
	const handleRadioChange = (e, category) => {
		e.preventDefault();

		const { name, value } = e.target;

		setFormData({
			...formData,
			[category]: { ...formData[category], [name]: value },
		});
		setErrors({
			...errors,
			[name]: "",
		});
	};
	const handleStartInternChange = (date) => {
		let resetEndDate = "";
		if (date > formData.dateEndIntern) {
			resetEndDate = "";
		} else {
			resetEndDate = formData.dateEndIntern;
		}

		setFormData({
			...formData,
			dateStartIntern: date,
			dateEndIntern: resetEndDate,
		});
	};
	const handleEndInternChange = (date) => {
		setFormData({
			...formData,
			dateEndIntern: date,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// console.log(formData);

		const newRadioInputErrors = {};

		[
			characterQuestions,
			knowledgeQuestions,
			attitudeQuestions,
			workAbilityQuestions,
		].forEach((questions, categoryIndex) => {
			questions.forEach((question, questionIndex) => {
				const unanswered =
					!formData[questionCategories[categoryIndex].value][
						`${questionCategories[categoryIndex].value}_${questionIndex + 1}`
					];
				if (unanswered) {
					newRadioInputErrors[
						`${questionCategories[categoryIndex].value}_${questionIndex + 1}`
					] = "(กรุณาเลือกคำตอบ)";
				}
			});
		});
		// console.log(newRadioInputErrors);

		if (
			Object.keys(newRadioInputErrors).length > 0 ||
			formData.is_std_pass === ""
		) {
			if (formData.is_std_pass !== "") {
				setIsPassErr("");
			} else {
				setIsPassErr("กรุณาพิจารณานักศึกษา");
			}
			setErrors(newRadioInputErrors);
			setShowErrorModal(true);
		} else {
			setIsPassErr("");
			setShowModal(true);
		}
	};

	const handleConfirmSubmit = async () => {
		setLoading(true);
		setShowModal(false);
		try {
			//console.log(formData);
			const newEvaluation = await axios.post(
				import.meta.env.VITE_APP_API + "/emCreateEval",
				{ formData }
				// {
				// 	headers: {
				// 		authtoken: user.user.token,
				// 	},
				// }
			);
			setShowModal(false);
			setIsResponseModalOpen(true);
			setApiResponse(newEvaluation.data);
		} catch (error) {
			setApiResponse(error.response ? error.response.data : error.message);
			setIsResponseModalOpen(true);
			console.error(
				"Submit Failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ยืนยันการส่งแบบประเมิน</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="fw-bold">โปรดตรวจสอบความถูกต้องของข้อมูลก่อนกดยืนยัน</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={() => {
							handleConfirmSubmit();
						}}
					>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const ErrorModal = () => {
		return (
			<Modal
				show={showErrorModal}
				onHide={() => setShowErrorModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">กรุณาเลือกคำตอบให้ครบ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p className="fw-bold">
						โปรดตรวจสอบข้อที่จำเป็น (ที่มีเครื่องหมาย *)
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowErrorModal(false)}>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const ResponseModal = () => {
		return (
			<Modal
				show={isResponseModalOpen}
				onHide={() => {
					setIsResponseModalOpen(false);
					navigate("/employer/my-students");
				}}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						ยืนยันการส่งแบบประเมิน : ตอบกลับ
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{apiResponse ? <p>{apiResponse.message}</p> : <p>Loading...</p>}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							setIsResponseModalOpen(false);
							navigate("/employer/my-students");
						}}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const reactSelectStyles = {
		control: (provided) => ({
			...provided,
			border: "1px solid #e1e5e9",
			borderRadius: "6px",
			boxShadow: "none",
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isSelected
				? "#06b4e4"
				: state.isFocused
				? "#eeeeee"
				: "white",
			color: state.isSelected ? "white" : "black",
		}),
	};

	const isAnswerSelectedX = (
		questionIndex,
		answerIndex,
		cat_value,
		questions
	) => {
		const selectedAnswer =
			formData[cat_value][`${cat_value}_${questionIndex + 1}`];
		return selectedAnswer === questions[questionIndex].answers[answerIndex];
	};

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-2 p-md-4 container-card">
			<div className="d-flex justify-content-between">
				<h3 className="stdProfileTitle mb-3 fw-bold">
					แบบประเมินการฝึกงานนักศึกษา คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์
					(สำหรับบริษัท/หน่วยงาน)
				</h3>
			</div>

			{disabledFieldset && (
				<p className="my-2 fw-bold p-1 border border-warning rounded">
					<span className="text-danger">หมายเหตุ </span>{" "}
					<span className="text-black">
						ยังไม่สามารถทำแบบประเมินได้
						เนื่องจากยังไม่มีนักศึกษาที่ฝึกงานกับทางบริษัท/หน่วยงานของท่านหรือนักศึกษายังไม่เสร็จสิ้นการฝึกงาน
						หากมีข้อสงสัยกรุณาติดต่อภาควิชาฯ
					</span>
				</p>
			)}
			<form
				id="self-enroll-form"
				className="form-outline mb-4"
				onSubmit={handleSubmit}
			>
				<fieldset disabled={disabledFieldset}>
					<div className="px-md-2 pt-3">
						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">ข้อมูลสถานที่ฝึกงาน</p>
						</div>
						<div className="row">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="email" className="form-label fw-bold">
									อีเมล <span className="text-danger">*</span>
								</label>
								<input
									type="email"
									id="email"
									className="form-control mb-2"
									name="email"
									value={formData.email}
									placeholder="อีเมล"
									onChange={handleInputChange}
									maxLength={255}
									required
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-12">
								<label htmlFor="company_name" className="form-label fw-bold">
									ชื่อสถานที่ฝึกงาน <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="company_name"
									className="form-control mb-2"
									name="company_name"
									value={formData.company_name}
									placeholder="ชื่อสถานที่ฝึกงาน"
									onChange={handleInputChange}
									maxLength={255}
									required
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="company_address" className="form-label fw-bold">
									ที่อยู่สถานที่ฝึกงาน <span className="text-danger">*</span>
								</label>
								<textarea
									type="text"
									id="company_address"
									className="form-control mb-2"
									name="company_address"
									value={formData.company_address}
									placeholder="ที่อยู่สถานที่ฝึกงาน"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
									required
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-6">
								<label htmlFor="mentor_name" className="form-label fw-bold">
									ชื่อผู้ควบคุมการฝึกงาน <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="mentor_name"
									className="form-control mb-2"
									name="mentor_name"
									value={formData.mentor_name}
									placeholder="ชื่อ-นามสกุล"
									onChange={handleInputChange}
									maxLength={100}
									required
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="mentor_position" className="form-label fw-bold">
									ตำแหน่ง <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="mentor_position"
									className="form-control mb-2"
									name="mentor_position"
									value={formData.mentor_position}
									placeholder="ตำแหน่ง"
									onChange={handleInputChange}
									maxLength={10}
									required
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-6">
								<label htmlFor="company_tel" className="form-label fw-bold">
									เบอร์โทรศัพท์
								</label>
								<input
									type="text"
									id="company_tel"
									className="form-control mb-2"
									name="company_tel"
									value={formData.company_tel}
									placeholder="เบอร์โทรศัพท์"
									onChange={handleInputChange}
									maxLength={255}
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="company_fax" className="form-label fw-bold">
									โทรสาร
								</label>
								<input
									type="text"
									id="company_fax"
									className="form-control mb-2"
									name="company_fax"
									value={formData.company_fax}
									placeholder="โทรสาร"
									onChange={handleInputChange}
									maxLength={255}
								/>
							</div>
						</div>

						<br />

						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">
								ข้อมูลนักศึกษาที่ฝึกงาน (ทำประเมินทีละ 1 คน)
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-sm-6">
								<label htmlFor="displayname_th" className="form-label fw-bold">
									ชื่อ-นามสกุล นักศึกษาฝึกงาน{" "}
									<span className="text-danger">*</span>
								</label>
								{/* <input
									type="text"
									id="displayname_th"
									className="form-control mb-2"
									name="displayname_th"
									value={formData.displayname_th}
									placeholder="ชื่อ-นามสกุล"
									onChange={handleInputChange}
									maxLength={100}
									required
								/> */}
								{/* <input
									list="displayNameThList"
									type="text"
									id="displayname_th"
									className="form-control mb-2"
									name="displayname_th"
									value={formData.displayname_th}
									placeholder="ชื่อ-นามสกุล..."
									onChange={handleInputChange}
									maxLength={255}
									required
								/>
								<datalist id="displayNameThList">
									{studentData.map((item, index) => (
										<option key={index} value={item.displayname_th} />
									))}
								</datalist> */}
								<Select
									options={studentData.map((item) => {
										return {
											label: item.displayname_th,
											value: item.displayname_th,
										};
									})}
									value={selectedStdName}
									onChange={handleSelectInputChange}
									id="displayname_th"
									name="displayname_th"
									placeholder="ชื่อ-นามสกุล..."
									styles={reactSelectStyles}
									closeMenuOnSelect={true}
									required
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="std_id" className="form-label fw-bold">
									เลขทะเบียนนักศึกษา <span className="text-danger">*</span>
								</label>
								{/* <input
									type="text"
									id="std_id"
									className="form-control mb-2"
									name="std_id"
									value={formData.std_id}
									placeholder="เลขทะเบียนนักศึกษา"
									onChange={handleInputChange}
									maxLength={10}
									pattern="\d{10}"
									required
								/> */}
								{/* <select
									className={`form-select`}
									name="std_id"
									value={formData.std_id}
									onChange={handleInputChange}
								>
									{studentData.map((item, index) => (
										<option key={index} className="" value={item.std_id}>
											{item.std_id}
										</option>
									))}
								</select> */}
								{/* <input
									list="stdIdList"
									type="text"
									id="std_id"
									className="form-control mb-2"
									name="std_id"
									value={formData.std_id}
									placeholder="เลขทะเบียน..."
									onChange={handleInputChange}
									maxLength={10}
									pattern="\d{10}"
									required
								/>
								<datalist id="stdIdList">
									{studentData.map((item, index) => (
										<option key={index} value={item.std_id} />
									))}
								</datalist> */}
								<Select
									options={studentData.map((item) => {
										return {
											label: item.std_id,
											value: item.std_id,
										};
									})}
									value={selectedStdId}
									onChange={handleSelectInputChange}
									id="std_id"
									name="std_id"
									placeholder="เลขทะเบียน..."
									styles={reactSelectStyles}
									closeMenuOnSelect={true}
									required
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-6">
								<label htmlFor="std_branch" className="form-label fw-bold">
									สาขาวิชา <span className="text-danger">*</span>
								</label>
								<select
									className="form-select"
									id="std_branch"
									name="std_branch"
									value={formData.std_branch}
									onChange={handleInputChange}
									required
								>
									<option defaultValue="คอมพิวเตอร์">คอมพิวเตอร์</option>
								</select>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="std_year" className="form-label fw-bold">
									ชั้นปีที่ <span className="text-danger">*</span>
								</label>
								<select
									className="form-select"
									id="std_year"
									name="std_year"
									value={formData.std_year}
									onChange={handleInputChange}
									required
								>
									<option defaultValue="3">3</option>
									<option value="4">4</option>
									<option value="ปีสูง">ปีสูง</option>
								</select>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="std_task" className="form-label fw-bold">
									ลักษณะของงานที่นักศึกษา ได้รับการฝึกฝน{" "}
									<span className="text-danger">*</span>
								</label>
								<textarea
									type="text"
									id="std_task"
									className="form-control mb-2"
									name="std_task"
									value={formData.std_task}
									placeholder="ลักษณะของงานที่นักศึกษา ได้รับการฝึกฝน"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
									required
								/>
							</div>
						</div>

						<br />

						<section>
							<header>
								<div className="bg-dark p-2 mb-2 rounded-top">
									<p className="text-white fw-bold m-auto">
										โปรดประเมินการแสดงออกของนักศึกษาในด้านต่าง ๆ ดังต่อไปนี้
									</p>
								</div>
								<p className="p-2">
									0 = แย่มาก, 1 = ต้องปรับปรุง, 2 = พอใช้, 3 = ปานกลาง, 4 = ดี,
									5 = ดีมาก
								</p>
							</header>
							<RadioTypeQuestionV2
								template={1}
								cat_value={questionCategories[0].value}
								cat_label={questionCategories[0].label}
								questions={characterQuestions}
								formData={formData}
								onChange={(e) =>
									handleRadioChange(e, questionCategories[0].value)
								}
								errors={errors}
							/>
							<br />
							<RadioTypeQuestionV2
								template={1}
								cat_value={questionCategories[1].value}
								cat_label={questionCategories[1].label}
								questions={knowledgeQuestions}
								formData={formData}
								onChange={(e) =>
									handleRadioChange(e, questionCategories[1].value)
								}
								errors={errors}
							/>
							<br />
							<RadioTypeQuestionV2
								template={1}
								cat_value={questionCategories[2].value}
								cat_label={questionCategories[2].label}
								questions={attitudeQuestions}
								formData={formData}
								onChange={(e) =>
									handleRadioChange(e, questionCategories[2].value)
								}
								errors={errors}
							/>
						</section>

						<br />

						<section>
							<header>
								<div className="bg-dark p-2 mb-2 rounded-top">
									<p className="text-white fw-bold m-auto">
										ความสามารถในการปฏิบัติงาน
									</p>
								</div>
								<div className="p-2">
									<p className="m-auto">
										ในฐานะที่ท่านเป็นผู้ดูแลนักศึกษาที่อยู่ระหว่างการฝึกงาน
										ท่านมีความมั่นใจว่านักศึกษามีความสามารถในด้านต่าง ๆ
										ต่อไปนี้ในระดับใด
									</p>
									<p className="m-auto">
										0 = ไม่สามารถประเมินได้ และจาก 1 ถึง 5 โดย ระดับ 1 คือ
										ไม่มั่นใจ และ ระดับ 5 คือมั่นใจมาก
									</p>
								</div>
							</header>
							<RadioTypeQuestionV2
								template={2}
								// cat_value={"work_ability_questions"}
								cat_value={questionCategories[3].value}
								questions={workAbilityQuestions}
								formData={formData}
								onChange={(e) =>
									handleRadioChange(e, questionCategories[3].value)
								}
								errors={errors}
							/>
						</section>

						<br />

						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">
								บันทึกเวลาทำงานของนักศึกษา
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12">
								<label className="form-label fw-bold" htmlFor="dateStartIntern">
									เข้ารับการฝึกงานเมื่อ (ว/ด/ป){" "}
									<span className="text-danger">*</span>
								</label>
								<DatePicker
									id="dateStartIntern"
									selected={formData.dateStartIntern}
									onChange={handleStartInternChange}
									dateFormat="dd/MM/yyyy"
									className="form-control mb-2"
									name="dateStartIntern"
									required
								/>
							</div>
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label className="form-label fw-bold" htmlFor="dateEndIntern">
									สิ้นสุดการฝึกงานเมื่อ (ว/ด/ป){" "}
									<span className="text-danger">*</span>
								</label>
								<DatePicker
									id="dateEndIntern"
									selected={formData.dateEndIntern}
									onChange={handleEndInternChange}
									dateFormat="dd/MM/yyyy"
									className="form-control mb-2"
									name="dateEndIntern"
									minDate={new Date(formData.dateStartIntern)}
									required
								/>
							</div>
						</div>

						<div className="row mt-3 py-1 bg-light">
							<div className="col-sm-12">
								<p className="fw-bold mb-0">
									นักศึกษาผู้นี้ได้รับการพิจารณา{" "}
									<span className="text-danger">*</span>
								</p>
								<div className="form-check">
									<input
										className="form-check-input"
										type="radio"
										name="passIntern"
										id="passIntern"
										checked={formData["is_std_pass"] === 1}
										onChange={(e) => {
											setFormData({
												...formData,
												is_std_pass: e.target.checked ? 1 : 0,
											});
											setIsPassErr("");
										}}
									/>
									<label className="form-check-label" htmlFor="passIntern">
										ผ่านการฝึกงาน
									</label>
								</div>
								<div className="form-check">
									<input
										className="form-check-input"
										type="radio"
										name="notPassIntern"
										id="notPassIntern"
										checked={formData["is_std_pass"] === 0}
										onChange={(e) => {
											setFormData({
												...formData,
												is_std_pass: e.target.checked ? 0 : 1,
											});
											setIsPassErr("");
										}}
									/>
									<label className="form-check-label" htmlFor="notPassIntern">
										ไม่ผ่านการฝึกงาน
									</label>
								</div>
								{isPassErr !== "" && (
									<span className="text-danger">{isPassErr}</span>
								)}
							</div>
						</div>

						<br />

						<div className="bg-secondary p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">
								ความคิดเห็นและข้อเสนอแนะของผู้ความคุมการฝึกงาน (ถ้ามี)
							</p>
						</div>
						{/* <RadioTypeQuestionV2
							template={3}
							// cat_value={"other_radio_questions"}
							cat_value={questionCategories[4].value}
							questions={otherRadioQuestions}
							formData={formData}
							// onChange={(e) => handleRadioChange(e, "other_radio_questions")}
							onChange={(e) =>
								handleRadioChange(e, questionCategories[4].value)
							}
							errors={errors}
						/> */}
						{otherRadioQuestions.map((question, qIndex) => (
							<div key={qIndex} className="p-2">
								{question.answers.length !== 0 ? (
									<>
										<p className="fw-bold mb-0">{question.question}</p>
										{question.answers.map((answer, aIndex) => (
											<div key={aIndex} className="form-check">
												<input
													className="form-check-input"
													type="radio"
													name={`${questionCategories[4].value}_${qIndex + 1}`}
													id={`${questionCategories[4].value}_${
														qIndex + 1
													}_${aIndex}`}
													value={answer}
													checked={isAnswerSelectedX(
														qIndex,
														aIndex,
														questionCategories[4].value,
														otherRadioQuestions
													)}
													onChange={(e) => {
														setFormData({
															...formData,
															[questionCategories[4].value]: {
																...formData[questionCategories[4].value],
																[e.target.name]: e.target.value,
															},
														});
													}}
												/>
												<label
													className="form-check-label"
													htmlFor={`${questionCategories[4].value}_${
														qIndex + 1
													}_${aIndex}`}
												>
													{answer}
												</label>
											</div>
										))}
									</>
								) : (
									<>
										<label
											htmlFor={`${questionCategories[4].value}_${qIndex + 1}`}
											className="form-label fw-bold"
										>
											{question.question}
										</label>
										<textarea
											type="text"
											id={`${questionCategories[4].value}_${qIndex + 1}`}
											className="form-control mb-2"
											name={`${questionCategories[4].value}_${qIndex + 1}`}
											value={
												formData[questionCategories[4].value][
													`${questionCategories[4].value}_${qIndex + 1}`
												]
											}
											placeholder={question.question}
											onChange={(e) =>
												handleRadioChange(e, questionCategories[4].value)
											}
											rows={2}
										/>
									</>
								)}
							</div>
						))}
					</div>

					<br />
					<div className="d-flex justify-content-center">
						<button
							type="submit"
							form="self-enroll-form"
							className={`${btn.btn_blue} w-100`}
						>
							ยืนยัน
						</button>
					</div>
					{/* {disabledFieldset && (
						<p className="mt-2 mb-0 fw-bold">
							หมายเหตุ<span className="text-danger">*</span>{" "}
							ยังไม่มีนักศึกษาที่ฝึกงานกับทางบริษัท/หน่วยงานของท่านหรือนักศึกษายังไม่เสร็จสิ้นการฝึกงาน
							หากมีข้อสงสัยกรุณาติดต่อภาควิชาฯ
						</p>
					)} */}
				</fieldset>
			</form>

			<ConfirmModal />
			<ResponseModal />
			<ErrorModal />
		</div>
	);

	function RadioTypeQuestionV2({
		template,
		cat_value,
		cat_label,
		questions,
		onChange,
		formData,
		errors,
	}) {
		const isAnswerSelected = (questionIndex, answerIndex) => {
			const selectedAnswer =
				formData[cat_value][`${cat_value}_${questionIndex + 1}`];
			return selectedAnswer === questions[questionIndex].answers[answerIndex];
		};

		let content;
		if (template === 1) {
			content = (
				<>
					<div className="container border rounded">
						<div className="row py-2 bg-light rounded-top fw-bold">
							<div className="col-6 pe-1">
								{cat_label} <span className="text-danger">*</span>
							</div>
							<div className="col-1 ps-1">5</div>
							<div className="col-1 ps-1">4</div>
							<div className="col-1 ps-1">3</div>
							<div className="col-1 ps-1">2</div>
							<div className="col-1 ps-1">1</div>
							<div className="col-1 ps-1">0</div>
						</div>
						{questions.map((question, qIndex) => (
							<div className="row py-2 border-top" key={qIndex}>
								<div className="col-6 pe-1">{question.question}</div>
								{question.answers.map((answer, aIndex) => (
									<div className="col-1 ps-0" key={aIndex}>
										<div className="form-check form-check-inline">
											<input
												className="form-check-input"
												type="radio"
												name={`${cat_value}_${qIndex + 1}`}
												value={answer}
												onChange={onChange}
												checked={isAnswerSelected(qIndex, aIndex)}
											/>
										</div>
									</div>
								))}
								{errors[`${cat_value}_${qIndex + 1}`] && (
									<span className="text-danger">
										{errors[`${cat_value}_${qIndex + 1}`]}
									</span>
								)}
							</div>
						))}
					</div>
				</>
			);
		} else if (template === 2) {
			content = (
				<>
					{questions.map((question, qIndex) => (
						<div key={qIndex} className="p-2">
							<p className="fw-bold mb-0">
								{question.question} <span className="text-danger">*</span>
							</p>
							{question.answers.map((answer, aIndex) => (
								<div key={aIndex} className="form-check form-check-inline">
									<input
										className="form-check-input"
										type="radio"
										name={`${cat_value}_${qIndex + 1}`}
										id={`${cat_value}_${qIndex + 1}_${aIndex}`}
										value={answer}
										onChange={onChange}
										checked={isAnswerSelected(qIndex, aIndex)}
									/>
									<label
										className="form-check-label"
										htmlFor={`${cat_value}_${qIndex + 1}_${aIndex}`}
									>
										{answer}
									</label>
								</div>
							))}
							{/* {errors[`q${qIndex + 1}`] && (
                                <span className="text-danger">{errors[`q${qIndex + 1}`]}</span>
                            )} */}
							{errors[`${cat_value}_${qIndex + 1}`] && (
								<span className="text-danger">
									{errors[`${cat_value}_${qIndex + 1}`]}
								</span>
							)}
						</div>
					))}
				</>
			);
		} else if (template === 3) {
			content = (
				<>
					{questions.map((question, qIndex) => (
						<div key={qIndex} className="p-2">
							{question.answers.length !== 0 ? (
								<>
									<p className="fw-bold mb-0">{question.question}</p>
									{question.answers.map((answer, aIndex) => (
										<div key={aIndex} className="form-check">
											<input
												className="form-check-input"
												type="radio"
												name={`${cat_value}_${qIndex + 1}`}
												id={`${cat_value}_${qIndex + 1}_${aIndex}`}
												value={answer}
												onChange={onChange}
												checked={isAnswerSelected(qIndex, aIndex)}
											/>
											<label
												className="form-check-label"
												htmlFor={`${cat_value}_${qIndex + 1}_${aIndex}`}
											>
												{answer}
											</label>
										</div>
									))}
								</>
							) : (
								<>
									<label
										htmlFor={`${cat_value}_${qIndex + 1}`}
										className="form-label fw-bold"
									>
										{question.question}
									</label>
									<textarea
										type="text"
										id={`${cat_value}_${qIndex + 1}`}
										className="form-control mb-2"
										name={`${cat_value}_${qIndex + 1}`}
										value={formData[cat_value][`${cat_value}_${qIndex + 1}`]}
										placeholder={question.question}
										onChange={onChange}
										rows={2}
										// maxLength={255}
									/>
								</>
							)}
						</div>
					))}
				</>
			);
		}
		return content;
	}

	function JustWantToKeepIt() {
		const content = (
			<>
				<div className="table-responsive text-nowrap">
					<table className="table">
						<thead className="table-light">
							<tr className="table-white">
								<th scope="col">{cat_label}</th>
								<th scope="col">4</th>
								<th scope="col">3</th>
								<th scope="col">2</th>
								<th scope="col">1</th>
								<th scope="col">0</th>
								<th scope="col">x</th>
							</tr>
						</thead>
						<tbody className="table-group-divider">
							{questions.map((question, qIndex) => (
								<tr key={qIndex}>
									<td>{question.question}</td>
									{question.answers.map((answer, aIndex) => (
										<td key={aIndex}>
											<div className="form-check form-check-inline">
												<input
													className="form-check-input"
													type="radio"
													name={`q${qIndex + 1}`}
													value={answer}
													onChange={onChange}
													checked={isAnswerSelected(qIndex, aIndex)}
												/>
											</div>
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</>
		);
	}
}

export default EmEvaluationForm;
