import React, { useState } from "react";
import styles from "../../components/btn.module.css";

import { employerLogin as login } from "../../services/auth.service";
import { employerRegister as register } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

import PrivacyPolicyPopup from "../../components/PrivacyPolicyPopup";

import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../store/userSlice";

function ExRegister() {
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	// const data = new FormData(document.getElementById("external-register-form"));
	// const form = {
	// 	username: data.get("username"),
	// 	password: data.get("password"),
	// 	company_name: data.get("company_name"),
	// 	address: data.get("address"),
	// 	subdistrict: data.get("subdistrict"),
	// 	district: data.get("district"),
	// 	province: data.get("province"),
	// 	country: data.get("country"),
	// 	pcode: data.get("pcode"),
	// 	contact_name: data.get("contact_name"),
	// 	contact_email: data.get("contact_email"),
	// 	contact_tel: data.get("contact_tel"),
	// };

	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		company_name: "",
		address: "",
		subdistrict: "",
		district: "",
		province: "",
		country: "",
		pcode: "",
		contact_name: "",
		contact_email: "",
		contact_tel: "",
	});
	const formToSend = {
		username: formData.username,
		password: formData.password,
		company_name: formData.company_name,
		address: formData.address,
		subdistrict: formData.subdistrict,
		district: formData.district,
		province: formData.province,
		country: formData.country,
		pcode: formData.pcode,
		contact_name: formData.contact_name,
		contact_email: formData.contact_email,
		contact_tel: formData.contact_tel,
	};
	const [errors, setErrors] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		company_name: "",
		address: "",
		subdistrict: "",
		district: "",
		province: "",
		country: "",
		pcode: "",
		contact_name: "",
		contact_email: "",
		contact_tel: "",
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
	const handleUsernameChange = (e) => {
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
		setErrorMessage("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const newErrors = {};
		if (!formData.username.trim()) {
			newErrors.username = "กรุณากรอกชื่อผู้ใช้";
		}
		if (!formData.password.trim()) {
			newErrors.password = "กรุณากรอกรหัสผ่าน";
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
		}
		if (!formData.contact_name.trim()) {
			newErrors.contact_name = "กรุณากรอกชื่อผู้ติดต่อ";
		}
		if (!formData.contact_email.trim()) {
			newErrors.contact_email = "กรุณากรอกอีเมลผู้ติดต่อ";
		}
		if (!formData.contact_tel.trim()) {
			newErrors.contact_tel = "กรุณากรอกเบอร์ติดต่อ";
		}

		if (!formData.company_name.trim()) {
			newErrors.company_name = "กรุณากรอกชื่อบริษัท/หน่วยงานของท่าน";
		}
		if (!formData.country.trim()) {
			newErrors.country = "กรุณากรอกประเทศ";
		}
		if (!formData.province.trim()) {
			newErrors.province = "กรุณากรอกจังหวัด";
		}
		if (!formData.district.trim()) {
			newErrors.district = "กรุณากรอกอำเภอ";
		}
		if (!formData.subdistrict.trim()) {
			newErrors.subdistrict = "กรุณากรอกตำบล";
		}
		if (!formData.pcode.trim()) {
			newErrors.pcode = "กรุณากรอกรหัสไปรษณีย์";
		}
		if (!formData.address.trim()) {
			newErrors.address = "กรุณากรอกที่อยู่บริษัท/หน่วยงานของท่าน";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
		} else {
			register(formToSend)
				.then((res) => {
					if (res.data === "User already Exits!!") {
						setErrorMessage("ชื่อผู้ใช้นี้ถูกใช้งานแล้ว");
					} else {
						const formToLogin = {
							username: formData.username,
							password: formData.password,
						};

						login(formToLogin)
							.then((res) => {
								dispatch(
									loginRedux({
										token: res.data.token,
										username: res.data.payload.user.username, // will delete
										role: res.data.payload.user.role, //
									})
								);
								localStorage.setItem("token", res.data.token);
								// localStorage.setItem("role", res.data.payload.user.role);

								navigate("/");
							})
							.catch((err) => {
								if (err.response && err.response.status === 401) {
									setErrorMessage(err.response.data.message);
								} else {
									console.error(
										"Login failed: ",
										err.response ? err.response.data : err.message
									);
								}
							});
					}
				})
				.catch((err) => {
					if (err.response && err.response.status === 401) {
						setErrorMessage(err.response.data.message);
					} else {
						console.error(
							"Register failed: ",
							err.response ? err.response.data : err.message
						);
					}
				});
		}
	};

	const roleRedirects = (role) => {
		if (role === "admin") {
			navigate("/admin/index");
		} else if (role === "student") {
			navigate("/student");
		} else if (role === "teacher") {
			navigate("/teacher");
		} else {
			navigate("/user/index");
		}
	};

	return (
		<div className="bg-light">
			<div className="container p-5 h-100">
				<div className="row justify-content-center align-items-center h-100">
					<div className="col-12 col-md-10 col-lg-8 col-xl-8 h-100">
						<div className={`login_card h-100`}>
							<div className="card-body p-4">
								<h2 className="text-center">ลงทะเบียน (บริษัท/หน่วยงาน)</h2>

								<hr className="my-4" />

								<p className="text-center text-muted">กรุณาลงทะเบียน</p>

								<form
									id="external-register-form"
									className="form-outline mb-4"
									onSubmit={handleSubmit}
								>
									<div className="row">
										<div className="col-sm mx-2">
											<br />
											<p className="text-center text-muted">ข้อมูลผู้ใช้</p>
											<div className="mb-3">
												<label className="form-label" htmlFor="username">
													ชื่อผู้ใช้ <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="username"
													className="form-control"
													name="username"
													value={formData.username}
													onChange={handleUsernameChange}
												/>
												{(errors.username || errorMessage) && (
													<p className="text-danger">
														{errors.username ? errors.username : errorMessage}
													</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="password">
													รหัสผ่าน <span className="text-danger">*</span>
												</label>
												<input
													type="password"
													id="password"
													className="form-control"
													name="password"
													value={formData.password}
													onChange={handleInputChange}
												/>
												{errors.password && (
													<p className="text-danger">{errors.password}</p>
												)}
											</div>
											<div className="mb-3">
												<label className="form-label" htmlFor="confirmPassword">
													ยืนยันรหัสผ่าน <span className="text-danger">*</span>
												</label>
												<input
													type="password"
													id="confirmPassword"
													className="form-control"
													name="confirmPassword"
													value={formData.confirmPassword}
													onChange={handleInputChange}
												/>
												{errors.confirmPassword && (
													<p className="text-danger">
														{errors.confirmPassword}
													</p>
												)}
											</div>

											<br />
											<p className="text-center text-muted">ข้อมูลการติดต่อ</p>
											<div className="mb-3">
												<label className="form-label" htmlFor="contact_name">
													ชื่อผู้ติดต่อ (ชื่อ-นามสกุล){" "}
													<span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="contact_name"
													className="form-control"
													name="contact_name"
													value={formData.contact_name}
													onChange={handleInputChange}
												/>
												{errors.contact_name && (
													<p className="text-danger">{errors.contact_name}</p>
												)}
											</div>
											<div className="mb-3">
												<label className="form-label" htmlFor="contact_email">
													อีเมลติดต่อ <span className="text-danger">*</span>
												</label>
												<input
													type="email"
													id="contact_email"
													className="form-control"
													name="contact_email"
													value={formData.contact_email}
													onChange={handleInputChange}
												/>
												{errors.contact_email && (
													<p className="text-danger">{errors.contact_email}</p>
												)}
											</div>
											<div className="mb-3">
												<label className="form-label" htmlFor="contact_tel">
													เบอร์ติดต่อ <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="contact_tel"
													className="form-control"
													name="contact_tel"
													value={formData.contact_tel}
													onChange={handleInputChange}
												/>
												{errors.contact_tel && (
													<p className="text-danger">{errors.contact_tel}</p>
												)}
											</div>
										</div>

										<div className="col-sm mx-2">
											<br />
											<p className="text-center text-muted">
												ข้อมูลบริษัท/หน่วยงาน
											</p>

											<div className="mb-3">
												<label className="form-label" htmlFor="company_name">
													ชื่อบริษัท/หน่วยงาน{" "}
													<span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="company_name"
													className="form-control"
													name="company_name"
													value={formData.company_name}
													onChange={handleInputChange}
												/>
												{errors.company_name && (
													<p className="text-danger">{errors.company_name}</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="country">
													ประเทศ <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="country"
													className="form-control"
													name="country"
													value={formData.country}
													onChange={handleInputChange}
												/>
												{errors.country && (
													<p className="text-danger">{errors.country}</p>
												)}
											</div>
											<div className="mb-3">
												<label className="form-label" htmlFor="province">
													จังหวัด <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="province"
													className="form-control"
													name="province"
													value={formData.province}
													onChange={handleInputChange}
												/>
												{errors.province && (
													<p className="text-danger">{errors.province}</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="district">
													อำเภอ <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="district"
													className="form-control"
													name="district"
													value={formData.district}
													onChange={handleInputChange}
												/>
												{errors.district && (
													<p className="text-danger">{errors.district}</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="subdistrict">
													ตำบล <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="subdistrict"
													className="form-control"
													name="subdistrict"
													value={formData.subdistrict}
													onChange={handleInputChange}
												/>
												{errors.subdistrict && (
													<p className="text-danger">{errors.subdistrict}</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="pcode">
													รหัสไปรษณีย์ <span className="text-danger">*</span>
												</label>
												<input
													type="text"
													id="pcode"
													className="form-control mb-3"
													name="pcode"
													value={formData.pcode}
													onChange={handleInputChange}
												/>
												{errors.pcode && (
													<p className="text-danger">{errors.pcode}</p>
												)}
											</div>

											<div className="mb-3">
												<label className="form-label" htmlFor="address">
													ที่อยู่บริษัท/หน่วยงาน{" "}
													<span className="text-danger">*</span>
												</label>
												{/* <input
													type="text"
													id="address"
													className="form-control"
													name="address"
													value={formData.address}
													onChange={handleInputChange}
												/> */}
												<textarea
													className="form-control"
													name="address"
													id="address"
													rows="2"
													value={formData.address}
													onChange={handleInputChange}
												/>
												{errors.address && (
													<p className="text-danger">{errors.address}</p>
												)}
											</div>
										</div>
									</div>

									<br />
									<button
										className={`${styles.btn_blue} w-100 py-2 fs-5 mb-3`}
										type="submit"
									>
										ลงทะเบียน
									</button>

									<PrivacyPolicyPopup />
								</form>

								<p className="text-end">
									มีบัญชีผู้ใช้อยู่แล้ว ?{" "}
									<Link className="a-text" to={"/external/login"}>
										เข้าสู่ระบบ
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExRegister;
