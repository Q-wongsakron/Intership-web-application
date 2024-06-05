import React, { useState, useEffect } from "react";
import {
	Link,
	useNavigate,
	useMatch,
	useResolvedPath,
	useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Sidebar() {
	const [isSticky, setSticky] = useState(false);

	const handleScroll = () => {
		const offset = window.scrollY;
		if (offset > 0) {
			setSticky(true);
		} else {
			setSticky(false);
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// data from redux store
	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

	const location = useLocation();
	const allowedPaths = [
		"/admin",
		"/student",
		"/employer",
		"/teacher",
		"/head",
		"/doc",
		"/secretary",
	];
	const shouldRenderSidebar = allowedPaths.some((path) =>
		location.pathname.startsWith(path)
	);

	let sidebarHeader = "Sidebar";
	let sidebarItems1 = [];
	let sidebarItems2 = [];
	let sidebarItems3 = [];
	let sidebarComponents;

	// const user = { user: { role: "admin", length: 555 } };

	if (user.user.length !== 0) {
		if (user.user.role === "admin") {
			sidebarHeader = "จัดการระบบ";
			sidebarItems1 = [
				{ label: "ผู้ดูแลระบบ", href: "/admin" },
				{ label: "จัดการสิทธิ์ (บุคลากร)", href: "/admin/change-role" },
				{
					label: "อนุมัติผู้ใช้ (บริษัท/หน่วยงาน)",
					href: "/admin/employer-list",
				},
				{
					label: "รีเซตผู้ใช้ (นักศึกษา)",
					href: "/admin/student-list",
				},
			];
			sidebarItems2 = [
				{ label: "+ ประชาสัมพันธ์", href: "/admin/create-news" },
				{ label: "แก้ไขกำหนดการ", href: "/admin/update-scheduler" },
				{ label: "อนุมัติเอกสาร", href: "/admin/approve-docs" },
				{ label: "เอกสารที่อนุมัติแล้ว", href: "/admin/approved-docs" },
				{ label: "สถานะนักศึกษา", href: "/admin/student-monitor" },
			];
			sidebarItems3 = [
				{ label: "อัปโหลดรายชื่อนักศึกษา", href: "/admin/upload-csv" },
				{
					label: "ตั้งค่าเอกสารเบื้องต้น",
					href: "/admin/setup-docs",
				},
				{ label: "ส่งออกข้อมูลแบบประเมิน", href: "/admin/export-eval" },
			];
		} else if (user.user.role === "student") {
			sidebarItems1 = [
				{ label: "การฝึกงานของฉัน", href: "/student/internship" },
				{ label: "ข้อมูลที่ฝึกงาน", href: "/student/my-employer" },
				{ label: "อัปโหลดเอกสาร", href: "/student/upload" },
				{ label: "ทำแบบประเมิน", href: "/student/evaluation" },
				{ label: "คลังเอกสารของฉัน", href: "/student/documents" },
			];
			sidebarItems2 = [
				{ label: "สถิติข้อมูลบริษัทฝึกงาน", href: "/student/staticEm" },
				{ label: "คลังเอกสารทั้งหมด", href: "/student/viewAllFile" },
			];
			sidebarItems3 = [
				{ label: "ยื่นที่ฝึกงานเอง", href: "/student/self-enroll" },
				{
					label: "แก้ไขข้อมูลยื่นที่ฝึกงานเอง",
					href: "/student/edit-self-enroll",
				},
				{ label: "โปรไฟล์", href: "/student/profile" },
				{ label: "แก้ไขโปรไฟล์", href: "/student/profile/edit" },
			];
		} else if (user.user.role === "employer") {
			sidebarItems1 = [
				{
					label: "นักศึกษาที่สมัครฝึกงาน",
					href: "/employer/application",
				},
				{
					label: "นักศึกษาที่รับฝึกงานแล้ว",
					href: "/employer/my-students",
				},
				{ label: "ประเมินนักศึกษาฝึกงาน", href: "/employer/evaluation" },
				{
					label: "แบบสอบถามการฝึกงาน",
					href: "/employer/questionnaire",
				},
			];
			sidebarItems2 = [
				{ label: "+ ประกาศรับฝึกงาน", href: "/employer/create-job" },
				{ label: "โพสต์ทั้งหมด", href: "/employer/all-job" },
				{ label: "โปรไฟล์", href: "/employer/profile" },
				{ label: "แก้ไขโปรไฟล์", href: "/employer/profile/edit" },
			];
		} else if (user.user.role === "head") {
			sidebarItems1 = [
				{ label: "อนุมัติเอกสาร", href: "/head/approve-docs" },
				{ label: "เอกสารที่อนุมัติแล้ว", href: "/head/approved-docs" },
			];
			sidebarItems2 = [
				{ label: "สถานะนักศึกษา", href: "/head/student-monitor" },
			];
		} else if (user.user.role === "secretary") {
			sidebarItems1 = [
				{ label: "ตั้งค่าเอกสาร", href: "/secretary/approve-docs" },
				{ label: "เอกสารที่อนุมัติแล้ว", href: "/secretary/approved-docs" },
				{
					label: "ตั้งค่าเอกสารเบื้องต้น",
					href: "/secretary/setup-docs",
				},
			];
			sidebarItems2 = [
				{ label: "+ ประชาสัมพันธ์", href: "/secretary/create-news" },
				{ label: "แก้ไขกำหนดการ", href: "/secretary/update-scheduler" },
				{ label: "อัปโหลดรายชื่อนักศึกษา", href: "/secretary/upload-csv" },
			];
			sidebarItems3 = [
				{
					label: "อนุมัติผู้ใช้ (บริษัท/หน่วยงาน)",
					href: "/secretary/employer-list",
				},
			];
		} else if (user.user.role === "teacher") {
			sidebarItems1 = [
				{ label: "สถานะนักศึกษา", href: "/teacher/student-monitor" },
				{ label: "+ ประชาสัมพันธ์", href: "/teacher/create-news" },
			];
			sidebarItems2 = [
				{ label: "แก้ไขกำหนดการ", href: "/teacher/update-scheduler" },
				{ label: "อัปโหลดรายชื่อนักศึกษา", href: "/teacher/upload-csv" },
			];
			sidebarItems3 = [
				{
					label: "อนุมัติผู้ใช้ (บริษัท/หน่วยงาน)",
					href: "/teacher/employer-list",
				},
				{
					label: "ส่งออกข้อมูลแบบประเมิน",
					href: "/teacher/export-eval",
				},
			];
		}
	} else {
	}

	return shouldRenderSidebar ? (
		<aside
			className={`sidebar ${
				isSticky ? "sticky" : ""
			} d-flex flex-column flex-shrink-0 p-3 bg-light`}
		>
			<ul className="nav nav-pills flex-column mb-auto">
				{sidebarItems1.map((item, index) => (
					<li className="nav-item my-1" key={index}>
						<CustomLink to={item.href}>{item.label}</CustomLink>
					</li>
				))}
				<hr />
				{sidebarItems2.map((item, index) => (
					<li className="nav-item my-1" key={index}>
						<CustomLink to={item.href}>{item.label}</CustomLink>
					</li>
				))}
				{sidebarItems3.length !== 0 && (
					<>
						<hr />
						{sidebarItems3.map((item, index) => (
							<li className="nav-item my-1" key={index}>
								<CustomLink to={item.href}>{item.label}</CustomLink>
							</li>
						))}
					</>
				)}
			</ul>
		</aside>
	) : null;
}

function CustomLink({ to, children, ...props }) {
	const resolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: resolvedPath.pathname, end: true });

	return (
		<Link
			to={to}
			{...props}
			className={
				isActive ? "nav-link active" : "nav-link link-dark text-decoration-none"
			}
		>
			{children}
		</Link>
	);
}
