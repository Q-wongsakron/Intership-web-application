import React, { useEffect, useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import NavDropdown from "./NavDropdown";
import Logo from "../assets/ECE-department-logo.svg";
import btn from "./btn.module.css";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/userSlice";

export default function Header(props) {
  // data from redux store
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle logout
  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  let navItems = [];
  let navDropdownItems = [];
  let navComponents;
  const logoutItem = (
    <li>
      <Link
        className={`dropdown-item ${btn.dropdown_menu_item_blue}`}
        onClick={handleLogout}
      >
        ออกจากระบบ
      </Link>
    </li>
  );

  if (user.user.length !== 0) {
    if (user.user.role === "admin") {
      navItems = [{ id: 1, label: "จัดการสิทธิ์", href: "#" }];
      navDropdownItems = [{ id: 1, label: "จัดการระบบ", href: "/admin" }];
      navComponents = (
        <NavDropdown
          buttonClassName={btn.btn_blue_outline}
          ddMenu={btn.dropdown_menu_blue}
          ddItem={btn.dropdown_menu_item_blue}
          title={user.user.username}
          items={navDropdownItems}
          logoutItem={logoutItem}
        />
      );
    } else if (user.user.role === "student") {
      navItems = [
        { id: 1, label: "ยื่นที่ฝึกงานเอง", href: "/student/self-enroll" },
      ];
      navDropdownItems = [
        { id: 1, label: "โปรไฟล์", href: "/student/profile" },
        { id: 2, label: "การฝึกงานของฉัน", href: "/student" },
      ];
      navComponents = (
        <NavDropdown
          buttonClassName={btn.btn_blue_outline}
          ddMenu={btn.dropdown_menu_blue}
          ddItem={btn.dropdown_menu_item_blue}
          title={user.user.username}
          items={navDropdownItems}
          logoutItem={logoutItem}
        />
      );
    } else if (user.user.role === "employer") {
      navItems = [
        { id: 1, label: "+ ประกาศรับฝึกงาน", href: "/employer/create-job" },
      ];
      navDropdownItems = [
        { id: 1, label: "โปรไฟล์", href: "/employer/profile" },
        { id: 2, label: "การรับฝึกงาน", href: "#" },
      ];
      navComponents = (
        <NavDropdown
          buttonClassName={btn.btn_blue_outline}
          ddMenu={btn.dropdown_menu_blue}
          ddItem={btn.dropdown_menu_item_blue}
          title={user.user.username}
          items={navDropdownItems}
          logoutItem={logoutItem}
        />
      );
    }
  } else {
    navDropdownItems = [
      { id: 1, label: "เข้าสู่ระบบ", href: "/external/login" },
      { id: 2, label: "สมัครสมาชิก", href: "/external/register" },
    ];
    navComponents = (
      <>
        <NavDropdown
          buttonClassName={btn.btn_grey}
          ddMenu={btn.dropdown_menu_grey}
          ddItem={btn.dropdown_menu_item_grey}
          title={"บริษัท/หน่วยงาน"}
          items={navDropdownItems}
        />
        <NavDropdown
          buttonClassName={btn.btn_blue}
          ddMenu={btn.dropdown_menu_blue}
          ddItem={btn.dropdown_menu_item_blue}
          title={"นักศึกษา/บุคลากร"}
          items={[{ id: 1, label: "เข้าสู่ระบบ", href: "/internal/login" }]}
        />
      </>
    );
  }

  // switch (role) {
  // 	case "admin":
  // 		navItems = [{ id: 1, label: "จัดการสิทธิ์", href: "#" }];
  // 		navDropdownItems = [{ id: 1, label: "จัดการระบบ", href: "#" }];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.username}
  // 				items={navDropdownItems}
  // 				logoutItem={logoutItem}
  // 			/>
  // 		);
  // 		break;
  // 	case "user":
  // 		navItems = [{ id: 1, label: "ยื่นที่ฝึกงานเอง", href: "/selfenroll" }];
  // 		navDropdownItems = [
  // 			{ id: 1, label: "โปรไฟล์", href: "#" },
  // 			{ id: 2, label: "การฝึกงานของฉัน", href: "#" },
  // 		];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.name}
  // 				items={navDropdownItems}
  // 				logoutItem={logoutItem}
  // 			/>
  // 		);
  // 		break;
  // 	case 1:
  // 		navItems = [{ id: 1, label: "จัดการสิทธิ์", href: "#" }];
  // 		navDropdownItems = [
  // 			{ id: 1, label: "จัดการระบบ", href: "#" },
  // 			{ id: 2, label: "ออกจากระบบ", href: "#" },
  // 		];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.username}
  // 				items={navDropdownItems}
  // 			/>
  // 		);
  // 		break;
  // 	case 2:
  // 		navItems = [{ id: 1, label: "อนุมัติเอกสาร", href: "#" }];
  // 		navDropdownItems = [{ id: 1, label: "ออกจากระบบ", href: "#" }];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.username}
  // 				items={navDropdownItems}
  // 			/>
  // 		);
  // 		break;
  // 	case 3:
  // 		navItems = [{ id: 1, label: "+ ประกาศข่าวสาร", href: "#" }];
  // 		navDropdownItems = [
  // 			{ id: 1, label: "จัดการการฝึกงาน", href: "#" },
  // 			{ id: 2, label: "ออกจากระบบ", href: "#" },
  // 		];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.username}
  // 				items={navDropdownItems}
  // 			/>
  // 		);
  // 		break;
  // 	case 4:
  // 		navItems = [{ id: 1, label: "ยื่นที่ฝึกงานเอง", href: "/selfenroll" }];
  // 		navDropdownItems = [
  // 			{ id: 1, label: "โปรไฟล์", href: "#" },
  // 			{ id: 2, label: "การฝึกงานของฉัน", href: "#" },
  // 			{ id: 3, label: "ออกจากระบบ", href: "#" },
  // 		];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.name}
  // 				items={navDropdownItems}
  // 			/>
  // 		);
  // 		break;
  // 	case 5:
  // 		navItems = [{ id: 1, label: "+ ประกาศรับฝึกงาน" }];
  // 		navDropdownItems = [
  // 			{ id: 1, label: "โปรไฟล์", href: "#" },
  // 			{ id: 2, label: "การรับฝึกงาน", href: "#" },
  // 			{ id: 3, label: "ออกจากระบบ", href: "#" },
  // 		];
  // 		navComponents = (
  // 			<NavDropdown
  // 				buttonClassName={btn.btn_blue_outline}
  // 				title={userData.username}
  // 				items={navDropdownItems}
  // 			/>
  // 		);
  // 		break;
  // 	default:
  // 		navDropdownItems = [
  // 			{ id: 1, label: "เข้าสู่ระบบ", href: "/external/login" },
  // 			{ id: 2, label: "สมัครสมาชิก", href: "/external/register" },
  // 		];
  // 		navComponents = (
  // 			<>
  // 				<NavDropdown
  // 					buttonClassName={btn.btn_grey}
  // 					title={"บริษัท/หน่วยงาน"}
  // 					items={navDropdownItems}
  // 				/>
  // 				<NavDropdown
  // 					buttonClassName={btn.btn_blue}
  // 					title={"นักศึกษา/บุคลากร"}
  // 					items={[{ id: 1, label: "เข้าสู่ระบบ", href: "/internal/login" }]}
  // 				/>
  // 			</>
  // 		);
  // 		break;
  // }

  return (
    <>
      <header id="header" className="">
        <nav className="navbar navbar-expand-lg px-3">
          <div className="container-fluid px-4">
            <Link className="navbar-brand" to="/">
              <img
                className="brand img-fluid"
                src={Logo}
                alt="ECE Department Logo"
                width="500"
                height="500"
              />
            </Link>
            <button
              className="custom-toggler navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNavDropdown"
            >
              <ul className="navbar-nav justify-content-around">
                <CustomLink to="/">หน้าหลัก</CustomLink>
                <CustomLink to="/schedule">กำหนดการ</CustomLink>
                <CustomLink to="/news">ข่าวสาร</CustomLink>

                {navItems.map((item) => (
                  <li className="nav-item" key={item.id}>
                    <Link
                      to={item.href}
                      className={`a-btn ${btn.a_btn_grey_outline} nav-link`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {navComponents}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );

  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
      <li className="nav-item">
        <Link
          to={to}
          {...props}
          className={isActive ? "nav-link active" : "nav-link"}
        >
          {children}
        </Link>
      </li>
    );
  }
}
