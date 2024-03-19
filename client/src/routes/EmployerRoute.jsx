import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Routes, useLocation } from "react-router-dom";

import ExLogin from "../pages/auth/ExLogin";
import PageNotFound from "../pages/PageNotFound";
import Sidebar from "../components/Sidebar";

const EmployerRoute = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));

	const location = useLocation();

	return user && user.user.token && user.user.role === "employer" ? (
		<>
			<div className="container-fluid p-0">
				<div className="row gx-0 h-100">
					<div className="col-12 col-md-3 col-xl-2 bg-light">
						<Sidebar />
					</div>
					<div className="col-12 col-md-9 col-xl-10">
						<div className="container py-5 px-3 px-md-4 px-lg-5 h-100">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	) : location.pathname === "/employer/create-job" ? (
		<ExLogin />
	) : (
		<PageNotFound />
	);
};

export default EmployerRoute;
