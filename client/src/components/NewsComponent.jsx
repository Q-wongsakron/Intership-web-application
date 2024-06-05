import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Modal, Button } from "react-bootstrap";
import btn from "./btn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

export default function NewsComponent({
	id,
	cover_img,
	title,
	content,
	other_img,
	postedTime,
	newsItems,
}) {
	const [showModal, setShowModal] = useState(false);
	const user = useSelector((state) => state.user);
	const maxTitleLength = 100;
	let truncatedTitle = title.slice(0, maxTitleLength);
	if (title.length > maxTitleLength) {
		truncatedTitle += "...";
	}

	const pContent = pd(content);

	const maxContentLength = 100;
	let truncatedContent = pContent.slice(0, maxContentLength);
	if (pContent.length > maxContentLength) {
		truncatedContent += "...";
	}

	const navigate = useNavigate();

	const handleEdit = (e) => {
		e.preventDefault();

		if (user.user.role === "admin") {
			navigate(`/admin/edit-news/${id}`);
		} else if (user.user.role === "teacher") {
			navigate(`/teacher/edit-news/${id}`);
		} else if (user.user.role === "secretary") {
			navigate(`/secretary/edit-news/${id}`);
		} else {
			navigate(`/`);
		}
		// navigate(`/edit/${id}`);
	};

	const handleDelete = async (e) => {
		e.preventDefault();
		setShowModal(true);

		//console.log("Hello Delete")
		// Add your delete logic here
	};
	const handleConfirmDelete = async (e) => {
		setShowModal(false);
		try {
			await axios.delete(import.meta.env.VITE_APP_API + `/deleteNews/${id}`, {
				headers: {
					authtoken: user.user.token,
				},
			});
			window.location.reload();
		} catch (err) {
			console.error(err);
		}
	};
	const DeleteModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ลบข่าวประชาสัมพันธ์</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณแน่ใจหรือไม่ว่าต้องการลบข่าวประชาสัมพันธ์นี้ ?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						ปิด
					</Button>
					<Button
						className={`btn btn-danger`}
						onClick={() => {
							handleConfirmDelete();
							//navigate("/news");
						}}
					>
						<FaTrash /> ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};
	return (
		<>
			<Link to={`/news/article/${id}`}>
				<div className="news-card">
					<div className="row gx-5">
						<div className="col-12 col-md-5 col-lg-4">
							<div className="news-card-img">
								<img
									src={import.meta.env.VITE_FILE_API + `/uploads/${cover_img}`}
									alt="News Cover Image"
									className="img-fluid rounded"
								/>
							</div>
						</div>
						<div className="col-12 col-md-7 col-lg-8">
							<div className="p-2">
								<div className="news-card-title">
									<h5 className="fw-bold">{truncatedTitle}</h5>
								</div>
								<div className="news-card-content">
									{/* <p>{truncatedContent}</p> */}
								</div>
								<div className="news-card-posted d-flex align-items-center">
									<p className="text-muted">
										<FontAwesomeIcon icon={faCalendarDays} /> {postedTime}
									</p>
								</div>
								<div className="news-card-actions">
									<p className="a-text">รายละเอียดเพิ่มเติมมม...</p>
									{["teacher", "admin", "secretary"].includes(
										user.user.role
									) ? (
										<>
											<button
												className="btn btn-sm btn-outline-secondary"
												onClick={handleEdit}
											>
												<FontAwesomeIcon icon={faEdit} className="edit-icon" />
												แก้ไข
											</button>
											<button
												className="btn btn-sm btn-outline-danger"
												style={{ marginLeft: "10px" }}
												onClick={handleDelete}
											>
												<FaTrash />
												ลบ
											</button>
										</>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Link>
			<DeleteModal />
		</>
	);

	function pd(htmlString) {
		const sanitizedHtml = DOMPurify.sanitize(htmlString);
		parse(sanitizedHtml);

		return sanitizedHtml;
	}
}
