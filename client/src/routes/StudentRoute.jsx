import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Routes } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound";
import Sidebar from "../components/Sidebar";

const StudentRoute = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));

	return user && user.user.token && user.user.role === "student" ? (
		<>
			<div className="container-fluid p-0">
				<div className="row gx-0 h-100">
					<div className="col-12 col-md-3 col-xl-2 bg-light">
						<Sidebar />
					</div>
					<div className="col-12 col-md-9 col-xl-10">
						<div className="container py-5 px-md-5 h-100">{children}</div>
					</div>
				</div>
			</div>
		</>
	) : (
		<PageNotFound />
	);
};

export default StudentRoute;
