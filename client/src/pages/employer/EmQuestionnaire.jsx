import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { Modal, Button } from "react-bootstrap";

import { getStudentProfile } from "../../services/user.service";
import axios from "axios";

function EmQuestionnaire() {
	const [stdData, setStdData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [disabledFieldset, setDisabledFieldset] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isFormDirty, setIsFormDirty] = useState(false);

	const [apiResponse, setApiResponse] = useState(null);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

	const navigate = useNavigate();

	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

	const [formData, setFormData] = useState({});
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log(formData);
		setShowModal(true);
	};

	const handleConfirmSubmit = async () => {
		setShowModal(false);
		try {
			const newQuestion = await axios.post(
				import.meta.env.VITE_APP_API + "/emQuestionnair",
				{ formData },
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);

			setShowModal(false);
			setIsResponseModalOpen(true);
			setApiResponse(newQuestion.data);

			// navigate("/")
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
							navigate("/");
						}}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	useEffect(() => {
		// setLoading(true);
	});

	// if (loading) {
	// 	return <Loading />;
	// }

	return (
		<div className="container p-2 p-md-4 container-card">
			<div className="d-flex justify-content-between">
				<h3 className="stdProfileTitle mb-3 fw-bold">
					แบบสอบถาม การฝึกงานนักศึกษาคณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์
					(สำหรับบริษัท/หน่วยงาน)
				</h3>
			</div>

			<form
				id="self-enroll-form"
				className="form-outline mb-4"
				onSubmit={handleSubmit}
			>
				<fieldset disabled={disabledFieldset}>
					<div className="px-2 pt-3">
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
								<label
									htmlFor="questionnaire_q1"
									className="form-label fw-bold"
								>
									1. ท่านคิดว่าในหลักสูตรคณะวิศวกรรมศาสตร์
									ควรเพิ่มรายวิชาหรือความรู้เรื่องใดที่เอื้อประโยชน์ต่อการทำงานในสถานประกอบการของท่าน
								</label>
								<textarea
									type="text"
									id="questionnaire_q1"
									className="form-control mb-2"
									name="questionnaire_q1"
									value={formData.questionnaire_q1}
									placeholder="คำตอบของคุณ"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label
									htmlFor="questionnaire_q2"
									className="form-label fw-bold"
								>
									2. คุณลักษณะของนักศึกษาใดบ้างที่ท่านเห็นว่ามีความสำคัญ
									และต้องเพิ่มเติมให้นักศึกษา เช่น การทำงานเป็นทีม
									ภาวะการเป็นผู้นำ/ผู้ตาม การนำเสนองาน เป็นต้น
								</label>
								<textarea
									type="text"
									id="questionnaire_q2"
									className="form-control mb-2"
									name="questionnaire_q2"
									value={formData.questionnaire_q2}
									placeholder="คำตอบของคุณ"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
								/>
							</div>
						</div>

						<br />

						<div className="bg-light py-2 mb-2 rounded-top">
							<p className="text-dark fw-bold m-auto">
								3.นักศึกษาคณะวิศวกรรมศาสตร์ มธ. ที่ได้รับประสบการณ์ทำงาน
								(ฝึกงาน) ในองค์กรของท่าน
							</p>
						</div>
						<div className="row mt-3">
							<div className="col-sm-12">
								<label
									htmlFor="questionnaire_q3_1"
									className="form-label fw-bold"
								>
									3.1 นักศึกษาคณะวิศวกรรมศาสตร์ มธ. มีคุณลักษณะที่โดดเด่น
									ด้านใดบ้าง
								</label>
								<textarea
									type="text"
									id="questionnaire_q3_1"
									className="form-control mb-2"
									name="questionnaire_q3_1"
									value={formData.questionnaire_q3_1}
									placeholder="คำตอบของคุณ"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
								/>
							</div>
							<div className="col-sm-12 mt-2 mt-sm-0">
								<label
									htmlFor="questionnaire_q3_2"
									className="form-label fw-bold"
								>
									3.2 นักศึกษาคณะวิศวกรรมศาสตร์ มธ. มีคุณลักษณะที่ต้องปรับปรุง
									ด้านใดบ้าง
								</label>
								<textarea
									type="text"
									id="questionnaire_q3_2"
									className="form-control mb-2"
									name="questionnaire_q3_2"
									value={formData.questionnaire_q3_2}
									placeholder="คำตอบของคุณ"
									onChange={handleInputChange}
									rows={2}
									maxLength={255}
								/>
							</div>
						</div>

						<div className="row mt-3">
							<div className="col-sm-12 bg-light border rounded">
								<p className="m-auto p-2">
									หากมีนักศึกษาคณะวิศวกรรมศาสตร์ มธ. เข้าฝึกงานกับบริษัทท่าน
									มากกว่า 1 คน ขอให้ท่านตอบแบบสอบถามนี้เพียงชุดเดียว
								</p>
							</div>
						</div>
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
					{disabledFieldset && (
						<p className="mt-2 mb-0 fw-bold">
							หมายเหตุ<span className="text-danger">*</span>{" "}
							หากมีข้อสงสัยกรุณาติดต่อภาควิชาฯ
						</p>
					)}
				</fieldset>
			</form>

			<ConfirmModal />
			<ResponseModal />
		</div>
	);
}

export default EmQuestionnaire;
