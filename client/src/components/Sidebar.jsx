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
	const { user } = useSelector((state) => ({ ...state }));

	const location = useLocation();
	const allowedPaths = ["/admin", "/student", "/employer", "/teacher"];
	const shouldRenderSidebar = allowedPaths.some((path) =>
		location.pathname.startsWith(path)
	);

	let sidebarHeader = "Sidebar";
	let sidebarItems1 = [];
	let sidebarItems2 = [];
	let sidebarComponents;

	// const user = { user: { role: "admin", length: 555 } };

	if (user.user.length !== 0) {
		if (user.user.role === "admin") {
			sidebarHeader = "จัดการระบบ";
			sidebarItems1 = [
				{ id: 1, label: "ผู้ดูแล", href: "/admin" },
				{ id: 2, label: "บุคลากร", href: "/admin/teacher-list" },
				{ id: 3, label: "นักศึกษา", href: "/admin/student-list" },
				{ id: 4, label: "บริษัท/หน่วยงาน", href: "/admin/employer-list" },
			];
			sidebarItems2 = [
				{ id: 1, label: "จัดการสิทธิ์?", href: "/admin" },
				{ id: 2, label: "upload-csv", href: "/admin/upload-csv" },
				{ id: 3, label: "change-role", href: "/admin/change-role" },
				{ id: 4, label: "ประชาสัมพันธ์", href: "/admin/create-news" },
				{ id: 5, label: "ตั้งค่าหนังสือขอความอนุเคราะห์", href: "/admin/setup-docs" },
				{ id: 6, label: "อนุมัติเอกสาร", href: "/admin/approve-docs" },
				{ id: 7, label: "สถานะนักศึกษา", href: "/admin/student-mornitor" },
				{ id: 8, label: "แก้ไขกำหนดการ", href: "/admin/update-scheduler" },
			];
		} else if (user.user.role === "student") {
			sidebarItems1 = [
				{ id: 1, label: "การฝึกงานของฉัน", href: "/student/internship" },
				{ id: 2, label: "ข้อมูลที่ฝึกงาน", href: "/student/my-employer" },
				{ id: 3, label: "อัปโหลดเอกสาร", href: "/student/upload" },
				{ id: 4, label: "ทำแบบประเมิน", href: "/student/evaluation" },
				{ id: 5, label: "ไฟล์เอกสารทั้งหมด", href: "/student/documents" },
			];
			sidebarItems2 = [
				{ id: 1, label: "ยื่นที่ฝึกงานเอง", href: "/student/self-enroll" },
				{ id: 2, label: "โปรไฟล์", href: "/student/profile" },
				{ id: 3, label: "เเก้ไขโปรไฟล์", href: "/student/profile/edit" },
			];
		} else if (user.user.role === "employer") {
			sidebarItems1 = [
				{
					id: 1,
					label: "นักศึกษาที่สมัครฝึกงาน",
					href: "/employer/application",
				},
				{
					id: 2,
					label: "นักศึกษาที่รับฝึกงานแล้ว",
					href: "/employer/my-students",
				},
				{ id: 3, label: "อัปโหลดเอกสาร", href: "/employer/upload" },
				{ id: 4, label: "ทำแบบประเมินนักศึกษา", href: "/employer/evaluation" },
			];
			sidebarItems2 = [
				{ id: 1, label: "+ ประกาศรับฝึกงาน", href: "/employer/create-job" },
				{ id: 2, label: "โพสต์ทั้งหมด", href: "/employer/all-job" },
				{ id: 3, label: "โปรไฟล์", href: "/employer/profile" },
				{ id: 4, label: "เเก้ไขโปรไฟล์", href: "/employer/profile/edit" },
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
				{sidebarItems1.map((item) => (
					<li className="nav-item my-1" key={item.id}>
						<CustomLink to={item.href}>{item.label}</CustomLink>
					</li>
				))}
				<hr />
				{sidebarItems2.map((item) => (
					<li className="nav-item my-1" key={item.id}>
						<CustomLink to={item.href}>{item.label}</CustomLink>
					</li>
				))}
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
