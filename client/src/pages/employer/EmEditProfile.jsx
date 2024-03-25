import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";

import { useSelector } from "react-redux";
import axios from "axios";
import {
	putEmployerProfile,
	getEmployerProfile,
} from "../../services/user.service";

function EmEditProfile() {
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const { user } = useSelector((state) => ({ ...state }));

	const [formData, setFormData] = useState({
		company_name: "",
		address: "",
		subdistrict: "",
		district: "",
		province: "",
		pcode: "",
		contact_name: "",
		contact_email: "",
		contact_tel: "",
		about: "",
		company_pic: "",
	});
	const [errors, setErrors] = useState({
		company_name: "",
		address: "",
		subdistrict: "",
		district: "",
		province: "",
		pcode: "",
		contact_name: "",
		contact_email: "",
		contact_tel: "",
		about: "",
		company_pic: "",
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
			const res = await getEmployerProfile(authtoken);

			setFormData({
				company_name: res.data.profile.company_name || "",
				address: res.data.profile.address || "",
				subdistrict: res.data.profile.subdistrict || "",
				district: res.data.profile.district || "",
				province: res.data.profile.province || "",
				pcode: res.data.profile.pcode || "",
				contact_name: res.data.profile.contact_name || "",
				contact_email: res.data.profile.contact_email || "",
				contact_tel: res.data.profile.contact_tel || "",
				about: res.data.profile.about || "",
				company_pic: res.data.profile.company_pic || "",
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

	const handleUpdateProfile = async (e) => {
		e.preventDefault();

		setLoading(true);
		try {
			await putEmployerProfile(user.user.token, formData);

			const formDataImg = new FormData();
			formDataImg.append("EmployerImg", formData.employer_img);
			await axios.put("http://localhost:5500/api/uploadEmployerImg", formDataImg, {
				headers: {
					"Content-Type": "multipart/form-data",
					authtoken: user.user.token, 
				},
				});

			navigate("/employer/profile");
		} catch (error) {
			console.error(
				"Update Profile Failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}

		// await putEmployerProfile(user.user.token, formData)
		// 	.then((res) => {
		// 		console.log(formData);
		// 		navigate("/employer/profile");
		// 	})
		// 	.catch((err) => {
		// 		console.error(
		// 			"Update Profile Failed: ",
		// 			err.response ? err.response.data : err.message
		// 		);
		// 	});
	};
	const handleEmployerImageFileChange = (e) => {
		const file = e.target.files[0];
		setFormData({
			...formData,
			employer_img: file,
		});
	};

	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between">
					<h3 className="std-profile-title mb-3 fw-bold">
						ข้อมูลของบริษัท/หน่วยงาน
					</h3>
					<button className="btn btn-secondary d-none">แก้ไขข้อมูล</button>
				</div>

				<form
					id="edit-employer-profile-form"
					className="form-outline mb-4"
					onSubmit={handleUpdateProfile}
				>
					<div className="row">
						<div className="col-12">
							<div className="px-2 pt-3">
								<div className="row">
									<p className="text-center text-muted fw-bold">
										ข้อมูลบริษัท/หน่วยงาน
									</p>
									<div className="col-sm-12">
										<label
											className="form-label fw-bold"
											htmlFor="company_name"
										>
											ชื่อบริษัท/หน่วยงาน <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="company_name"
											className="form-control mb-2"
											name="company_name"
											value={formData.company_name}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
								</div>

								<div className="row mt-3">
									<div className="col-sm-12">
										<p className="fw-bold">เกี่ยวกับเรา</p>
										<textarea
											type="text"
											id="about"
											className="form-control mb-2"
											name="about"
											value={formData.about}
											onChange={handleInputChange}
											rows={3}
											maxLength={1000}
										/>
										<div className="d-flex justify-content-end">
											<small className="text-muted">
												{formData.about.length}/1000
											</small>
										</div>
									</div>
								</div>

								<div className="row mt-3">
									<div className="col-sm-12 mt-2 mt-sm-0">
										<p className="fw-bold">รูปโปรไฟล์</p>
										<input
											className="form-control"
											type="file"
											id="EmployerImg"
											accept=".jpg, .png"
											
											onChange={handleEmployerImageFileChange}
										/>
									</div>
								</div>

								<div className="row mt-5">
									<p className="text-center text-muted fw-bold">
										ที่ตั้งบริษัท/หน่วยงาน
									</p>
									<div className="col-sm-12 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="address">
											ที่อยู่บริษัท/หน่วยงาน{" "}
											<span className="text-danger">*</span>
										</label>
										<textarea
											type="text"
											id="address"
											className="form-control mb-2"
											name="address"
											value={formData.address}
											onChange={handleInputChange}
											rows={2}
											maxLength={255}
											required
										/>
										<div className="d-flex justify-content-end">
											<small className="text-muted">
												{formData.address.length}/255
											</small>
										</div>
									</div>
								</div>

								<div className="row mt-3">
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="subdistrict">
											ตำบล/แขวง <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="subdistrict"
											className="form-control mb-2"
											name="subdistrict"
											value={formData.subdistrict}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="district">
											อำเภอ/เขต <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="district"
											className="form-control mb-2"
											name="district"
											value={formData.district}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="province">
											จังหวัด <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="province"
											className="form-control mb-2"
											name="province"
											value={formData.province}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="pcode">
											รหัสไปรษณีย์ <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="pcode"
											className="form-control mb-2"
											name="pcode"
											value={formData.pcode}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
								</div>

								<div className="row mt-5">
									<p className="text-center text-muted fw-bold">
										ข้อมูลการติดต่อ
									</p>
									<div className="col-sm-6">
										<label
											className="form-label fw-bold"
											htmlFor="contact_name"
										>
											ชื่อผู้ติดต่อ (ชื่อ-นามสกุล){" "}
											<span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="contact_name"
											className="form-control mb-2"
											name="contact_name"
											value={formData.contact_name}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label
											className="form-label fw-bold"
											htmlFor="contact_email"
										>
											อีเมลติดต่อ <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="contact_email"
											className="form-control mb-2"
											name="contact_email"
											value={formData.contact_email}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
									<div className="col-sm-6 mt-2 mt-sm-0">
										<label className="form-label fw-bold" htmlFor="contact_tel">
											เบอร์ติดต่อ <span className="text-danger">*</span>
										</label>
										<input
											type="text"
											id="contact_tel"
											className="form-control mb-2"
											name="contact_tel"
											value={formData.contact_tel}
											onChange={handleInputChange}
											maxLength={100}
											required
										/>
									</div>
								</div>
							</div>
							<br />
							<div className="d-flex justify-content-center">
								<button
									type="submit"
									form="edit-employer-profile-form"
									className={`${btn.btn_blue} w-100`}
								>
									อัปเดตข้อมูล
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default EmEditProfile;
