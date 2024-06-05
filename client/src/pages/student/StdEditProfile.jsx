import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import Form from "react-bootstrap/Form";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

import {
	putStudentProfile,
	getStudentProfile,
} from "../../services/user.service";

function StdEditProfile() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);

	const navigate = useNavigate();

	const user = useSelector((state) => state.user);

	const [characters_th, setCharacters_th] = useState([
		{
			label: "เลือก...",
			value: "Select...",
		},
		{
			label: "นาย",
			value: "นาย",
		},
		{
			label: "นาง",
			value: "นาง",
		},
		{
			label: "นางสาว",
			value: "นางสาว",
		},
	]);

	const [characters_en, setCharacters_en] = useState([
		{
			label: "Select ...",
			value: "Select ...",
		},
		{
			label: "Mr.",
			value: "Mr.",
		},
		{
			label: "Mrs.",
			value: "Mrs.",
		},
		{
			label: "Miss",
			value: "Miss",
		},
	]);

	const [formData, setFormData] = useState({
		name_title_th: "",
		displayname_th: "",
		name_title_en: "",
		displayname_en: "",
		email: "",
		experience: "",
		skill: "",
		gpa: "",
		tel: "",
	});
	const [errors, setErrors] = useState({
		name_title_th: "",
		displayname_th: "",
		name_title_en: "",
		displayname_en: "",
		email: "",
		experience: "",
		skill: "",
		gpa: "",
		tel: "",
	});

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
	};

	const loadData = async (authtoken) => {
		try {
			const res = await getStudentProfile(authtoken);
			setData(res.data);

			// Set default values for input fields based on the fetched data
			setFormData({
				name_title_th: res.data.name_title_th || "", // provide default value if
				displayname_th: res.data.displayname_th || "", // provide default value if undefined
				name_title_en: res.data.name_title_en || "", // provide default value
				displayname_en: res.data.displayname_en || "",
				email: res.data.email || "",
				experience: res.data.experience || "",
				skill: res.data.skill || "",
				gpa: res.data.gpa || "",
				tel: res.data.tel || "",
			});
		} catch (err) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateBtnClick = (e) => {
		e.preventDefault();

		setShowUpdateConfirmation(true);
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		setShowUpdateConfirmation(false);
		setLoading(true);
		try {
			await putStudentProfile(user.user.token, formData);
			navigate("/student/profile");
		} catch (error) {
			console.error(
				"Update Profile Failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}

		// await putStudentProfile(user.user.token, formData)
		// 	.then((res) => {
		// 		console.log(formData);
		// 		navigate("/student/profile");
		// 	})
		// 	.catch((err) => {
		// 		console.error(
		// 			"Update Profile Failed: ",
		// 			err.response ? err.response.data : err.message
		// 		);
		// 	});
	};

	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	// console.log("select value", formData);
	return (
		<>
			<div className="container p-3 p-md-4 container-card stdProfileCard">
				<div className="d-flex justify-content-between">
					<h3 className="stdProfileTitle mb-3 fw-bold">ข้อมูลของฉัน</h3>
					<button className="btn btn-secondary d-none">แก้ไขข้อมูล</button>
				</div>
				<form
					id="edit-student-profile-form"
					className="form-outline mb-4"
					onSubmit={handleUpdateBtnClick}
				>
					<div className="row">
						<div className="col-12">
							<div className="stdProfileDetail px-2 pt-3">
								<div className="row">
									<div className="col-md-6">
										<p className="fw-bold">
											ชื่อ-นามสกุล <span className="text-danger">*</span>
										</p>
										<div className="input-group mb-2">
											<select
												value={formData.name_title_th}
												className="form-select"
												onChange={handleInputChange}
												name="name_title_th"
											>
												{characters_th.map((character, i) => (
													<option key={character.value} value={character.value}>
														{character.label}
													</option>
												))}
											</select>

											<input
												type="text"
												id="displayname_th"
												className="form-control w-75"
												name="displayname_th"
												value={formData.displayname_th}
												onChange={handleInputChange}
												maxLength={100}
												required
											/>
										</div>
									</div>
									<div className="col-md-6 mt-2 mt-sm-0">
										<p className="fw-bold">
											ชื่อ-นามสกุล (ภาษาอังกฤษ){" "}
											<span className="text-danger">*</span>
										</p>
										<div className="input-group mb-2">
											<select
												value={formData.name_title_en}
												className="form-select"
												onChange={handleInputChange}
												name="name_title_en"
											>
												{characters_en.map((character, i) => (
													<option key={character.value} value={character.value}>
														{character.label}
													</option>
												))}
											</select>
											<input
												type="text"
												id="displayname_en"
												className="form-control w-75"
												name="displayname_en"
												value={formData.displayname_en}
												onChange={handleInputChange}
												maxLength={100}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-sm-6">
										<p className="fw-bold">เลขทะเบียน</p>
										{data ? (
											<h6>{data.std_id}</h6>
										) : (
											<p className="text-muted">-</p>
										)}
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<p className="fw-bold">ภาควิชา</p>
										{data ? (
											<h6>{data.department}</h6>
										) : (
											<p className="text-muted">-</p>
										)}
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-sm-6">
										<p className="fw-bold">คณะ</p>
										{data ? (
											<h6>{data.faculty}</h6>
										) : (
											<p className="text-muted">-</p>
										)}
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<p className="fw-bold">GPA</p>
										<input
											type="text"
											id="gpa"
											className="form-control mb-2"
											name="gpa"
											value={formData.gpa}
											onChange={handleInputChange}
											maxLength={100}
										/>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-sm-6">
										<p className="fw-bold">ประสบการณ์</p>
										{/* <input
											type="text"
											id="experience"
											className="form-control mb-2"
											name="experience"
											value={formData.experience}
											onChange={handleInputChange}
											maxLength={255}
										/> */}
										<textarea
											type="text"
											id="experience"
											className="form-control mb-2"
											name="experience"
											value={formData.experience}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
										/>
										<div className="d-flex justify-content-end">
											<small className="text-muted">
												{formData.experience.length}/255
											</small>
										</div>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<p className="fw-bold">ทักษะ</p>
										{/* <input
											type="text"
											id="skill"
											className="form-control mb-2"
											name="skill"
											value={formData.skill}
											onChange={handleInputChange}
											maxLength={255}
										/> */}
										<textarea
											type="text"
											id="skill"
											className="form-control mb-2"
											name="skill"
											value={formData.skill}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
										/>
										<div className="d-flex justify-content-end">
											<small className="text-muted">
												{formData.skill.length}/255
											</small>
										</div>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-sm-6">
										<p className="fw-bold">
											อีเมล <span className="text-danger">*</span>
										</p>
										<input
											type="email"
											id="email"
											className="form-control mb-2"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											maxLength={255}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<p className="fw-bold">โทรศัพท์</p>
										<input
											type="tel"
											id="tel"
											className="form-control mb-2"
											name="tel"
											value={formData.tel}
											onChange={handleInputChange}
											pattern="[0-9]{10}"
										/>
									</div>
								</div>
							</div>
							<br />
							<div className="d-flex justify-content-center">
								<button
									type="submit"
									form="edit-student-profile-form"
									className={`${btn.btn_blue} w-100`}
								>
									อัปเดตข้อมูล
								</button>
							</div>
						</div>
					</div>
				</form>

				<Modal
					show={showUpdateConfirmation}
					onHide={() => setShowUpdateConfirmation(false)}
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">อัปเดตข้อมูล</Modal.Title>
					</Modal.Header>
					<Modal.Body>ยืนยันการอัปเดตข้อมูล ?</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => setShowUpdateConfirmation(false)}
						>
							ปิด
						</Button>
						<Button className={`${btn.btn_blue}`} onClick={handleUpdateProfile}>
							ยืนยัน
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	);
}

export default StdEditProfile;
