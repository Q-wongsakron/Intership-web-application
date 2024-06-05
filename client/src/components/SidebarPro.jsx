import React, { useState, useEffect } from "react";
import {
	Link,
	useNavigate,
	useMatch,
	useResolvedPath,
	useLocation,
} from "react-router-dom";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { SidebarDemo } from "./SidebarDemo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faCheck,
	faTimes,
	faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function SidebarPro({ role, pageComponent }) {
	const location = useLocation();
	const allowedPaths = ["/admin", "/student", "/employer", "/teacher"];
	const shouldRenderSidebar = allowedPaths.some((path) =>
		location.pathname.startsWith(path)
	);

	const [toggled, setToggled] = useState(false);
	const [broken, setBroken] = useState(
		window.matchMedia("(max-width: 1160px)").matches
	);

	let sideBarItem = <div>sideBarItem</div>;

	switch (role) {
		case "admin":
			sideBarItem = <AdminSidebar />;
			break;
		case "employer":
			break;
		case "student":
			break;
		case "head":
			break;
		case "teacher":
			break;
		case "secretary":
			break;

		default:
			break;
	}

	return (
		shouldRenderSidebar && (
			<>
				<Sidebar
					onBackdropClick={() => setToggled(false)}
					toggled={toggled}
					customBreakPoint="1160px"
					onBreakPoint={setBroken}
				>
					<Menu>
						<MenuItem
							icon={
								<FontAwesomeIcon
									icon={faPenToSquare}
									onClick={() => {
										setToggled(false);
									}}
								/>
							}
						>
							<h4>HAMBURGER MENU</h4>
						</MenuItem>
						{sideBarItem}
					</Menu>
				</Sidebar>
				<div className="container py-5 px-3 px-md-4 px-lg-5 h-100">
					{broken && !toggled && (
						<button className="sb-button" onClick={() => setToggled(!toggled)}>
							Toggle
						</button>
					)}
					{pageComponent}
				</div>
			</>
		)
	);

	function CustomLink({ to, children, ...props }) {
		const resolvedPath = useResolvedPath(to);
		const isActive = useMatch({ path: resolvedPath.pathname, end: true });

		return (
			<Link
				to={to}
				{...props}
				className={
					isActive
						? "nav-link active"
						: "nav-link link-dark text-decoration-none"
				}
			>
				{children}
			</Link>
		);
	}

	function AdminSidebar() {
		return (
			<>
				<MenuItem component={<Link to="/admin" />}> ผู้ดูแล</MenuItem>
				<MenuItem component={<Link to="/admin/teacher-list" />}>
					{" "}
					บุคลากร
				</MenuItem>
				<MenuItem component={<Link to="/admin/student-list" />}>
					{" "}
					นักศึกษา
				</MenuItem>
				<MenuItem component={<Link to="/admin/employer-list" />}>
					{" "}
					บริษัท/หน่วยงาน
				</MenuItem>
				<MenuItem
					component={
						<CustomLink to={"/admin/employer-list"}>บริษัท/หน่วยงาน</CustomLink>
					}
				>
					{" "}
					บริษัท/หน่วยงาน
				</MenuItem>

				<MenuItem component={<Link to="/admin/create-news" />}>
					{" "}
					ประชาสัมพันธ์
				</MenuItem>
			</>
		);
	}
}
