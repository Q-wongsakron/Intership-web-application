import React, { useState } from "react";
import btn from "../../components/btn.module.css";
import PageNotFound from "../PageNotFound";

import { adminLogin as login } from "../../services/auth.service";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../store/userSlice";

import { useSelector } from "react-redux/es/hooks/useSelector";

function AdminLogin() {
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
				dispatch(
					loginRedux({
						token: res.data.token,
						username: res.data.payload.user.username, // will delete
						role: res.data.payload.user.role, //
					})
				);
				localStorage.setItem("token", res.data.token);

				navigate("/admin");
			})
			.catch((err) => {
				if (err.response && err.response.status === 400) {
					setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
				} else {
					console.error(
						"Login failed: ",
						err.response ? err.response.data : err.message
					);
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

	const { user } = useSelector((state) => ({ ...state }));

	return !(user && user.user.token) ? (
		<div className="bg-light h-100">
			<div className="container p-5">
				<div className="row justify-content-center align-items-center h-100">
					<div className="col-12 col-md-8 col-lg-6 col-xl-5 h-100">
						<div className={`login_card h-100`}>
							<div className="card-body p-4">
								<h2 className="text-center">เข้าสู่ระบบ (แอดมิน)</h2>

								<hr className="my-4" />

								<p className="text-center text-muted">กรุณาเข้าสู่ระบบ</p>

								<form
									id="admin-signin-form"
									className="form-outline mb-4"
									onSubmit={handleSubmit}
								>
									<br />
									<div className="mb-3">
										{/* <label className="form-label" htmlFor="inputUsername">
											ชื่อผู้ใช้
										</label> */}
										<input
											type="username"
											id="inputUsername"
											className="form-control p-3"
											placeholder="ชื่อผู้ใช้"
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
	) : user.user.role === "admin" ? (
		<PageNotFound />
	) : (
		<PageNotFound />
	);
}

export default AdminLogin;
