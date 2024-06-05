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
import Loading from "../../components/Loading";
import { Modal, Button } from "react-bootstrap";

import "../../components/PDFViewer.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faEye } from "@fortawesome/free-solid-svg-icons";

import { getEmployerProfile } from "../../services/user.service";
import { faSquareMinus } from "@fortawesome/free-regular-svg-icons";
import { internJobPositions } from "../../components/internJobPositions";
import {
	ThailandAddressTypeahead,
	ThailandAddressValue,
	CustomSuggestion,
} from "react-thailand-address-typeahead";

function EmCreateJob() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [disabledFieldset, setDisabledFieldset] = useState(false);

	const fetchData = async (authtoken) => {
		try {
			const response = await getEmployerProfile(authtoken);
			setData(response.data);
			// console.log(response.data);
			setDisabledFieldset(
				response.data.profile.status === "verified" ? false : true
			); //

			setFormData({
				...formData,
				location: response.data.profile.address,
				district: response.data.profile.district,
				subdistrict: response.data.profile.subdistrict,
				province: response.data.profile.province,
				pcode: response.data.profile.pcode,
				contact_tel: response.data.profile.contact_tel,
				contact_email: response.data.profile.contact_email,
			});
		} catch (error) {
			console.log(
				"Load data failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

	const navigate = useNavigate();

	const [hasWelfare, setHasWelfare] = useState(true);
	const [showJobPreviewModal, setShowJobPreviewModal] = useState(false);
	const [showPublishConfirmation, setShowPublishConfirmation] = useState(false);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
	const [apiResponse, setApiResponse] = useState(null);

	const [showResumeModal, setShowResumeModal] = useState(false);
	const handleViewPdf = (e) => {
		e.preventDefault();
		setShowResumeModal(true);
	};
	const viewPdf = "./client/src/assets/example.pdf";
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

	const [autoCompleteErr, setAutoCompleteErr] = useState(false);

	const jobPositions = internJobPositions.map((item) => item.label);

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
		qualifications: "",
		desc: "",
		other: "",
		cats: [],
		categoryValues: {},
		name_to: "",
		dateStartPost: new Date(),
		dateEndPost: "",
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
		cats: "",
		categoryValues: "",
		name_to: "",
		dateStartPost: "",
		dateEndPost: "",
	});

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;

		// if (name === "welfareRadioOptions" && value !== hasWelfare) {
		// 	if (value === "none") {
		// 		setFormData({
		// 			...formData,
		// 			welfare: "ไม่มี",
		// 		});
		// 		setHasWelfare(false);
		// 	} else {
		// 		setFormData({
		// 			...formData,
		// 			welfare: "",
		// 		});
		// 		setHasWelfare(true);
		// 	}
		// } else {
		// }
		setFormData({
			...formData,
			[name]: value,
		});

		setErrors({
			...errors,
			[name]: "",
		});
	};

	const handleThailandAddressChange = (newValue) => {
		const { subdistrict, district, province, postalCode } = newValue;

		setFormData({
			...formData,
			subdistrict: subdistrict || "",
			district: district || "",
			province: province || "",
			pcode: postalCode || "",
		});

		setErrors({
			...errors,
			district: "",
			postalCode: "",
			province: "",
			subdistrict: "",
		});
	};

	const handleStartDateChange = (date) => {
		// const newEndDate = new Date(date);
		// newEndDate.setDate(newEndDate.getDate() + 1);

		let resetEndDate = "";
		if (date > formData.dateEndPost) {
			resetEndDate = "";
		} else {
			resetEndDate = formData.dateEndPost;
		}

		setFormData({
			...formData,
			dateStartPost: date,
			dateEndPost: resetEndDate,
		});
		setErrors({
			...errors,
			dateStartPost: "",
		});
	};

	const handleEndDateChange = (date) => {
		setFormData({
			...formData,
			dateEndPost: date,
		});
		setErrors({
			...errors,
			dateEndPost: "",
		});
	};

	const handleQuillChange = (html) => {
		setFormData({
			...formData,
			desc: html,
		});
		setErrors({
			...errors,
			desc: "",
		});
	};

	const [newCategory, setNewCategory] = useState("");
	const [newCategoryValue, setNewCategoryValue] = useState("");
	const [categoryValues, setCategoryValues] = useState({});
	const [categories, setCategories] = useState(location.state?.cat || []);

	const handleCategoryChange = (category) => {
		if (categories.includes(category)) {
			setCategories((prevCategories) =>
				prevCategories.filter((cat) => cat !== category)
			);
			setCategoryValues((prevValues) => {
				const updatedValues = { ...prevValues };
				delete updatedValues[category];
				return updatedValues;
			});
		}
		// else {
		// 	setCategories((prevCategories) => [...prevCategories, category]);
		// 	setCategoryValues((prevValues) => ({
		// 		...prevValues,
		// 		[category]: parseInt(newCategoryValue),
		// 	}));
		// }

		// Update formData
		setFormData((prevData) => ({
			...prevData,
			cats: [...prevData.cats].filter((cat) => cat !== category), // Update categories
			categoryValues: Object.fromEntries(
				Object.entries({ ...prevData }.categoryValues).filter(
					([key, value]) => key !== category
				)
			),
		}));
	};

	const handleAddCategory = () => {
		if (newCategory.trim() !== "") {
			const newCategoryName = newCategory.trim();
			const newCategoryVal = parseInt(newCategoryValue);

			setCategoryValues((prevValues) => ({
				...prevValues,
				[newCategoryName]: newCategoryVal,
			}));

			if (!categories.includes(newCategoryName)) {
				setCategories((prevCategories) => [...prevCategories, newCategoryName]);
				// Update formData
				setFormData((prevData) => ({
					...prevData,
					cats: [...categories, newCategoryName], // Update categories
				}));
			}

			// Update formData
			setFormData((prevData) => ({
				...prevData,
				categoryValues: {
					...categoryValues,
					[newCategoryName]: newCategoryVal,
				},
			}));

			setNewCategory("");
			setNewCategoryValue("");
		}
	};

	const handlePublish = async (e) => {
		e.preventDefault();

		const newErrors = {};
		if (formData.dateEndPost === "") {
			newErrors.dateEndPost = "กรุณาเลือกวันที่ปิดรับสมัคร";
		}
		if (formData.cats.length === 0) {
			newErrors.cats = "กรุณาเพิ่มตำแหน่งฝึกงานที่ต้องการจะรับสมัคร";
		}
		if (formData.desc === "") {
			newErrors.desc = "กรุณากรอกรายละเอียดงาน";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			setShowPublishConfirmation(true);
		}
	};

	const handleConfirmPublish = async () => {
		// Close the confirmation modal
		setShowPublishConfirmation(false);

		const { welfareRadioOptions, ...dataToSend } = formData;
		try {
			const response = await addPost(user.user.token, formData);
			setApiResponse(response.data);
			setIsResponseModalOpen(true);
			navigate("/employer/all-job");
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
							// navigate("/employer/all-job");
						}}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const PublishConfirmationModal = () => {
		return (
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
					<Button className={`${btn.btn_blue}`} onClick={handleConfirmPublish}>
						+ สร้างประกาศรับฝึกงาน
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const handleResetForm = (e) => {
		e.preventDefault();

		setFormData({
			job_title: "",
			location: "",
			district: "",
			subdistrict: "",
			province: "",
			pcode: "",
			work_hours: "",
			salary: hasWelfare ? "" : "-",
			contact_tel: "",
			contact_email: "",
			welfare: hasWelfare ? "" : "-",
			qualifications: "",
			desc: "",
			other: "",
			cats: [],
			categoryValues: {},
			name_to: "",
			dateStartPost: new Date(),
			dateEndPost: "",
		});
		setNewCategory("");
		setNewCategoryValue("");
		setCategoryValues({});
		setCategories([]);

		setErrors({
			...errors,
			desc: "",
			cats: "",
			dateEndPost: "",
		});
	};

	// autocomplete เก่า ใช้ jQuery
	// useEffect(() => {
	// 	try {
	// 		if (
	// 			subdistrictRef.current &&
	// 			districtRef.current &&
	// 			provinceRef.current &&
	// 			pcodeRef.current
	// 		) {
	// 			$.Thailand({
	// 				$district: $(subdistrictRef.current),
	// 				$amphoe: $(districtRef.current),
	// 				$province: $(provinceRef.current),
	// 				$zipcode: $(pcodeRef.current),
	// 				onDataFill: function (data) {
	// 					setFormData((prevData) => ({
	// 						...prevData,
	// 						subdistrict: data.district || "",
	// 						district: data.amphoe || "",
	// 						province: data.province || "",
	// 						pcode: data.zipcode || "",
	// 					}));
	// 				},
	// 			});
	// 		}
	// 	} catch (error) {
	// 		setAutoCompleteErr(error);
	// 	}
	// }, []);

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}
	// console.log(formData);

	return (
		<div className="row">
			<div className="col-12 col-xl-8">
				<div className="container p-3 p-md-4 container-card">
					<div className="d-flex justify-content-between mb-4">
						<h3 className="employerJobTitle fw-bold">สร้างประกาศรับฝึกงาน</h3>
						<button
							type="button"
							className="btn btn-sm btn-outline-secondary"
							onClick={handleResetForm}
						>
							รีเซตฟอร์ม
						</button>
					</div>

					<div className="content">
						{disabledFieldset && (
							<p className="mb-3 fw-bold p-1 border border-warning rounded">
								<span className="text-warning">
									<FontAwesomeIcon icon={faCircleInfo} />{" "}
								</span>{" "}
								<span className="text-black">
									ทางภาควิชาฯ
									จะทำการตรวจสอบและรับรองบริษัท/หน่วยงานของท่านในไม่ช้า
									จากนั้นท่านจึงจะสามารถสร้างประกาศรับนักศึกษาฝึกงานได้
									หากท่านมีข้อสงสัยกรุณาติดต่อภาควิชาฯ
								</span>
							</p>
						)}
						<form
							id="create-job-form"
							className="form-outline mb-4"
							onSubmit={handlePublish}
						>
							<fieldset disabled={disabledFieldset}>
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
												onChange={(e) => handleInputChange(e)}
												maxLength={100}
												placeholder="หัวเรื่องประกาศรับฝึกงาน"
												required
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
												onChange={(e) => handleInputChange(e)}
												rows={2}
												maxLength={255}
												placeholder="สถานที่ปฏิบัติงาน"
												required
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

											<ThailandAddressTypeahead
												value={{
													subdistrict: formData.subdistrict,
													district: formData.district,
													province: formData.province,
													postalCode: formData.pcode,
												}}
												onValueChange={handleThailandAddressChange}
											>
												<div className="col-12 col-sm-6 mb-3 form-group">
													<label
														className="form-label fw-bold"
														htmlFor="subdistrict"
													>
														ตำบล/แขวง <span className="text-danger">*</span>
													</label>
													<ThailandAddressTypeahead.SubdistrictInput
														id="subdistrict"
														className="form-control"
														placeholder="ตำบล/แขวง"
														containerProps={{
															className: "address-input-field-container",
														}}
														required
													/>
													{errors.subdistrict && (
														<p className="text-danger">{errors.subdistrict}</p>
													)}
												</div>

												<div className="col-12 col-sm-6 mb-3 form-group">
													<label
														className="form-label fw-bold"
														htmlFor="district"
													>
														อำเภอ/เขต <span className="text-danger">*</span>
													</label>
													<ThailandAddressTypeahead.DistrictInput
														id="district"
														className="form-control"
														placeholder="อำเภอ/เขต"
														containerProps={{
															className: "address-input-field-container",
														}}
														required
													/>
													{errors.district && (
														<p className="text-danger">{errors.district}</p>
													)}
												</div>

												<div className="col-12 col-sm-6 mb-3 form-group">
													<label
														className="form-label fw-bold"
														htmlFor="province"
													>
														จังหวัด <span className="text-danger">*</span>
													</label>
													<ThailandAddressTypeahead.ProvinceInput
														id="province"
														className="form-control"
														placeholder="จังหวัด"
														containerProps={{
															className: "address-input-field-container",
														}}
														required
													/>
													{errors.province && (
														<p className="text-danger">{errors.province}</p>
													)}
												</div>

												<div className="col-12 col-sm-6 mb-3 form-group">
													<label className="form-label fw-bold" htmlFor="pcode">
														รหัสไปรษณีย์ <span className="text-danger">*</span>
													</label>
													<ThailandAddressTypeahead.PostalCodeInput
														id="pcode"
														className="form-control"
														placeholder="รหัสไปรษณีย์"
														containerProps={{
															className: "address-input-field-container",
														}}
														maxLength={5}
														required
													/>
													{errors.pcode && (
														<p className="text-danger">{errors.pcode}</p>
													)}
												</div>

												<ThailandAddressTypeahead.Suggestion
													containerProps={{
														className: "suggestion-container",
													}}
													optionItemProps={{
														className: "suggestion-option",
													}}
												/>
											</ThailandAddressTypeahead>

											{/* <div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													maxLength={255}
													placeholder="ตำบล/แขวง"
													ref={subdistrictRef}
													required
												/>
												{errors.subdistrict && (
													<p className="text-danger">{errors.subdistrict}</p>
												)}
											</div>

											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													maxLength={255}
													placeholder="อำเภอ/เขต"
													ref={districtRef}
													required
												/>
												{errors.district && (
													<p className="text-danger">{errors.district}</p>
												)}
											</div> */}
										</div>
										{/* <div className="row">
											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													maxLength={255}
													placeholder="จังหวัด"
													ref={provinceRef}
													required
												/>
												{errors.province && (
													<p className="text-danger">{errors.province}</p>
												)}
											</div>
											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													placeholder="รหัสไปรษณีย์"
													ref={pcodeRef}
													required
												/>
												{errors.pcode && (
													<p className="text-danger">{errors.pcode}</p>
												)}
											</div>
										</div> */}
										<div className="row">
											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													placeholder="เช่น จ-ศ (08.30 น. - 17.30 น.)"
													maxLength={255}
													required
												/>
												{errors.work_hours && (
													<p className="text-danger">{errors.work_hours}</p>
												)}
											</div>
											{/* <div className="col-6 form-group">
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
												onChange={(e) => handleInputChange(e)}
												placeholder="เบี้ยเลี้ยง (ต่อวัน)"
											/>
											{errors.salary && (
												<p className="text-danger">{errors.salary}</p>
											)}
										</div> */}
										</div>
										<div className="form-group">
											<label className="form-label fw-bold" htmlFor="welfare">
												สวัสดิการ <span className="text-danger">*</span>
											</label>
											<br />
											<div className="form-check form-check-inline">
												<input
													className="form-check-input mb-3"
													type="radio"
													id="welfareRadio1"
													name="welfareRadioOptions"
													checked={hasWelfare === true}
													onChange={(e) => {
														setHasWelfare(e.target.checked ? true : false);
														setFormData({
															...formData,
															welfare: "",
															salary: "",
														});
													}}
												/>
												<label
													className="form-check-label"
													htmlFor="welfareRadio1"
												>
													มี
												</label>
											</div>
											<div className="form-check form-check-inline">
												<input
													className="form-check-input mb-3"
													type="radio"
													id="welfareRadio2"
													name="welfareRadioOptions"
													checked={hasWelfare === false}
													onChange={(e) => {
														setHasWelfare(e.target.checked ? false : true);
														setFormData({
															...formData,
															welfare: "-",
															salary: "-",
														});
													}}
												/>
												<label
													className="form-check-label"
													htmlFor="welfareRadio2"
												>
													ไม่มี
												</label>
											</div>
											{hasWelfare && (
												<>
													<div className="row">
														<div className="col-12 form-group">
															<label
																className="form-label fw-semibold text-muted"
																htmlFor="salary"
															>
																เบี้ยเลี้ยง{" "}
																<span className="text-danger">*</span>
															</label>
															<input
																type="text"
																id="a_salary"
																className="form-control mb-2"
																name="salary"
																value={formData.salary}
																onChange={(e) => handleInputChange(e)}
																placeholder={`เช่น 300 บาท/วัน (หากไม่มีเบี้ยเลี้ยงกรุณากรอก "-")`}
																required
															/>
															{errors.salary && (
																<p className="text-danger">{errors.salary}</p>
															)}
														</div>
														<div className="col-12 form-group">
															<label
																className="form-label fw-semibold text-muted"
																htmlFor="welfare"
															>
																สวัสดิการอื่น ๆ
															</label>
															<textarea
																type="text"
																id="welfare"
																className="form-control mb-3"
																name="welfare"
																value={formData.welfare}
																onChange={(e) => handleInputChange(e)}
																rows={4}
																// maxLength={255}
																placeholder="สวัสดิการอื่น ๆ"
															/>
															{/* <div className="d-flex justify-content-end mb-2">
																<small className="text-muted">
																	{formData.welfare.length}/255
																</small>
															</div> */}
														</div>
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
												className="form-control mb-3"
												name="qualifications"
												value={formData.qualifications}
												onChange={(e) => handleInputChange(e)}
												rows={4}
												// maxLength={255}
												placeholder="คุณสมบัติผู้สมัคร"
												required
											/>
											{errors.qualifications && (
												<p className="text-danger">{errors.qualifications}</p>
											)}
											{/* <div className="d-flex justify-content-end mb-2">
												<small className="text-muted">
													{formData.qualifications.length}/255
												</small>
											</div> */}
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
													className="form-control mb-2"
													name="dateStartPost"
													minDate={new Date()}
													required
												/>
												{errors.dateStartPost && (
													<p className="text-danger mb-0">
														{errors.dateStartPost}
													</p>
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
													className="form-control mb-2"
													name="dateEndPost"
													minDate={new Date(formData.dateStartPost)}
													required
												/>
												{/* <input
													type="date"
													id="dateEndPost"
													className="form-control mb-2"
													name="dateEndPost"
													min={`${formData.dateStartPost.getFullYear()}-01-${formData.dateStartPost.getDate()}`}
													value={formData.dateEndPost}
													onChange={(e) => handleInputChange(e)}
													required
												/> */}
												{errors.dateEndPost && (
													<p className="text-danger mb-0">
														{errors.dateEndPost}
													</p>
												)}
											</div>
										</div>

										<br />

										<div className="row">
											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													maxLength={20}
													placeholder="เบอร์ติดต่อ"
													required
												/>
												{errors.contact_tel && (
													<p className="text-danger">{errors.contact_tel}</p>
												)}
											</div>
											<div className="col-12 col-sm-6 form-group">
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
													onChange={(e) => handleInputChange(e)}
													// maxLength={255}
													placeholder="อีเมลติดต่อ"
													required
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
												placeholder="รายละเอียดงาน"
												readOnly={disabledFieldset}
											/>
											{errors.desc && (
												<p className="text-danger">{errors.desc}</p>
											)}
										</div>

										<br />

										<div className="row">
											<div className="form-group">
												<div className="d-flex flex-column flex-sm-row mb-3">
													<div className="flex-grow-1">
														<label
															className="form-label fw-bold"
															htmlFor="name_to"
														>
															ชื่อผู้รับเอกสารขอความอนุเคราะห์ ให้นำเรียน{" "}
															<span className="text-danger">*</span>
														</label>
														<input
															type="test"
															id="a_contact_tel"
															className="form-control"
															name="name_to"
															value={formData.name_to}
															onChange={(e) => handleInputChange(e)}
															placeholder="เรียน"
															required
														/>
														{errors.name_to && (
															<p className="text-danger">{errors.name_to}</p>
														)}
													</div>
													<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
														<button
															type="button"
															className={`${btn.btn_blue_outline}`}
															onClick={(e) => handleViewPdf(e)}
														>
															ดูตัวอย่างเอกสาร
														</button>
													</div>
												</div>
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
												onChange={(e) => handleInputChange(e)}
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
							</fieldset>
						</form>
					</div>
				</div>
			</div>

			<div className="col-xl-4">
				<div className="container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-none d-xl-block">
					<div className="card-body">
						<div className="d-flex justify-content-between mb-4">
							<h5 className="card-title fw-bold">ประกาศรับฝึกงาน</h5>
						</div>
						{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

						<div className="buttons">
							<fieldset disabled={disabledFieldset}>
								<div className="row">
									{/* <div className="col-12 col-xl-6 mb-2">
										<button
											className={`btn btn-sm ${btn.btn_grey_outline} w-100`}
										>
											Save as a draft
										</button>
									</div> */}
									<div className="col-12">
										<button
											type="button"
											className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
											onClick={() => setShowJobPreviewModal(true)}
										>
											<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
										</button>
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
							</fieldset>
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

						<fieldset disabled={disabledFieldset}>
							<div className="form-group">
								<input
									list="categoriesList"
									type="text"
									className="form-control mb-2"
									placeholder="เพิ่มตำแหน่งที่ต้องการรับ"
									value={newCategory}
									onChange={(e) => setNewCategory(e.target.value)}
								/>
								<input
									type="number"
									className="form-control mb-2"
									placeholder="จำนวนรับ (คน)"
									value={newCategoryValue}
									// onChange={(e) =>
									// 	e.target.value !== "0"
									// 		? setNewCategoryValue(e.target.value.replaceAll("-", ""))
									// 		: setNewCategoryValue("")
									// }
									onChange={(e) => {
										const inputValue = e.target.value.replaceAll("-", "");
										if (inputValue !== "0") {
											if (parseInt(inputValue) > 20) {
												setNewCategoryValue("20");
											} else {
												setNewCategoryValue(inputValue);
											}
										} else {
											setNewCategoryValue("");
										}
									}}
									min={1}
									max={20}
								/>
								<datalist id="categoriesList">
									{jobPositions.map((cat) => (
										<option key={cat} value={cat} />
									))}
								</datalist>
								{/* {newCategory.trim() !== "" && newCategoryValue.trim() !== "" ? (
								) : (
									<></>
								)} */}
								<button
									className={`btn btn-outline-secondary w-100 mb-2`}
									onClick={handleAddCategory}
									disabled={
										newCategory.trim() === "" ||
										newCategoryValue.trim() === "" ||
										newCategoryValue.trim() === ""
									}
								>
									+ เพิ่มตำแหน่งงาน
								</button>
							</div>

							<ul className="list-unstyled list-group list-group-flush">
								{categories.map((cat, index) => (
									// <div key={index} className="form-check mt-2">
									// 	<input
									// 		type="checkbox"
									// 		className="form-check-input"
									// 		checked={categories.includes(cat)}
									// 		id={cat}
									// 		onChange={() => handleCategoryChange(cat)}
									// 	/>
									// 	<label className="form-check-label" htmlFor={cat}>
									// 		{cat} - {categoryValues[cat]}
									// 	</label>
									// </div>
									<li
										key={index}
										className="list-group-item list-group-item-action list-group-item-light"
									>
										<FontAwesomeIcon
											icon={faSquareMinus}
											onClick={() => handleCategoryChange(cat)}
											className="text-danger"
											style={{ cursor: "pointer" }}
										/>{" "}
										<span className="fw-semibold">{cat}</span> (
										{categoryValues[cat]} คน)
									</li>
								))}
							</ul>

							<hr />
							<small className="text-muted">
								(หากต้องการแก้ไขจำนวนรับของตำแหน่งที่เพิ่มไว้
								สามารถเพิ่มซ้ำแล้วเปลี่ยนจำนวนรับได้เลย)
							</small>
						</fieldset>
					</div>
				</div>

				<Modal
					show={showResumeModal}
					fullscreen="lg-down"
					onHide={() => setShowResumeModal(false)}
					centered
					size="lg"
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">
							ตัวอย่างหนังสือขอความอนุเคราะห์ฝึกงาน
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
								<Viewer
									fileUrl={
										import.meta.env.VITE_FILE_API + "/uploads/example.pdf"
									}
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
						<Button
							variant="secondary"
							onClick={() => setShowResumeModal(false)}
						>
							ปิด
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					show={showJobPreviewModal}
					fullscreen={true}
					onHide={() => setShowJobPreviewModal(false)}
					centered
					size="xl"
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">ตัวอย่าง</Modal.Title>
					</Modal.Header>
					<Modal.Body className="bg-light">
						<JobPreview formData={formData} />
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => {
								setShowJobPreviewModal(false);
							}}
						>
							ปิด
						</Button>
					</Modal.Footer>
				</Modal>

				<PublishCard />

				<PublishConfirmationModal />
				<ResponseModal />
			</div>
		</div>
	);

	function PublishCard() {
		return (
			<div
				className={`container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-block d-xl-none`}
			>
				<div className="card-body">
					<div className="d-flex justify-content-between mb-4">
						<h5 className="card-title fw-bold">ประกาศรับฝึกงาน</h5>
					</div>
					{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

					<div className="buttons">
						<fieldset disabled={disabledFieldset}>
							<div className="row">
								{/* <div className="col-12 col-xl-6 mb-2">
									<button
										className={`btn btn-sm ${btn.btn_grey_outline} w-100`}
									>
										Save as a draft
									</button>
								</div> */}
								<div className="col-12">
									<button
										type="button"
										className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
										onClick={() => setShowJobPreviewModal(true)}
									>
										<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
									</button>
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
						</fieldset>
					</div>
				</div>
			</div>
		);
	}

	// function JobPreviewModal() {
	// 	return (
	// 		<Modal
	// 			show={showJobPreviewModal}
	// 			fullscreen={true}
	// 			onHide={() => setShowJobPreviewModal(false)}
	// 			centered
	// 			size="xl"
	// 		>
	// 			<Modal.Header closeButton>
	// 				<Modal.Title>Preview</Modal.Title>
	// 			</Modal.Header>
	// 			<Modal.Body>
	// 				<JobPreview formData={formData} />
	// 			</Modal.Body>
	// 			<Modal.Footer>
	// 				<Button
	// 					variant="secondary"
	// 					onClick={() => {
	// 						setShowJobPreviewModal(false);
	// 					}}
	// 				>
	// 					ปิด
	// 				</Button>
	// 			</Modal.Footer>
	// 		</Modal>
	// 	);
	// }

	// function JobPreviewModal() {
	// 	return (
	// 		<>
	// 			<button
	// 				type="button"
	// 				className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
	// 				data-bs-toggle="modal"
	// 				data-bs-target="#jobPreviewModal"
	// 			>
	// 				Preview
	// 			</button>

	// 			<div
	// 				className="modal fade"
	// 				id="jobPreviewModal"
	// 				tabIndex={-1}
	// 				aria-labelledby="jobPreviewModalLabel"
	// 				aria-hidden="true"
	// 			>
	// 				<div className="modal-dialog modal-xl modal-fullscreen-lg-down">
	// 					<div className="modal-content">
	// 						<div className="modal-header">
	// 							<h1 className="modal-title fs-5" id="jobPreviewModalLabel">
	// 								Preview
	// 							</h1>
	// 							<button
	// 								type="button"
	// 								className="btn-close"
	// 								data-bs-dismiss="modal"
	// 								aria-label="Close"
	// 							></button>
	// 						</div>
	// 						<div className="modal-body bg-light">
	// 							<JobPreview formData={formData} />
	// 						</div>
	// 						<div className="modal-footer">
	// 							<button
	// 								type="button"
	// 								className={`btn btn-sm ${btn.btn_grey}`}
	// 								data-bs-dismiss="modal"
	// 							>
	// 								ปิดหน้าต่าง
	// 							</button>
	// 							{/* <button
	// 								type="button"
	// 								className={`btn btn-sm ${btn.btn_blue}`}
	// 								onClick={handlePublish}
	// 							>
	// 								Publish Now
	// 							</button> */}
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</div>

	// 			{/* <Modal
	// 				show={showPublishConfirmation}
	// 				onHide={() => setShowPublishConfirmation(false)}
	// 				centered
	// 			>
	// 				<Modal.Header closeButton>
	// 					<Modal.Title className="fw-bold">
	// 						ยืนยันการสร้างประกาศรับนักศึกษาฝึกงาน
	// 					</Modal.Title>
	// 				</Modal.Header>
	// 				<Modal.Body>
	// 					<p>คุณยืนยันที่จะสร้างประกาศรับนักศึกษาฝึกงานนี้ ?</p>
	// 				</Modal.Body>
	// 				<Modal.Footer>
	// 					<Button
	// 						variant="secondary"
	// 						onClick={() => setShowPublishConfirmation(false)}
	// 					>
	// 						ปิด
	// 					</Button>
	// 					<Button
	// 						className={`${btn.btn_blue}`}
	// 						onClick={handleConfirmPublish}
	// 					>
	// 						สร้างประกาศรับฝึกงาน
	// 					</Button>
	// 				</Modal.Footer>
	// 			</Modal> */}
	// 		</>
	// 	);
	// }
}

export default EmCreateJob;
