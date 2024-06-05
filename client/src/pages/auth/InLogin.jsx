import React, { useState } from "react";
import btn from "../../components/btn.module.css";
import PageNotFound from "../PageNotFound";

import { studentLogin as login } from "../../services/auth.service";
import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../store/userSlice";

import { useSelector } from "react-redux/es/hooks/useSelector";

function InLogin() {
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const handleInputChange = (e) => {
		e.preventDefault();

		const { name, value } = e.target;

		setFormData({
			...formData,
			[name]: value,
		});
		setErrorMessage(null);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		login(formData)
			.then((res) => {
				// console.log(res);
				// console.log(res.data);

				dispatch(
					loginRedux({
						token: res.data.token,
						username: res.data.payload.user.username, //
						role: res.data.payload.user.role, //
						status: res.data.payload.user.status, //
					})
				);
				localStorage.setItem("token", res.data.token);

				if (location.pathname === "/student/self-enroll") {
					navigate("/student/self-enroll");
				} else {
					if (res.data.payload.user.role === "student") {
						navigate(
							location?.state?.prevUrl
								? location?.state?.prevUrl
								: "/student/internship"
						);
					} else if (res.data.payload.user.role === "teacher") {
						navigate("/teacher/student-monitor");
					} else if (res.data.payload.user.role === "head") {
						navigate("/head/approve-docs");
					} else if (res.data.payload.user.role === "secretary") {
						navigate("/secretary/setup-docs");
					} else {
						navigate("/");
					}
				}
			})
			.catch((err) => {
				if (err.response && err.response.status === 400) {
					setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
					// setErrorMessage(err.response ? err.response.data.message : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
				} else {
					console.error(
						"Login failed: ",
						err.response ? err.response.data : err.message
					);
					setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
					//setErrorMessage(err.response ? err.response.data : '');
				}
			});
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

	const user = useSelector((state) => state.user);

	return !(user && user.user.token) ? (
		<div className="bg-light h-100">
			<div className="container p-5">
				<div className="row justify-content-center align-items-center h-100">
					<div className="col-12 col-md-8 col-lg-6 col-xl-5 h-100">
						<div className={`login_card h-100`}>
							<div className="card-body p-4">
								<h2 className="text-center">เข้าสู่ระบบ (นักศึกษา/บุคลากร)</h2>

								<hr className="my-4" />

								<p className="text-center text-muted">เข้าสู่ระบบด้วย Reg TU</p>

								<form
									id="internal-signin-form"
									className="form-outline mb-4"
									onSubmit={handleSubmit}
								>
									<br />
									<div className="mb-3">
										{/* <label className="form-label" htmlFor="inputUsername">
											เลขทะเบียนนักศึกษา/รหัสผู้ใช้
										</label> */}
										<input
											type="username"
											id="inputUsername"
											className="form-control p-3"
											placeholder="เลขทะเบียนนักศึกษา/รหัสผู้ใช้"
											name="username"
											value={formData.username}
											onChange={handleInputChange}
											required
										/>
									</div>

									<div className="mb-3">
										{/* <label className="form-label" htmlFor="inputPassword">
											รหัสผ่าน
										</label> */}
										<input
											type="password"
											id="inputPassword"
											className="form-control p-3"
											placeholder="รหัสผ่าน"
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											required
										/>
									</div>

									{errorMessage && (
										<p className="text-danger">{errorMessage}</p>
									)}

									<button
										className={`${btn.btn_blue} w-100 py-2 fs-5`}
										type="submit"
									>
										เข้าสู่ระบบ
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : user.user.role === "student" ||
	  user.user.role === "teacher" ||
	  user.user.role === "head" ||
	  user.user.role === "secretary" ? (
		<PageNotFound />
	) : (
		<PageNotFound />
	);
}

export default InLogin;
