import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import btn from "./btn.module.css";
import axios from "axios";
import employerDefaultImg from "../assets/employer_default_img.png";

export default function Job({
	id,
	img,
	title,
	company,
	location,
	allowance,
	positions,
	startPost,
	endPost,
	status,
	apply_id,
}) {
	const parsedPositions =
		typeof positions === "string" ? JSON.parse(positions) : positions;


	
	const { user } = useSelector((state) => ({ ...state }));
	const [showModal, setShowModal] = useState(false);

	const currentDate = Date.now();
	const startPostDate = new Date(startPost);
	const isPostNotStart = currentDate < startPostDate;

	const isStudentStatusOne = status && status === "1";

	// const checkUserRole = (role) => {
	// 	if (role === "student") {
	// 		if (isStudentStatusOne) {
	// 			return (
	// 				<button
	// 					className={`${btn.btn_red_outline} w-100`}
	// 					onClick={handleRefuseApply}
	// 				>
	// 					ยกเลิกการสมัคร
	// 				</button>
	// 			);
	// 		} else {
	// 			return (
	// 				<button className={`${btn.btn_blue_outline} w-100`}>
	// 					สมัครฝึกงาน
	// 				</button>
	// 			);
	// 		}
	// 	} else if (role === "employer") {
	// 		return (
	// 			<button className={`${btn.btn_grey_outline} w-100`} onClick={null}>
	// 				แก้ไข
	// 			</button>
	// 		);
	// 	} else {
	// 		return null;
	// 	}
	// };

	const handleRefuseApply = (event) => {
		event.preventDefault();
		setShowModal(true);
	};

	const handleConfirmRefuse = async () => {
		try {
			await axios.delete(`http://localhost:5500/api/refuseApply/${apply_id}`, {
				headers: {
					authtoken: user.user.token,
				},
			});
			// Optionally, you can handle state updates or other logic after a successful delete
		} catch (error) {
			console.error(error);
		} finally {
			// Close the modal
			setShowModal(false);
		}
	};

	return (
		<>
			<Link to={`/job/${id}`}>
				<div className="job-card">
					<div className="row">
						<div className="col-12 col-md-3 col-xl-2 d-flex justify-content-md-center justify-content-lg-start">
							<div className="job-card-img mb-3 mb-md-0">
								<img
									src={img ? img : employerDefaultImg}
									alt="Company Logo Image"
									className="img-fluid"
								/>
							</div>
							<div className="job-header-hidden d-block d-md-none px-3">
								<h6 className="job-card-title fw-bold text-break">{title}</h6>
								<small className="text-muted">
									รับสมัคร : {startPost} ถึง {endPost}
								</small>
							</div>
						</div>
						<div className="col-12 col-md-6 col-xl-7">
							<div className="job-card-details">
								<h6 className="job-card-title d-none d-md-block fw-bold text-break">
									{title}
								</h6>

								<p className="card-text mb-1">
									บริษัท/หน่วยงาน :{" "}
									<span className="text-secondary">{company}</span>
								</p>
								<p className="card-text mb-1">
									สถานที่ฝึกงาน :{" "}
									<span className="text-secondary">{location}</span>
								</p>
								{parsedPositions && (
									<p className="card-text mb-1">
										ตำแหน่ง :{" "}
										<span className="text-secondary">
											{Array.isArray(parsedPositions)
												? parsedPositions.join(", ")
												: parsedPositions}
										</span>
									</p>
								)}
							</div>
						</div>
						<div className="col-12 col-md-3 col-xl-3">
							<div className="job-actions">
								<p className="card-text">
									<small className="text-muted d-none d-md-block">
										รับสมัคร : {startPost} ถึง {endPost}
									</small>
								</p>
								{user &&
								(user.user.role === "admin" ||
									user.user.role === "head" ||
									user.user.role === "teacher" ||
									user.user.role === "employer") ? null : isStudentStatusOne ? (
									<button
										className={`${btn.btn_red_outline} w-100`}
										onClick={handleRefuseApply}
									>
										ยกเลิกการสมัคร
									</button>
								) : isPostNotStart ?(
									<button className={`${btn.btn_red_outline} w-100`}>
										ยังไม่เปิดให้สมัคร
									</button>
								): (
									<button className={`${btn.btn_blue_outline} w-100`}>
										สมัครฝึกงาน
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</Link>

			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>ยกเลิกการสมัครฝึกงาน</Modal.Title>
				</Modal.Header>
				<Modal.Body>คุณแน่ใจที่จะยกเลิกการสมัครฝึกงานนี้?</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						ปิด
					</Button>
					<Link to="/">
						<Button variant="danger" onClick={handleConfirmRefuse}>
							ยืนยัน
						</Button>
					</Link>
				</Modal.Footer>
			</Modal>
		</>
	);
}
