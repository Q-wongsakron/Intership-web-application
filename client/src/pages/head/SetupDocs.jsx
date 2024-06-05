import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import btn from "../../components/btn.module.css";
import DatePicker from "react-datepicker";
import { MdDateRange } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";

function SetupDocs() {
	const navigate = useNavigate();
	const user = useSelector((state) => state.user);

	const [formData, setFormData] = useState({
		start_date: "",
		end_date: "",
		start_date_convert: "",
		end_date_convert: "",
		end_date_year: "",
		head_name: "",
		signature_img: null,
	});
	const handleSignatureImageFileChange = (e) => {
		const file = e.target.files[0];
		setFormData({
			...formData,
			signature_img: file,
		});
	};

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSetupDocs = async (e) => {
		e.preventDefault(); // Prevent page refresh

		try {
			// console.log(formData.signature_img);
			const setupDocs = await axios.post(
				import.meta.env.VITE_APP_API + "/setupCourtesy",
				{ formData }
			);
			// console.log(setupDocs);
			const formDataImg = new FormData();
			formDataImg.append("SignatureImg", formData.signature_img);
			await axios.put(
				import.meta.env.VITE_APP_API + "/uploadSignatureImg",
				formDataImg,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);
			navigate("/secretary/approve-docs");
			// console.log("Document setup successful!");
		} catch (error) {
			console.error(error);
		}
	};
	const convertToThaiNumerals = (number) => {
		const thaiNumerals = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
		return number.toString().replace(/\d/g, (digit) => thaiNumerals[digit]);
	};
	const thaiMonths = [
		"มกราคม",
		"กุมภาพันธ์",
		"มีนาคม",
		"เมษายน",
		"พฤษภาคม",
		"มิถุนายน",
		"กรกฎาคม",
		"สิงหาคม",
		"กันยายน",
		"ตุลาคม",
		"พฤศจิกายน",
		"ธันวาคม",
	];
	const handleStartDateChange = (date) => {
		const endDate = new Date(date);
		const startDate = new Date(date);

		endDate.setDate(date.getDate() + 60);
		const startDateConvert = `${convertToThaiNumerals(startDate.getDate())}  ${
			thaiMonths[startDate.getMonth()]
		}`;
		const endDateConvert = `${convertToThaiNumerals(endDate.getDate())}  ${
			thaiMonths[endDate.getMonth()]
		}`;
		const endYearConvert = `${convertToThaiNumerals(
			endDate.getFullYear() + 543
		)}`;
		// console.log(endDate.getFullYear());
		setFormData({
			...formData,
			start_date: date,
			end_date: endDate,
			start_date_convert: startDateConvert,
			end_date_convert: endDateConvert,
			end_date_year: endYearConvert,
		});
	};
	const handleEndDateChange = (date) => {
		const endDate = new Date(date);
		const endDateConvert = `${convertToThaiNumerals(endDate.getDate())}  ${
			thaiMonths[endDate.getMonth()]
		}`;
		const endYearConvert = `${convertToThaiNumerals(
			endDate.getFullYear() + 543
		)}`;

		// console.log(endDate.getFullYear());
		setFormData({
			...formData,
			end_date: endDate,
			end_date_convert: endDateConvert,
			end_date_year: endYearConvert,
		});
	};

	useEffect(() => {}, []);
	// console.log(formData);

	return (
		<div className="row">
			<div className="col-12 col-xl-8">
				<div className="container p-3 p-md-4 container-card">
					<div className="d-flex justify-detail-between mb-4">
						<h3 className="fw-bold">ตั้งค่าหนังสือขอความอนุเคราะห์</h3>
						<span className="text-danger">*</span>
					</div>
					<div className="detail">
						<form
							id="setup-docs-form"
							className="form-outline mb-4"
							onSubmit={handleSetupDocs}
						>
							<div className="row">
								<div className="col-sm mx-2">
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="start_date">
											วันเริ่มฝึกงาน (ว/ด/ป){" "}
											<span className="text-danger">*</span>
										</label>
										<br />
										<div className="input-group">
											<DatePicker
												id="start_date"
												className="form-control"
												selected={formData.start_date}
												onChange={(date) => {
													setFormData({
														...formData,
														start_date: date,
													}),
														handleStartDateChange(date);
												}}
												dateFormat="dd/MM/yyyy"
												required
											/>
											<span className="input-group-text">
												<MdDateRange />
											</span>
										</div>
									</div>

									<br />
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="end_date">
											วันสิ้นสุดฝึกงาน (ว/ด/ป){" "}
											<span className="text-danger">*</span>
										</label>
										<div className="input-group">
											<DatePicker
												id="end_date"
												className="form-control"
												selected={formData.end_date}
												onChange={(date) => {
													setFormData({
														...formData,
														end_date: date,
													}),
														handleEndDateChange(date);
												}}
												dateFormat="dd/MM/yyyy"
												minDate={new Date(formData.start_date)}
												required
											/>

											<span className="input-group-text">
												<MdDateRange />
											</span>
										</div>
									</div>
									<br />

									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="head_name">
											ชื่อหัวหน้าภาควิชา <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="head_name"
											className="form-control"
											name="head_name"
											value={formData.head_name}
											onChange={handleInputChange}
											required
										/>
									</div>
									<br />
									<div className="form-group">
										<label className="form-label fw-bold" htmlFor="head_name">
											รูปลายเซ็นหัวหน้าภาควิชา{" "}
											<span className="text-danger">*</span>
										</label>
										<input
											className="form-control"
											type="file"
											id="SignatureImg"
											accept=".jpg, .png"
											onChange={handleSignatureImageFileChange}
										/>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="col-xl-4">
				<div className="container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-none d-xl-block">
					<div className="card-body">
						<div className="d-flex justify-detail-between mb-4">
							<h5 className="card-topic fw-bold">ยืนยันตั้งค่า</h5>
						</div>
						{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

						<div className="buttons">
							<div className="d-flex justify-detail-center">
								<button
									type="submit"
									form="setup-docs-form"
									className={`${btn.btn_blue} w-100`}
								>
									ยืนยันตั้งค่า
								</button>
							</div>
						</div>
					</div>
				</div>

				<PublishCard />
			</div>
		</div>
	);

	function PublishCard() {
		return (
			<div
				className={`container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-block d-xl-none`}
			>
				<div className="card-body">
					<div className="d-flex justify-detail-between mb-4">
						<h5 className="card-topic fw-bold">ยืนยันตั้งค่า</h5>
					</div>
					{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

					<div className="buttons">
						{/* <div className="row">
							<div className="col-12 col-xl-6 mb-2">
								<button className={`btn btn-sm ${btn.btn_grey_outline} w-100`}>
									Save as a draft
								</button>
							</div>
							<div className="col-12 col-xl-6">
								<NewsPreviewModal />
							</div>
						</div> */}

						<div className="d-flex justify-detail-center">
							<button
								type="submit"
								form="setup-docs-form"
								className={`${btn.btn_blue} w-100`}
							>
								ยืนยันตั้งค่า
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default SetupDocs;
