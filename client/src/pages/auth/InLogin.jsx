import React, { useState } from "react";
import btn from "../../components/btn.module.css";

import { studentLogin as login } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../store/userSlice";

function InLogin() {
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();
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
				console.log(res);
				console.log(res.data);

				dispatch(
					loginRedux({
						token: res.data.token,
						username: res.data.payload.user.username, // will delete
						role: res.data.payload.user.role, //
					})
				);
				localStorage.setItem("token", res.data.token);

				navigate("/student"); // need to check if user is student or teacher or head?
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
					// setErrorMessage(err.response ? err.response.data.message : "");
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

	return (
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
	);
}

export default InLogin;
