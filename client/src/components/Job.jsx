import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import btn from "./btn.module.css";
import axios from "axios";
import employerDefaultImg from "../assets/employer_default_img.png";
import { FaTrash } from "react-icons/fa";

export default function Job({
	id,
	username,
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
	const navigate = useNavigate();

	const parsedPositions =
		typeof positions === "string" ? JSON.parse(positions) : positions;

	const user = useSelector((state) => state.user);
	const [showModal, setShowModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [responseModal, setResponseModal] = useState(false);
	const [responseData, setResponseData] = useState(false);

	const currentDate = Date.now();
	const startPostDate = new Date(startPost);
	const endPostDate = new Date(endPost);
	const formattedStartPostDate = startPostDate.toLocaleDateString("en-GB");
	const formattedEndPostDate = endPostDate.toLocaleDateString("en-GB");
	const isPostNotStart = currentDate < startPostDate;
	const isPostEnd = currentDate > endPostDate;

	const isStudentStatusOne = status && status === "1";

	// const checkUserRole = (role) => {
	//  if (role === "student") {
	//   if (isStudentStatusOne) {
	//    return (
	//     <button
	//      className={`${btn.btn_red_outline} w-100`}
	//      onClick={handleRefuseApply}
	//     >
	//      ยกเลิกการสมัคร
	//     </button>
	//    );
	//   } else {
	//    return (
	//     <button className={`${btn.btn_blue_outline} w-100`}>
	//      สมัครฝึกงาน
	//     </button>
	//    );
	//   }
	//  } else if (role === "employer") {
	//   return (
	//    <button className={`${btn.btn_grey_outline} w-100`} onClick={null}>
	//     แก้ไข
	//    </button>
	//   );
	//  } else {
	//   return null;
	//  }
	// };

	const handleRefuseApply = (event) => {
		event.preventDefault();
		setShowModal(true);
	};

	const handleConfirmRefuse = async () => {
		try {
			await axios.put(
				import.meta.env.VITE_APP_API + `/refuseApplyStd/${apply_id}`,
				{},
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			// Optionally, you can handle state updates or other logic after a successful delete
		} catch (error) {
			console.error(error);
		} finally {
			// Close the modal
			setShowModal(false);
		}
	};

	//// ไม่ใช้ละ ไปลบกับแก้ไขใช้ที่ EmAllJob เลย ////
	const handleConfirmDelete = async () => {
		try {
			const deletePostWork = await axios.put(
				import.meta.env.VITE_APP_API + `/deletePost/${id}`,

				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);

			setDeleteModal(false);
			if (deletePostWork.data.message) {
				setResponseModal(true);
				setResponseData(deletePostWork.data.message);
				// window.location.reload(false); //
			} else {
				setResponseModal(false);
			}
		} catch (error) {
			console.error(error);
			console.log(error);
			setDeleteModal(false);
			setResponseData(error.response.data.message);
			setResponseModal(true);
		}
	};

	const handleEditBtnClick = (e) => {
		e.preventDefault();
		navigate(`/employer/EditPost/${id}`);
	};

	const handleDeleteBtnClick = (e) => {
		e.preventDefault();
		setDeleteModal(true);
	};

	const titleForUrl = title.toLowerCase().replaceAll(" ", "-");

	return (
		<>
			<Link to={`/job/${id}/${titleForUrl}`}>
				<div className="job-card">
					<div className="row">
						<div className="col-12 col-md-3 col-xl-2 d-flex justify-content-md-center justify-content-lg-start">
							<div className="job-card-img-sm mb-3 mb-md-0">
								<img
									src={
										img
											? import.meta.env.VITE_FILE_API + `/uploads/${img}`
											: employerDefaultImg
									}
									alt="Company Logo Image"
									className="img-fluid"
								/>
							</div>
							<div className="job-header-hidden d-block d-md-none px-3">
								<h6 className="job-card-title fw-bold text-break">{title}</h6>
								<small className="text-muted">
									รับสมัคร : {formattedStartPostDate} ถึง{" "}
									<span className={`${isPostEnd ? "text-danger" : ""}`}>
										{formattedEndPostDate}
									</span>
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
										รับสมัคร : {formattedStartPostDate} ถึง{" "}
										<span className={`${isPostEnd ? "text-danger" : ""}`}>
											{formattedEndPostDate}
										</span>
									</small>
								</p>
								{user.user.role === "employer" &&
									user.user.username === username && (
										// <Link
										//  to={`/employer/EditPost/${id}`}
										//  className={`w-100 text-center a-btn ${btn.btn_grey_outline}`}
										// >
										//  แก้ไขโพสต์
										// </Link>
										// <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
										//  <button
										//   className={`w-100 text-center a-btn ${btn.btn_grey_outline}`}
										//   onClick={handleEditBtnClick}
										//  >
										//   แก้ไขโพสต์
										//  </button>
										//  <button
										//   className={`w-50 text-center a-btn ${btn.btn_red_outline}`}
										//   onClick={handleDeleteBtnClick}
										//  >
										//   <FaTrash />
										//  </button>
										//  </div>

										//// ไม่ใช้ละ ไปลบกับแก้ไขใช้ที่ EmAllJob เลย ////
										<div className="d-flex flex-row justify-content-end">
											<button
												className={`w-100 text-center ${btn.btn_grey_outline}`}
												onClick={handleEditBtnClick}
											>
												แก้ไขโพสต์
											</button>
											<button
												className={`ms-1 text-center ${btn.btn_red_outline}`}
												onClick={handleDeleteBtnClick}
											>
												<FaTrash />
											</button>
										</div>
									)}

								{user &&
								(user.user.role === "admin" ||
									user.user.role === "employee" ||
									user.user.role === "head" ||
									user.user.role === "secretary" ||
									user.user.role === "teacher" ||
									user.user.role === "employer") ? null : isStudentStatusOne ? (
									<button
										className={`${btn.btn_red_outline} w-100 text-wrap`}
										onClick={handleRefuseApply}
									>
										ยกเลิกการสมัคร
									</button>
								) : isPostNotStart ? (
									<button
										className={`btn btn-outline-secondary w-100`}
										disabled
									>
										ยังไม่เปิดให้สมัคร
									</button>
								) : isPostEnd ? (
									<>
										<button className={`btn btn-outline-danger w-100`} disabled>
											หมดเวลาสมัครแล้ว
										</button>
									</>
								) : (
									<>
										<button className={`${btn.btn_blue_outline} w-100`}>
											สมัครฝึกงาน
										</button>
									</>
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
					<Link to="/alljob">
						<Button variant="danger" onClick={handleConfirmRefuse}>
							ยืนยัน
						</Button>
					</Link>
				</Modal.Footer>
			</Modal>

			<Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold text-danger">ลบโพสต์</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณแน่ใจที่จะลบโพสต์การรับสมัครฝึกงาน ชื่อโพสต์{" "}
					<span className="fw-semibold">{title}</span> นี้?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setDeleteModal(false)}>
						ปิด
					</Button>
					<Button variant="danger" onClick={handleConfirmDelete}>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal
				show={responseModal}
				onHide={() => setResponseModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>การตอบกลับ</Modal.Title>
				</Modal.Header>
				<Modal.Body>{responseData}</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setResponseModal(false)}>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
