import React from "react";
import {
	Sidebar,
	Menu,
	MenuItem,
	SubMenu,
	menuClasses,
} from "react-pro-sidebar";
// import { SidebarHeader } from "./components/SidebarHeader";

import {
	Link,
	useNavigate,
	useMatch,
	useResolvedPath,
	useLocation,
} from "react-router-dom";

export const SidebarDemo = () => {
	const [collapsed, setCollapsed] = React.useState(false);
	const [toggled, setToggled] = React.useState(false);
	const [broken, setBroken] = React.useState(false);
	const [rtl, setRtl] = React.useState(false);
	const [hasImage, setHasImage] = React.useState(false);

	// const menuItemStyles: MenuItemStyles = {
	// 	root: {
	// 		fontSize: "13px",
	// 		fontWeight: 400,
	// 	},
	// 	icon: {
	// 		color: themes[theme].menu.icon,
	// 		[`&.${menuClasses.disabled}`]: {
	// 			color: themes[theme].menu.disabled.color,
	// 		},
	// 	},
	// 	SubMenuExpandIcon: {
	// 		color: "#b6b7b9",
	// 	},
	// 	subMenuContent: ({ level }) => ({
	// 		backgroundColor:
	// 			level === 0
	// 				? hexToRgba(
	// 						themes[theme].menu.menuContent,
	// 						hasImage && !collapsed ? 0.4 : 1
	// 				  )
	// 				: "transparent",
	// 	}),
	// 	button: {
	// 		[`&.${menuClasses.disabled}`]: {
	// 			color: themes[theme].menu.disabled.color,
	// 		},
	// 		"&:hover": {
	// 			backgroundColor: hexToRgba(
	// 				themes[theme].menu.hover.backgroundColor,
	// 				hasImage ? 0.8 : 1
	// 			),
	// 			color: themes[theme].menu.hover.color,
	// 		},
	// 	},
	// 	label: ({ open }) => ({
	// 		fontWeight: open ? 600 : undefined,
	// 	}),
	// };

	return (
		<div
			style={{
				display: "flex",
				height: "100%",
			}}
		>
			<Sidebar
				collapsed={collapsed}
				toggled={toggled}
				onBackdropClick={() => setToggled(false)}
				onBreakPoint={setBroken}
				// image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
				breakPoint="md"
				// backgroundColor={hexToRgba(
				// 	themes[theme].sidebar.backgroundColor,
				// 	hasImage ? 0.9 : 1
				// )}
				// rootStyles={{
				// 	color: themes[theme].sidebar.color,
				// }}
			>
				<div
					style={{ display: "flex", flexDirection: "column", height: "100%" }}
				>
					{/* <SidebarHeader
						style={{ marginBottom: "24px", marginTop: "16px" }}
					/> */}
					<div style={{ flex: 1, marginBottom: "32px" }}>
						<div style={{ padding: "0 24px", marginBottom: "8px" }}>
							<h4
								className="fw-bold"
								style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
							>
								General
							</h4>
						</div>
						<Menu>
							<SubMenu label="Charts">
								<MenuItem> Pie charts</MenuItem>
								<MenuItem> Line charts</MenuItem>
								<MenuItem> Bar charts</MenuItem>
							</SubMenu>
							<SubMenu label="Maps">
								<MenuItem> Google maps</MenuItem>
								<MenuItem> Open street maps</MenuItem>
							</SubMenu>
							<SubMenu label="Theme">
								<MenuItem> Dark</MenuItem>
								<MenuItem> Light</MenuItem>
							</SubMenu>
							<SubMenu label="Components">
								<MenuItem> Grid</MenuItem>
								<MenuItem> Layout</MenuItem>
								<SubMenu label="Forms">
									<MenuItem> Input</MenuItem>
									<MenuItem> Select</MenuItem>
									<SubMenu label="More">
										<MenuItem> CheckBox</MenuItem>
										<MenuItem> Radio</MenuItem>
									</SubMenu>
								</SubMenu>
							</SubMenu>
							<SubMenu label="E-commerce">
								<MenuItem> Product</MenuItem>
								<MenuItem> Orders</MenuItem>
								<MenuItem> Credit card</MenuItem>
							</SubMenu>
						</Menu>

						<div
							style={{
								padding: "0 24px",
								marginBottom: "8px",
								marginTop: "32px",
							}}
						>
							<h4
								className="fw-bold"
								style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
							>
								Extra
							</h4>
						</div>

						<Menu>
							<MenuItem component={<Link to="/admin" />}>Admin</MenuItem>
							<MenuItem
								component={
									<CustomLink to={"/admin/employer-list"}>
										บริษัท/หน่วยงาน
									</CustomLink>
								}
							>
								บริษัท/หน่วยงาน
							</MenuItem>
							<MenuItem disabled>Examples</MenuItem>
						</Menu>
					</div>
					{/* <SidebarFooter collapsed={collapsed} /> */}
				</div>
			</Sidebar>

			<main>
				<div style={{ padding: "16px 24px", color: "#44596e" }}>
					<div style={{ marginBottom: "16px" }}>
						{broken && (
							<button
								className="sb-button"
								onClick={() => setToggled(!toggled)}
							>
								Toggle
							</button>
						)}
					</div>
				</div>
			</main>
		</div>
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
};
