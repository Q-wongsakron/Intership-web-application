import React, { useEffect, useState } from "react";
import { Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import PageNotFound from "../pages/PageNotFound";

import { currentUser } from "../services/auth.service";

// protected route
const AdminRoute = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));
	const [ok, setOk] = useState(false);

	useEffect(() => {
		// // If have user and token
		// if (user && user.user.token) {
		// 	// If token corrected then role checking and send user back
		// 	currentUser(user.user.token)
		// 		.then((res) => {
		// 			setOk(true);
		// 		})
		// 		.catch((err) => {
		// 			setOk(false);
		// 			console.error(
		// 				"currentUser failed: ",
		// 				err.response ? err.response.data : err.message
		// 			);
		// 		});
		// }
		if (user && user.user.token && user.user.role === "admin") {
			setOk(true);
		} else {
			setOk(false);
		}
	}, [user]);

	return ok ? <>{children}</> : <PageNotFound />;
};

export default AdminRoute;
