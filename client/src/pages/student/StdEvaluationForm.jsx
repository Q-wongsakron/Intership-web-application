import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { getStudentProfile } from "../../services/user.service";
import axios from "axios";

function StdEvaluationForm() {
	const defaultChoices = ["น้อยมาก", "น้อย", "พอใช้", "ดี", "ดีมาก"];
	const questions = [
		{
			question: "1. ความร่วมมือจากหน่วยงาน",
			answers: defaultChoices,
		},
		{
			question: "2. ความปลอดภัยในการทํางาน",
			answers: defaultChoices,
		},
		{
			question: "3. ปริมาณงานที่ได้รับมอบหมาย",
			answers: ["น้อยมาก", "น้อย", "เหมาะสม", "ดี", "ดีมาก"],
		},
		{
			question: "4. การเอาใจใส่ในการให้คำแนะนํา",
			answers: defaultChoices,
		},
		{
			question: "5. วิชาความรู้ของนักศึกษาก่อนฝึกงาน",
			answers: ["น้อยมาก", "น้อย", "เพียงพอ", "ดี", "ดีมาก"],
		},
		{
			question: "6. การใช้ความรู้ที่เรียนมาเพื่อทํางาน",
			answers: defaultChoices,
		},
		{
			question: "7. ประโยชน์ที่ได้รับในการฝึกงาน",
			answers: defaultChoices,
		},
		{
			question: "การส่งนักศึกษาไปฝึกที่หน่วยงานนี้ในครั้งต่อไป",
			answers: ["ควร", "ไม่ควร"],
		},
	];

	const [stdData, setStdData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [disabledFieldset, setDisabledFieldset] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isFormDirty, setIsFormDirty] = useState(false);

	const [apiResponse, setApiResponse] = useState(null);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

	const navigate = useNavigate();

	const user = useSelector((state) => state.user);

	const [formData, setFormData] = useState({
		email: "",
		displayname_th: "",
		std_id: "",
		department: "",
		std_year: "3",
		company_name: "",
		company_address: "",
		company_tel: "",
		company_fax: "",
		company_business_type: "",
		std_task: "",
		other_comment: "",
	});
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
		setErrors({
			...errors,
			[name]: "",
		});
		setIsFormDirty(true);
	};

	const loadData = async (authtoken) => {
		try {
			const res = await getStudentProfile(authtoken);
			setStdData(res.data);

			const confirmRes = await axios.get(
				import.meta.env.VITE_APP_API + "/allConfirm",
				{
					headers: {
						authtoken: authtoken,
					},
				}
			);
			if (confirmRes.data.length) {
				setFormData({
					...formData,
					company_name: confirmRes.data[0].employer.company_name || "",
					company_address: confirmRes.data[0].posts_job.location || "",
					company_tel: confirmRes.data[0].employer.contact_tel || "",
					displayname_th: res.data.name_title_th
						? res.data.name_title_th + res.data.displayname_th
						: res.data.displayname_th || "",
					std_id: res.data.std_id || "",
					email: res.data.email || "",
					department: res.data.department || "",
					std_year: "3",
				});
			} else {
				const selfRes = await axios.get(
					import.meta.env.VITE_APP_API + "/allSelfEnroll",
					{
						headers: {
							authtoken: authtoken,
						},
					}
				);
				if (selfRes.data.length) {
					setFormData({
						...formData,
						company_name: selfRes.data[0].company_name || "",
						company_address: selfRes.data[0].company_address || "",
						displayname_th: res.data.name_title_th
							? res.data.name_title_th + res.data.displayname_th
							: res.data.displayname_th || "",
						std_id: res.data.std_id || "",
						email: res.data.email || "",
						department: res.data.department || "",
						std_year: "3",
					});
				} else {
					setFormData({
						...formData,
						displayname_th: res.data.name_title_th
							? res.data.name_title_th + res.data.displayname_th
							: res.data.displayname_th || "",
						std_id: res.data.std_id || "",
						email: res.data.email || "",
						department: res.data.department || "",
						std_year: "3",
					});
				}
			}

			setDisabledFieldset(
				res.data.status === "4"
					? res.data.std_eval === 0 // std does not fill the form yet
						? false
						: true
					: true
			); // if student finished internship or already filled the form then disabled the form
		} catch (err) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};
		questions.forEach((question, index) => {
			const unanswered = !formData[`q${index + 1}`];
			if (unanswered) {
				newErrors[`q${index + 1}`] = "(กรุณาเลือกคำตอบ)";
			}
		});

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			setShowModal(true);
		}
	};

	const handleConfirmSubmit = async () => {
		setShowModal(false);
		try {
			const mappedFormData = { ...formData };
			for (let i = 1; i <= 7; i++) {
				const question = `q${i}`;
				const index = defaultChoices.indexOf(formData[question]);
				mappedFormData[question] = index !== -1 ? index : formData[question];
			}

			mappedFormData.q8 =
				formData.q8 === "ควร" ? 4 : formData.q8 === "ไม่ควร" ? 0 : formData.q8;

			// mappedFormData.q3 = formData.q3 === "เหมาะสม" ? 2 : formData.q3;
			mappedFormData.q3 = formData.q3 === "เหมาะสม" ? 2 : mappedFormData.q3;

			// mappedFormData.q5 = formData.q5 === "เพียงพอ" ? 2 : formData.q5;
			mappedFormData.q5 = formData.q5 === "เพียงพอ" ? 2 : mappedFormData.q5;

			const newEvaluation = await axios.post(
				import.meta.env.VITE_APP_API + "/createStdEval",
				{ formData: mappedFormData },
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);

			setShowModal(false);
			setIsResponseModalOpen(true);
			setApiResponse(newEvaluation.data);

			// setApiResponse(newSelfEnroll.data);
			// setIsResponseModalOpen(true);
			// navigate("/student/internship");
			//   navigate("/student/internship")
		} catch (error) {
			setApiResponse(error.response ? error.response.data : error.message);
			setIsResponseModalOpen(true);
			// setIsResponseModalOpen(true);
			// setApiResponse(error.response.data);
			console.error(
				"Submit Failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	// const ResponseModal = () => {
	// 	return (
	// 		<Modal
	// 			show={isResponseModalOpen}
	// 			onHide={() => setIsResponseModalOpen(false)}
	// 			centered
	// 		>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title className="fw-bold">กรณีกรอกเคยไปแล้ว?</Modal.Title>
	// 			</Modal.Header>
	// 			<Modal.Body>
	// 				{apiResponse ? <p>{apiResponse.message}</p> : <p>Loading...</p>}
	// 			</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button
	// 					variant="secondary"
	// 					onClick={() => {
	// 						setIsResponseModalOpen(false);
	// 						navigate("/student/internship");
	// 					}}
	// 				>
	// 					ปิด
	// 				</Button>
	// 			</Modal.Footer>
	// 		</Modal>
	// 	);
	// };

	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ยืนยัน</Modal.Title>
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
							// navigate("/student/internship");
						}}
					>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const ResponseModal = () => {
		return (
			<Modal
				show={isResponseModalOpen}
				onHide={() => setIsResponseModalOpen(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title></Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{apiResponse ? <p>{apiResponse.message}</p> : <p>Loading...</p>}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => {
							setIsResponseModalOpen(false);
							navigate("/student/internship");
						}}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, [user.user.token]);

	// ใช้เช็คเวลากรอกฟอร์มไปบางส่วนหรือทั้งหมดแล้วจะเปลี่ยนหน้าไปหน้าอื่นมันจะเตือน
	// useEffect(() => {
	// 	const handleBeforeUnload = (e) => {
	// 		if (isFormDirty) {
	// 			const confirmationMessage =
	// 				"You have unsaved changes. Are you sure you want to leave?";
	// 			e.returnValue = confirmationMessage; // older browsers
	// 			return confirmationMessage; // modern browsers
	// 		}
	// 	};

	// 	const handleAnchorClick = (e) => {
	// 		if (isFormDirty) {
	// 			const confirmationMessage =
	// 				"You have unsaved changes. Are you sure you want to leave?";
	// 			if (!window.confirm(confirmationMessage)) {
	// 				e.preventDefault();
	// 			}
	// 		}
	// 	};

	// 	window.addEventListener("beforeunload", handleBeforeUnload);

	// 	const anchors = document.querySelectorAll("a");
	// 	anchors.forEach((anchor) => {
	// 		anchor.addEventListener("click", handleAnchorClick);
	// 	});

	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleBeforeUnload);
	// 		anchors.forEach((anchor) => {
	// 			anchor.removeEventListener("click", handleAnchorClick);
	// 		});
	// 	};
	// }, [isFormDirty]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-2 p-md-4 container-card">
			<div className="d-flex justify-content-between">
				<h3 className="stdProfileTitle mb-3 fw-bold">
					ประเมินสถานที่ฝึกงาน (สำหรับนักศึกษา)
				</h3>
			</div>

			{disabledFieldset && (
				<div className="mb-3 fw-bold p-1 border border-warning rounded">
					<span className="text-warning">
						<FontAwesomeIcon icon={faCircleInfo} />{" "}
					</span>{" "}
					<span className="">ไม่สามารถกรอกข้อมูลได้ เนื่องจาก :</span>
					<ul className="text-muted mb-2">
						<li>นักศึกษายังไม่เสร็จสิ้นการฝึกงาน หรือ</li>
						<li>นักศึกษาได้ทำแบบประเมินไปแล้ว</li>
					</ul>
					<span className="">
						หากมีข้อผิดพลาดหรือมีข้อสงสัยกรุณาติดต่ออาจารย์ผู้ประสานงานหรือภาควิชาฯ
					</span>
				</div>
			)}

			<form
				id="self-enroll-form"
				className="form-outline mb-4"
				onSubmit={handleSubmit}
			>
				<fieldset disabled={disabledFieldset}>
					<div className="px-2 pt-3">
						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">ข้อมูลนักศึกษา</p>
						</div>
						<div className="row">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="email" className="fw-bold">
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
							<div className="col-sm-6">
								<label htmlFor="displayname_th" className="fw-bold">
									ชื่อนักศึกษา <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="displayname_th"
									className="form-control mb-2"
									name="displayname_th"
									value={formData.displayname_th}
									placeholder="ชื่อ-นามสกุล"
									onChange={handleInputChange}
									maxLength={100}
									required
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="std_id" className="fw-bold">
									เลขทะเบียน <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="std_id"
									className="form-control mb-2"
									name="std_id"
									value={formData.std_id}
									placeholder="เลขทะเบียน"
									onChange={handleInputChange}
									maxLength={10}
									pattern="\d{10}"
									required
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-6">
								<label htmlFor="department" className="fw-bold">
									ภาควิชา <span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="department"
									className="form-control mb-2"
									name="department"
									value={formData.department}
									placeholder="ภาควิชา"
									onChange={handleInputChange}
									maxLength={100}
									required
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="std_year" className="fw-bold">
									ชั้นปีที่ <span className="text-danger">*</span>
								</label>
								<select
									className="form-select"
									id="std_year"
									name="std_year"
									value={formData.std_year}
									onChange={handleInputChange}
								>
									<option defaultValue="3">3</option>
									<option value="4">4</option>
									<option value="ปีสูง">ปีสูง</option>
								</select>
							</div>
						</div>

						<br />

						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">ข้อมูลสถานที่ฝึกงาน</p>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12">
								<label htmlFor="company_name" className="fw-bold">
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
								<label htmlFor="company_address" className="fw-bold">
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
								<label htmlFor="company_tel" className="fw-bold">
									โทรศัพท์
								</label>
								<input
									type="tel"
									id="company_tel"
									className="form-control mb-2"
									name="company_tel"
									value={formData.company_tel}
									placeholder="โทรศัพท์"
									onChange={handleInputChange}
									maxLength={12}
								/>
							</div>
							<div className="col-sm-6 mt-2 mt-sm-0">
								<label htmlFor="company_fax" className="fw-bold">
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
						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="company_business_type" className="fw-bold">
									ประเภทของกิจการ / ลักษณะงานของบริษัท / หน่วยงาน{" "}
									<span className="text-danger">*</span>
								</label>
								<input
									type="text"
									id="company_business_type"
									className="form-control mb-2"
									name="company_business_type"
									value={formData.company_business_type}
									placeholder="ประเภทของกิจการ / ลักษณะงานของบริษัท / หน่วยงาน"
									onChange={handleInputChange}
									maxLength={255}
									required
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="std_task" className="fw-bold">
									ลักษณะงานที่นักศึกษาปฏิบัติ{" "}
									<span className="text-danger">*</span>
								</label>
								<textarea
									type="text"
									id="std_task"
									className="form-control mb-2"
									name="std_task"
									value={formData.std_task}
									placeholder="ลักษณะงานที่นักศึกษาปฏิบัติ"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
									required
								/>
							</div>
						</div>

						<br />

						<div className="bg-dark p-2 mb-2 rounded-top">
							<p className="text-white fw-bold m-auto">
								ความคิดเห็นของนักศึกษา
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12">
								<RadioTypeQuestion
									questions={questions}
									onChange={handleInputChange}
									errors={errors}
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label htmlFor="other_comment" className="fw-bold">
									ข้อคิดเห็นอื่น ๆ ของนักศึกษาเกี่ยวกับการฝึกงานภาคฤดูร้อน
								</label>
								<textarea
									type="text"
									id="other_comment"
									className="form-control mb-2"
									name="other_comment"
									value={formData.other_comment}
									placeholder="ข้อคิดเห็นอื่น ๆ ของนักศึกษาเกี่ยวกับการฝึกงานภาคฤดูร้อน"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
								/>
							</div>
						</div>
					</div>

					<br />
					<div className="d-flex justify-content-center">
						<button
							type="submit"
							form="self-enroll-form"
							className={`${btn.btn_blue} w-100`}
							// disabled={stdData.std_eval === 1 ? true : false}
						>
							ยืนยัน
						</button>
					</div>
					{/* {disabledFieldset && (
						<p className="mt-2 mb-0 fw-bold">
							หมายเหตุ<span className="text-danger">*</span>{" "}
							นักศึกษายังไม่เสร็จสิ้นการฝึกงานหรือนักศึกษาได้ทำแบบประเมินไปแล้ว
							หากมีข้อสงสัยกรุณาติดต่อภาควิชาฯ
						</p>
					)} */}
				</fieldset>
			</form>

			<ConfirmModal />
			<ResponseModal />
		</div>
	);

	function RadioTypeQuestion({ questions, onChange, errors }) {
		const isAnswerSelected = (questionIndex, answerIndex) => {
			const selectedAnswer = formData[`q${questionIndex + 1}`];
			return selectedAnswer === questions[questionIndex].answers[answerIndex];
		};

		const content = (
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
									name={`q${qIndex + 1}`}
									id={`q${qIndex + 1}_a${aIndex + 1}`}
									value={answer}
									onChange={onChange}
									checked={isAnswerSelected(qIndex, aIndex)}
								/>
								<label
									className="form-check-label"
									htmlFor={`q${qIndex + 1}_a${aIndex + 1}`}
								>
									{answer}
								</label>
							</div>
						))}
						{errors[`q${qIndex + 1}`] && (
							<span className="text-danger">{errors[`q${qIndex + 1}`]}</span>
						)}
					</div>
				))}
			</>
		);

		return content;
	}
}

export default StdEvaluationForm;
