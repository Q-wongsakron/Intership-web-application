import React, { useEffect, useState } from "react";
import { Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import PageNotFound from "../pages/PageNotFound";
import Sidebar from "../components/Sidebar";

import { currentUser } from "../services/auth.service";

// protected route
const AdminRoute = ({ children }) => {
	// const { user } = useSelector((state) => ({ ...state }));
	// const [ok, setOk] = useState(false);

	// useEffect(() => {
	// 	// // If have user and token
	// 	// if (user && user.user.token) {
	// 	// 	// If token corrected then role checking and send user back
	// 	// 	currentUser(user.user.token)
	// 	// 		.then((res) => {
	// 	// 			setOk(true);
	// 	// 		})
	// 	// 		.catch((err) => {
	// 	// 			setOk(false);
	// 	// 			console.error(
	// 	// 				"currentUser failed: ",
	// 	// 				err.response ? err.response.data : err.message
	// 	// 			);
	// 	// 		});
	// 	// }
	// 	if (user && user.user.token && user.user.role === "admin") {
	// 		setOk(true);
	// 	} else {
	// 		setOk(false);
	// 	}
	// }, [user]);

	// return ok ? (
	// 	<>
	// 		<div className="row gx-0">
	// 			<div className="col-md-3 col-lg-2 bg-light">
	// 				<Sidebar />
	// 			</div>
	// 			<div className="col-md-9 col-lg-10">
	// 				<div className="container py-5 px-md-5">{children}</div>
	// 			</div>
	// 		</div>
	// 	</>
	// ) : (
	// 	<PageNotFound />
	// );
	const { user } = useSelector((state) => ({ ...state }));

	return user && user.user.token && user.user.role === "admin" ? (
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

export default AdminRoute;
