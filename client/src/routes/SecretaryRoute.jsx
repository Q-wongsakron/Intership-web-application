import React, { useEffect, useState } from "react";
import { Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import PageNotFound from "../pages/PageNotFound";
import Sidebar from "../components/Sidebar";
import SidebarPro from "../components/SidebarPro";

import { currentUser } from "../services/auth.service";

// protected route
const Secretary = ({ children }) => {
	const user = useSelector((state) => state.user);

	return user && user.user.token && user.user.role === "secretary" ? (
		<>
			<div className="container-fluid p-0">
				<div className="row gx-0 h-100">
					<div className="col-12 col-md-3 col-xl-2 bg-light">
						<Sidebar />
					</div>
					{/* <SidebarPro role={user.user.role} pageComponent={children} /> */}
					<div className="col-12 col-md-9 col-xl-10">
						<div className="container py-5 px-3 px-md-4 px-lg-5 h-100">
							{children}
						</div>
					</div>
				</div>
			</div>
		</>
	) : (
		<PageNotFound />
	);
};

export default Secretary;
