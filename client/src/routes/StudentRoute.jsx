import React from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Routes } from "react-router-dom";

import PageNotFound from "../pages/PageNotFound";
import Student from "../pages/Student";
import StudentIntern from "../pages/StudentIntern";

const StudentRoute = ({ children }) => {
	const { user } = useSelector((state) => ({ ...state }));

	return user && user.user.token && user.user.role === "student" ? (
		<>{children}</>
	) : (
		<PageNotFound />
	);
};

export default StudentRoute;
