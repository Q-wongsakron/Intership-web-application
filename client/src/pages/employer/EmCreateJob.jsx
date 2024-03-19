import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the DatePicker

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addPost } from "../../services/employer.service";

import btn from "../../components/btn.module.css";
import JobPreview from "./JobPreview";
import { Modal, Button } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/PDFViewer.css";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function EmCreateJob() {
	const navigate = useNavigate();

	const [hasWelfare, setHasWelfare] = useState(true);
	const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
	const [apiResponse, setApiResponse] = useState(null);

	const [showResumeModal, setShowResumeModal] = useState(false);
	const handleViewPdf = (e) =>{
		setShowResumeModal(true)
	}
	const viewPdf = "./client/src/assets/example.pdf"
	const renderToolbar = (Toolbar) => (
		<>
			<Toolbar />
			<div
				style={{
					borderTop: "1px solid rgba(0, 0, 0, 0.1)",
					marginTop: "4px",
					padding: "4px",
				}}
			></div>
		</>
	);

	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		renderToolbar,
	});

	// use for jQuery autocomplete
	const subdistrictRef = useRef(null);
	const districtRef = useRef(null);
	const provinceRef = useRef(null);
	const pcodeRef = useRef(null);

	const [autoCompleteErr, setAutoCompleteErr] = useState(null);

	const jobPositions = [
		"Front-End",
		"Back-End",
		"Data Sci",
		"Data Engineer",
		"DepOps",
		"Network Engineer",
		"IT Support",
		"IT Security",
		"อื่น ๆ",
	];

	const [formData, setFormData] = useState({
		job_title: "",
		location: "",
		district: "",
		subdistrict: "",
		province: "",
		pcode: "",
		work_hours: "",
		salary: "",
		contact_tel: "",
		contact_email: "",
		welfare: "",
		welfareRadioOptions: "has",
		qualifications: "",
		desc: "",
		other: "",
		position_num: "",
		cats: [],
		name_to: "",
		dateStartPost: new Date(),
		dateEndPost: new Date(),
	});

	const [errors, setErrors] = useState({
		job_title: "",
		location: "",
		district: "",
		subdistrict: "",
		province: "",
		pcode: "",
		work_hours: "",
		salary: "",
		contact_tel: "",
		contact_email: "",
		welfare: "",
		qualifications: "",
		desc: "",
		other: "",
		position_num: "",
		cats: "",
		name_to: "",
	});

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;
		// console.log(name, value);

		if (name === "welfareRadioOptions" && value !== hasWelfare) {
			if (value === "none") {
				setFormData({
					...formData,
					welfare: "ไม่มี",
				});
				setHasWelfare(false);
			} else {
				setFormData({
					...formData,
					welfare: "",
				});
				setHasWelfare(true);
			}
			// setHasWelfare(value === "has");
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}

		// console.log(hasWelfare);

		setErrors({
			...errors,
			[name]: "",
		});
	};

	const handleStartDateChange = (date) => {
		setFormData({
			...formData,
			dateStartPost: date,
		});
	};

	const handleEndDateChange = (date) => {
		setFormData({
			...formData,
			dateEndPost: date,
		});
	};

	const handleQuillChange = (html) => {
		setFormData({
			...formData,
			desc: html,
		});
	};

	const handleCategoryChange = (category) => {
		let updatedCats;

		if (category === "อื่น ๆ") {
			updatedCats = formData.cats.includes(category)
				? formData.cats.filter((cat) => cat !== category)
				: [...formData.cats.filter((cat) => cat !== "อื่น ๆ"), category];
		} else {
			updatedCats = formData.cats.includes(category)
				? formData.cats.filter((cat) => cat !== category)
				: [...formData.cats, category];
		}

		updatedCats.sort((a, b) => a.localeCompare(b));

		setFormData({
			...formData,
			cats: updatedCats,
		});
	};

	const { user } = useSelector((state) => ({ ...state }));

	const handlePublish = async (e) => {
		e.preventDefault();

		if (formData.cats.length === 0) {
			setErrors({
				...errors,
				cats: "กรุณาเลือกตำแหน่งฝึกงานที่ต้องการจะรับสมัคร",
			});

			// alert("กรุณาเลือกตำแหน่งฝึกงานที่ต้องการจะรับสมัคร");
			return;
		}

		setShowPublishConfirmation(true);
	};

	const handleConfirmPublish = async () => {
		// Close the confirmation modal
		setShowPublishConfirmation(false);

		const { welfareRadioOptions, ...dataToSend } = formData;

		try {
			const response = await addPost(user.user.token, dataToSend);
			setApiResponse(response.data);
			setIsResponseModalOpen(true);
			// navigate("/employer/all-job");
		} catch (err) {
			setIsResponseModalOpen(true);
			setApiResponse(err.response ? err.response.data : err.message);
			console.error(
				"Add post failed: ",
				err.response ? err.response.data : err.message
			);
		}
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
							navigate("/employer/all-job");
						}}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	useEffect(() => {
		try {
			if (
				subdistrictRef.current &&
				districtRef.current &&
				provinceRef.current &&
				pcodeRef.current
			) {
				$.Thailand({
					$district: $(subdistrictRef.current),
					$amphoe: $(districtRef.current),
					$province: $(provinceRef.current),
					$zipcode: $(pcodeRef.current),
					onDataFill: function (data) {
						setFormData((prevData) => ({
							...prevData,
							subdistrict: data.district || "",
							district: data.amphoe || "",
							province: data.province || "",
							pcode: data.zipcode || "",
						}));
					},
				});
			}
		} catch (error) {
			setAutoCompleteErr(error);
		}

		setFormData({
			...formData,
			welfareRadioOptions: "has",
		});
	}, []);

	return (
		<div className="row">
			<div className="col-12 col-lg-8">
				<div className="container p-3 p-md-4 container-card">
					<div className="d-flex justify-content-between mb-4">
						<h3 className="employerJobTitle fw-bold">สร้างประกาศรับฝึกงาน</h3>
					</div>
					<div className="content">
						<form
							id="create-job-form"
							className="form-outline mb-4"
							onSubmit={handlePublish}
						>
							<div className="row">
								<div className="col-sm mx-2">
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="job_title">
											หัวเรื่องประกาศรับฝึกงาน{" "}
											<span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="job_title"
											className="form-control"
											name="job_title"
											value={formData.job_title}
											onChange={handleInputChange}
											maxLength={100}
											placeholder="หัวเรื่องประกาศรับฝึกงาน"
										/>
										{errors.job_title && (
											<p className="text-danger">{errors.job_title}</p>
										)}
										<div className="d-flex justify-content-end">
											<small className="text-muted">
												{formData.job_title.length}/100
											</small>
										</div>
									</div>

									<br />

									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="location">
											สถานที่ปฏิบัติงาน <span className="text-danger">*</span>
										</label>
										<textarea
											type="text"
											id="location"
											className="form-control mb-3"
											name="location"
											value={formData.location}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
											placeholder="สถานที่ปฏิบัติงาน"
										/>
										{errors.location && (
											<p className="text-danger">{errors.location}</p>
										)}
									</div>
									<div className="row">
										{autoCompleteErr ? (
											<small>
												* กรณี autocomplete ใช้งานไม่ได้
												ท่านสามารถกรอกข้อมูลเองได้เลย
											</small>
										) : (
											<small>
												* กรณีข้อมูลไม่ถูกต้องหรือค้นหาไม่เจอ
												ท่านสามารถกรอกข้อมูลเองได้เลย
											</small>
										)}

										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_subdistrict"
											>
												ตำบล/แขวง <span className="text-danger">*</span>
											</label>
											<input
												type="text"
												id="a_subdistrict"
												className="form-control mb-3"
												name="subdistrict"
												value={formData.subdistrict}
												onChange={handleInputChange}
												maxLength={50}
												placeholder="ตำบล/แขวง"
												ref={subdistrictRef}
											/>
											{errors.subdistrict && (
												<p className="text-danger">{errors.subdistrict}</p>
											)}
										</div>

										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_district"
											>
												อำเภอ/เขต <span className="text-danger">*</span>
											</label>
											<input
												type="text"
												id="a_district"
												className="form-control mb-3"
												name="district"
												value={formData.district}
												onChange={handleInputChange}
												maxLength={50}
												placeholder="อำเภอ/เขต"
												ref={districtRef}
											/>
											{errors.district && (
												<p className="text-danger">{errors.district}</p>
											)}
										</div>
									</div>
									<div className="row">
										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_province"
											>
												จังหวัด <span className="text-danger">*</span>
											</label>
											<input
												type="text"
												id="a_province"
												className="form-control mb-3"
												name="province"
												value={formData.province}
												onChange={handleInputChange}
												maxLength={50}
												placeholder="จังหวัด"
												ref={provinceRef}
											/>
											{errors.province && (
												<p className="text-danger">{errors.province}</p>
											)}
										</div>
										<div className="col-6 form-group">
											<label className="form-label fw-bold" htmlFor="a_pcode">
												รหัสไปรษณีย์ <span className="text-danger">*</span>
											</label>
											<input
												onKeyDown={(e) => {
													if (
														e.target.value.length === 5 &&
														e.key !== "Backspace"
													) {
														e.preventDefault();
													}
												}}
												pattern="/^-?\d+\.?\d*$/"
												type="number"
												id="a_pcode"
												className="form-control mb-3"
												name="pcode"
												value={formData.pcode}
												onChange={handleInputChange}
												placeholder="รหัสไปรษณีย์"
												ref={pcodeRef}
											/>
											{errors.pcode && (
												<p className="text-danger">{errors.pcode}</p>
											)}
										</div>
									</div>
									<div className="row">
										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="work_hours"
											>
												เวลาทำงาน <span className="text-danger">*</span>
											</label>
											<input
												type="text"
												id="work_hours"
												className="form-control mb-3"
												name="work_hours"
												value={formData.work_hours}
												onChange={handleInputChange}
												placeholder="เวลาทำงาน"
												maxLength={50}
											/>
											{errors.work_hours && (
												<p className="text-danger">{errors.work_hours}</p>
											)}
										</div>
										<div className="col-6 form-group">
											<label className="form-label fw-bold" htmlFor="salary">
												เบี้ยเลี้ยง (ต่อวัน){" "}
												<span className="text-danger">*</span>
											</label>
											<input
												type="number"
												id="a_salary"
												className="form-control mb-3"
												name="salary"
												value={formData.salary}
												onChange={handleInputChange}
												placeholder="เบี้ยเลี้ยง (ต่อวัน)"
											/>
											{errors.salary && (
												<p className="text-danger">{errors.salary}</p>
											)}
										</div>
									</div>
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="welfare">
											สวัสดิการ <span className="text-danger">*</span>
										</label>
										<br />
										<div className="form-check form-check-inline">
											<input
												type="radio"
												id="welfareRadio1"
												className="form-check-input mb-3"
												name="welfareRadioOptions"
												value="has"
												checked={hasWelfare}
												onChange={handleInputChange}
											/>
											<label
												className="form-check-label"
												htmlFor="inlineRadio1"
											>
												มี
											</label>
										</div>
										<div className="form-check form-check-inline">
											<input
												type="radio"
												id="welfareRadio2"
												className="form-check-input mb-3"
												name="welfareRadioOptions"
												value="none"
												checked={!hasWelfare}
												onChange={handleInputChange}
											/>
											<label
												className="form-check-label"
												htmlFor="inlineRadio2"
											>
												ไม่มี
											</label>
										</div>
										{hasWelfare && (
											<>
												<textarea
													type="text"
													id="welfare"
													className="form-control"
													name="welfare"
													value={formData.welfare}
													onChange={handleInputChange}
													rows={2}
													maxLength={255}
													placeholder="สวัสดิการ"
												/>
												<div className="d-flex justify-content-end mb-2">
													<small className="text-muted">
														{formData.welfare.length}/255
													</small>
												</div>
											</>
										)}
										{errors.welfare && (
											<p className="text-danger">{errors.welfare}</p>
										)}
									</div>
									<div className="form-group">
										<label
											className="form-label fw-bold"
											htmlFor="qualifications"
										>
											คุณสมบัติผู้สมัคร <span className="text-danger">*</span>
										</label>
										<textarea
											type="text"
											id="qualifications"
											className="form-control"
											name="qualifications"
											value={formData.qualifications}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
											placeholder="คุณสมบัติผู้สมัคร"
										/>
										{errors.qualifications && (
											<p className="text-danger">{errors.qualifications}</p>
										)}
										<div className="d-flex justify-content-end mb-2">
											<small className="text-muted">
												{formData.qualifications.length}/255
											</small>
										</div>
									</div>

									<div className="row">
										<div className="col-6 form-group d-flex flex-column">
											<label
												className="form-label fw-bold"
												htmlFor="dateStartPost"
											>
												วันที่เปิดรับสมัคร (ว/ด/ป){" "}
												<span className="text-danger">*</span>
											</label>
											<DatePicker
												id="dateStartPost"
												selected={formData.dateStartPost}
												onChange={handleStartDateChange}
												dateFormat="dd/MM/yyyy"
												className="form-control mb-3"
												name="dateStartPost"
											/>
											{errors.dateStartPost && (
												<p className="text-danger">{errors.dateStartPost}</p>
											)}
										</div>
										<div className="col-6 form-group d-flex flex-column">
											<label
												className="form-label fw-bold"
												htmlFor="dateEndPost"
											>
												วันที่ปิดรับสมัคร (ว/ด/ป){" "}
												<span className="text-danger">*</span>
											</label>
											<DatePicker
												id="dateEndPost"
												selected={formData.dateEndPost}
												onChange={handleEndDateChange}
												dateFormat="dd/MM/yyyy"
												className="form-control mb-3"
												name="dateEndPost"
											/>
											{errors.salary && (
												<p className="text-danger">{errors.salary}</p>
											)}
										</div>
									</div>

									<br />

									<div className="row">
										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_contact_tel"
											>
												เบอร์ติดต่อ <span className="text-danger">*</span>
											</label>
											<input
												type="tel"
												id="a_contact_tel"
												className="form-control mb-3"
												name="contact_tel"
												value={formData.contact_tel}
												onChange={handleInputChange}
												maxLength={20}
												placeholder="เบอร์ติดต่อ"
											/>
											{errors.contact_tel && (
												<p className="text-danger">{errors.contact_tel}</p>
											)}
										</div>
										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_contact_email"
											>
												อีเมลติดต่อ <span className="text-danger">*</span>
											</label>
											<input
												type="email"
												id="a_contact_email"
												className="form-control mb-3"
												name="contact_email"
												value={formData.contact_email}
												onChange={handleInputChange}
												maxLength={255}
												placeholder="อีเมลติดต่อ"
											/>
											{errors.contact_email && (
												<p className="text-danger">{errors.contact_email}</p>
											)}
										</div>
									</div>

									<br />

									<div className="editorContainer">
										<label
											className="form-label fw-bold"
											htmlFor="jobEditorContainer"
										>
											รายละเอียดงาน <span className="text-danger">*</span>
										</label>
										<ReactQuill
											id="jobEditorContainer"
											className="editor"
											theme="snow"
											value={formData.desc}
											onChange={handleQuillChange}
										/>
									</div>

									<br />

									<div className="row">
										<div className="col-6 form-group">
											<label
												className="form-label fw-bold"
												htmlFor="a_contact_tel"
											>
												ชื่อผู้รับเอกสารขอความอนุเคราะห์ ให้นำเรียน <span className="text-danger">*</span>
											</label>
											<input
												type="test"
												id="a_contact_tel"
												className="form-control mb-3"
												name="name_to"
												value={formData.name_to}
												onChange={handleInputChange}
												
												placeholder="เรียน"
											/>
											{errors.name_to && (
												<p className="text-danger">{errors.name_to}</p>
											)}
										</div>
										<div className="col-6 form-group">
											<button type="button" class="btn btn-primary btn-lg " onClick={() => handleViewPdf()}>ดูตัวอย่างเอกสาร</button>
										</div>
									</div>

									<br />
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="other">
											รายละเอียดเพิ่มเติม
										</label>
										<textarea
											type="text"
											id="other"
											className="form-control"
											name="other"
											value={formData.other}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
											placeholder="รายละเอียดเพิ่มเติม"
										/>
										{errors.other && (
											<p className="text-danger">{errors.other}</p>
										)}
										<div className="d-flex justify-content-end mb-2">
											<small className="text-muted">
												{formData.other.length}/255
											</small>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="col-lg-4">
				<div className="container p-3 p-md-4 mt-4 mt-lg-0 container-card bg-light-blue d-none d-lg-block">
					<div className="card-body">
						<div className="d-flex justify-content-between mb-4">
							<h5 className="card-title fw-bold">Publish</h5>
						</div>
						{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

						<div className="buttons">
							<div className="row">
								<div className="col-12 col-xl-6 mb-2">
									<button
										className={`btn btn-sm ${btn.btn_grey_outline} w-100`}
									>
										Save as a draft
									</button>
								</div>
								<div className="col-12 col-xl-6">
									<JobPreviewModal />
								</div>
							</div>

							<hr />

							<div className="d-flex justify-content-center">
								<button
									type="submit"
									form="create-job-form"
									className={`${btn.btn_blue} w-100 text-wrap`}
								>
									+ สร้างประกาศรับฝึกงาน
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="container p-3 p-md-4 mt-4 mt-lg-4 container-card">
					<div className="card-body">
						<h5 className="card-title fw-bold mb-3">
							ตำแหน่ง <span className="text-danger">*</span>
						</h5>

						{!formData.cats.length && errors.cats && (
							<p className="text-danger">{errors.cats}</p>
						)}

						<div className="mb-4">
							{jobPositions.map((cat) => (
								<div key={cat} className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										checked={formData.cats.includes(cat)}
										id={cat}
										onChange={() => handleCategoryChange(cat)}
									/>
									<label className="form-check-label" htmlFor={cat}>
										{cat.charAt(0).toUpperCase() + cat.slice(1)}
									</label>
								</div>
							))}
						</div>

						<div className="form-group">
							<label className="form-label fw-bold" htmlFor="position_num">
								จำนวนรับ (คน)
							</label>
							<input
								type="number"
								id="position_num"
								className="form-control mb-3"
								name="position_num"
								value={formData.position_num}
								onChange={handleInputChange}
								placeholder="จำนวนรับ (คน)"
							/>
							{errors.position_num && (
								<p className="text-danger">{errors.position_num}</p>
							)}
						</div>
					</div>
				</div>
				<Modal
				show={showResumeModal}
				onHide={() => setShowResumeModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Student Resume</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
						
								<Viewer
									fileUrl={"http://localhost:5500/uploads/example.pdf"}
									// httpHeaders={{
									// 	authtoken: user.user.token,
									// }}
									plugins={[defaultLayoutPluginInstance]}
									// withCredentials={true}
								/>
						
						
						</Worker>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowResumeModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
				<PublishCard />
				<ResponseModal />
			</div>
		</div>
	);

	function PublishCard() {
		return (
			<div
				className={`container p-3 p-md-4 mt-4 mt-lg-0 container-card bg-light-blue d-block d-lg-none`}
			>
				<div className="card-body">
					<div className="d-flex justify-content-between mb-4">
						<h5 className="card-title fw-bold">Publish</h5>
					</div>
					{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

					<div className="buttons">
						<div className="row">
							<div className="col-12 col-xl-6 mb-2">
								<button className={`btn btn-sm ${btn.btn_grey_outline} w-100`}>
									Save as a draft
								</button>
							</div>
							<div className="col-12 col-xl-6">
								<JobPreviewModal />
							</div>
						</div>

						<hr />

						<div className="d-flex justify-content-center">
							<button
								type="submit"
								form="create-job-form"
								className={`${btn.btn_blue} w-100 text-wrap`}
								onClick={() => setShowPublishConfirmation(true)}
							>
								+ สร้างประกาศรับฝึกงาน
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	function JobPreviewModal() {
		return (
			<>
				<button
					type="button"
					className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
					data-bs-toggle="modal"
					data-bs-target="#jobPreviewModal"
				>
					Preview
				</button>

				<div
					className="modal fade"
					id="jobPreviewModal"
					tabIndex={-1}
					aria-labelledby="jobPreviewModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-xl modal-fullscreen-lg-down">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="jobPreviewModalLabel">
									Preview
								</h1>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body bg-light">
								<JobPreview formData={formData} />
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className={`btn btn-sm ${btn.btn_grey}`}
									data-bs-dismiss="modal"
								>
									ปิดหน้าต่าง
								</button>
								{/* <button
									type="button"
									className={`btn btn-sm ${btn.btn_blue}`}
									onClick={handlePublish}
								>
									Publish Now
								</button> */}
							</div>
						</div>
					</div>
				</div>

				<Modal
					show={showPublishConfirmation}
					onHide={() => setShowPublishConfirmation(false)}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">
							ยืนยันการสร้างประกาศรับนักศึกษาฝึกงาน
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p>คุณยืนยันที่จะสร้างประกาศรับนักศึกษาฝึกงานนี้ ?</p>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => setShowPublishConfirmation(false)}
						>
							ปิด
						</Button>
						<Button
							className={`${btn.btn_blue}`}
							onClick={handleConfirmPublish}
						>
							สร้างประกาศรับฝึกงาน
						</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}

export default EmCreateJob;
