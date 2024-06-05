import React from "react";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { Routes, useLocation } from "react-router-dom";

import ExLogin from "../pages/auth/ExLogin";
import PageNotFound from "../pages/PageNotFound";
import Sidebar from "../components/Sidebar";
import CheckVerifyEmail from "../pages/auth/CheckVerifyEmail"; // Import the CheckVerifyEmail component
import { Container, Card, Button } from "react-bootstrap";
import { Envelope } from "react-bootstrap-icons";

const EmployerRoute = ({ children }) => {
	const user = useSelector((state) => state.user);
	const location = useLocation();

	// Function to check if the user is verified
	const isUserVerified = () => {
		return user && user.user.isVerified;
	};

	return (
		<>
			{user && user.user.token && user.user.role === "employer" ? (
				// Check if the user is verified
				isUserVerified() ? (
					<>
						<div className="container-fluid p-0">
							<div className="row gx-0 h-100">
								<div className="col-12 col-md-3 col-xl-2 bg-light">
									<Sidebar />
								</div>
								<div className="col-12 col-md-9 col-xl-10">
									<div className="container py-5 px-3 px-md-4 px-lg-5 h-100">
										{children}
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<Container style={{ marginTop: "20px" }}>
						<Card
							style={{
								width: "500px",
								margin: "auto",
								boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
							}}
						>
							<Card.Body style={{ textAlign: "center" }}>
								<div style={{ marginBottom: "20px" }}>
									<Envelope style={{ fontSize: "48px", color: "#007bff" }} />
								</div>
								<Card.Title>สถานะการยืนยันอีเมล</Card.Title>
								<Card.Text>
									Email: {user.user.email} -----{" "}
									{user.user.isVerified ? (
										<span className="verified" style={{ color: "green" }}>
											ยืนยัน
										</span>
									) : (
										<span className="not-verified" style={{ color: "red" }}>
											ยังไม่ยืนยัน
										</span>
									)}
								</Card.Text>
								{!user.user.isVerified && (
									<div>
										<p>
											ผู้ใช้ยังไม่ยืนยันอีเมล กรุณายืนยันอีเมล
											ด้วยลิงก์ที่ส่งไปยังอีเมล
										</p>
									</div>
								)}
							</Card.Body>
						</Card>
					</Container>
				)
			) : location.pathname === "/employer/create-job" ? (
				<ExLogin />
			) : (
				<PageNotFound />
			)}

			{/* {isUserVerified() ? ( // Check if the user is verified
				user && user.user.token && user.user.role === "employer" ? (
					<>
						<div className="container-fluid p-0">
							<div className="row gx-0 h-100">
								<div className="col-12 col-md-3 col-xl-2 bg-light">
									<Sidebar />
								</div>
								<div className="col-12 col-md-9 col-xl-10">
									<div className="container py-5 px-3 px-md-4 px-lg-5 h-100">
										{children}
									</div>
								</div>
							</div>
						</div>
					</>
				) : location.pathname === "/employer/create-job" ? (
					<ExLogin />
				) : (
					<PageNotFound />
				)
			) : (
				// Render a message or component indicating that the user is not verified
				<Container style={{ marginTop: "20px" }}>
					<Card
						style={{
							width: "500px",
							margin: "auto",
							boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
						}}
					>
						<Card.Body style={{ textAlign: "center" }}>
							<div style={{ marginBottom: "20px" }}>
								<Envelope style={{ fontSize: "48px", color: "#007bff" }} />
							</div>
							<Card.Title>สถานะการยืนยันอีเมล</Card.Title>
							<Card.Text>
								Email: {user.user.email} -----{" "}
								{user.user.isVerified ? (
									<span className="verified" style={{ color: "green" }}>
										ยืนยัน
									</span>
								) : (
									<span className="not-verified" style={{ color: "red" }}>
										ยังไม่ยืนยัน
									</span>
								)}
							</Card.Text>
							{!user.user.isVerified && (
								<div>
									<p>
										ผู้ใช้ยังไม่ยืนยันอีเมล กรุณายืนยันอีเมล
										ด้วยลิงก์ที่ส่งไปยังอีเมล
									</p>
								</div>
							)}
						</Card.Body>
					</Card>
				</Container>
			)} */}
		</>
	);
};

export default EmployerRoute;
