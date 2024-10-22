import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import DOMPurify from "dompurify";
import btn from "../../components/btn.module.css";
import NewsPreview from "./NewsPreview";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

function EditNews() {
	const navigate = useNavigate();
	const params = useParams();

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(null);
	const [images, setImages] = useState(null);
	const [postedDate, setPostedDate] = useState(null);

	const [showNewsPreviewModal, setShowNewsPreviewModal] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isEditorValid, setIsEditorValid] = useState(true);

	const [formData, setFormData] = useState({
		topic: "",
		detail: "",
		coverImage: null,
		otherImage: [],
	});

	const [errors, setErrors] = useState({
		topic: "",
		detail: "",
	});

	const handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
		setErrors({
			...errors,
			[name]: "",
		});
	};

	const handleQuillChange = (html) => {
		setFormData({
			...formData,
			detail: html,
		});
	};

	const handleCoverImageFileChange = (e) => {
		const file = e.target.files[0];
		setFormData({
			...formData,
			coverImage: file,
		});
	};

	const handleOtherImageFileChange = (e) => {
		const files = Array.from(e.target.files);
		setFormData({
			...formData,
			otherImage: files,
		});
	};

	const user = useSelector((state) => state.user);

	const handleEdit = async (e) => {
		e.preventDefault();
		const sanitizedHtml = DOMPurify.sanitize(formData.detail);
		if (sanitizedHtml.replace(/<[^>]*>/g, "").length === 0) {
			setIsEditorValid(false);
		} else {
			setIsEditorValid(true);
			setShowModal(true);
		}
	};

	const handleConfirmPublish = async () => {
		setShowModal(false);
		try {
			const dataNews = {
				topic: formData.topic,
				detail: formData.detail,
			};
			const response = await axios.put(
				import.meta.env.VITE_APP_API + `/editNews/${params.articleId}`,
				dataNews,
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			// const formDataImg = new FormData();
			// formDataImg.append("coverImg", formData.coverImage);
			// await axios.put(
			//     import.meta.env.VITE_APP_API + "/uploadCover",
			//     formDataImg,
			//     {
			//         headers: {
			//             "Content-Type": "multipart/form-data",
			//             authtoken: user.user.token,
			//         },
			//     }
			// );
			// const formDataImgs = new FormData();
			// formData.otherImage.forEach((file, index) => {
			//     formDataImgs.append("images", file);
			// });
			// await axios.put(
			//     import.meta.env.VITE_APP_API + "/uploadImages",
			//     formDataImgs,
			//     {
			//         headers: {
			//             "Content-Type": "multipart/form-data",
			//             authtoken: user.user.token,
			//         },
			//     }
			// );
			console.log(response);
		} catch (error) {
			console.error(error);
		}
	};

	const EditModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">แก้ไข</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณแน่ใจหรือไม่ว่าต้องการแก้ไขข่าวประชาสัมพันธ์นี้ ?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={() => {
							handleConfirmPublish();
							navigate("/news");
						}}
					>
						เผยแพร่
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/oneNews/${params.articleId}`
			);
			setData(response.data);
			if (response.data.images) {
				setImages(response.data.images.split(","));
			}

			// Populate form data from API response
			setFormData({
				topic: response.data.topic,
				detail: response.data.detail,
				coverImage: null, // Assuming cover image is not editable
				otherImage: [], // Assuming other images are not editable
			});
		} catch (error) {
			console.error("Error fetching data", error);
			setErrors("Error fetching data. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [params.articleId]);

	return (
		<>
			<div className="fw-bold mb-4">
				<Link to={"/news"}>ข่าวประชาสัมพันธ์ทั้งหมด</Link>
				<span>{data?.topic ? ` > แก้ไขข่าวประชาสัมพันธ์` : ""}</span>
			</div>

			<div className="row">
				<div className="col-12 col-xl-8">
					<div className="container p-3 p-md-4 container-card">
						<div className="d-flex justify-content-between mb-4">
							<h3 className="fw-bold">แก้ไขข่าวประชาสัมพันธ์</h3>
						</div>
						<div className="detail">
							<form
								id="edit-news-form"
								className="form-outline mb-4"
								onSubmit={handleEdit}
							>
								<div className="row">
									<div className="col-sm mx-sm-2">
										<div className="form-group">
											<label className="form-label fw-bold" htmlFor="topic">
												หัวเรื่อง <span className="text-danger">*</span>
											</label>
											<input
												type="text"
												id="topic"
												className="form-control"
												name="topic"
												value={formData.topic}
												onChange={handleInputChange}
												maxLength={255}
												required
											/>
											{errors.topic && (
												<p className="text-danger">{errors.topic}</p>
											)}
											<div className="d-flex justify-content-end">
												<small className="text-muted">
													{formData.topic.length}/255
												</small>
											</div>
										</div>

										<br />

										<div
											id="newsEditorContainer"
											className="form-group newsEditorContainer"
										>
											<label
												className="form-label fw-bold"
												htmlFor="quillNewsEditor"
											>
												เนื้อหา <span className="text-danger">*</span>
											</label>
											<ReactQuill
												id="quillNewsEditor"
												theme="snow"
												value={formData.detail}
												onChange={handleQuillChange}
											/>
											{!isEditorValid && (
												<p className="text-danger fw-bold">กรุณากรอกเนื้อหา</p>
											)}
										</div>
										<br />

										<div className="form-group">
											<div className="d-flex flex-column flex-sm-row mb-4">
												<div className="flex-grow-1 newsCoverImageUploader">
													<label
														form="newsCoverImageUploader"
														className="form-label fw-bold"
													>
														อัปโหลดภาพปกข่าว{" "}
														<span className="text-danger">*</span>
													</label>
													<input
														className="form-control"
														type="file"
														id="newsCoverImageUploader"
														accept=".jpg, .png"
														onChange={handleCoverImageFileChange}
														disabled={true} ////
													/>
												</div>
											</div>
											<div className="d-flex flex-column flex-sm-row">
												<div className="flex-grow-1 newsOtherImageUploader">
													<label
														form="newsOtherImageUploader"
														className="form-label fw-bold"
													>
														อัปโหลดภาพอื่น ๆ ที่เกี่ยวข้อง
														(เลือกได้หลายภาพพร้อมกัน)
													</label>
													<input
														className="form-control"
														type="file"
														id="newsOtherImageUploader"
														accept=".jpg, .png"
														onChange={handleOtherImageFileChange}
														multiple
														disabled={true} ////
													/>
												</div>
											</div>
										</div>
										<div className="d-flex justify-content-end mt-2">
											<small className="text-muted">
												ขออภัย ไม่สามารถแก้ไขรูปได้
											</small>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="col-xl-4">
					<div className="container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-none d-lg-block">
						<div className="card-body">
							<div className="d-flex justify-content-between mb-4">
								<h5 className="card-topic fw-bold">เผยแพร่</h5>
							</div>
							{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

							<div className="buttons">
								<div className="row">
									{/* <div className="col-12 col-xl-6 mb-2">
									<button
										className={`btn btn-sm ${btn.btn_grey_outline} w-100`}
									>
										Save as a draft
									</button>
								</div> */}
									<div className="col-12">
										<button
											type="button"
											className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
											onClick={() => setShowNewsPreviewModal(true)}
										>
											<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
										</button>
									</div>
								</div>

								<hr />

								<div className="d-flex justify-content-center">
									<button
										type="submit"
										form="edit-news-form"
										className={`${btn.btn_blue} w-100`}
									>
										แก้ไข
									</button>
								</div>
							</div>
						</div>
					</div>

					<Modal
						show={showNewsPreviewModal}
						fullscreen={true}
						onHide={() => setShowNewsPreviewModal(false)}
						centered
						size="xl"
					>
						<Modal.Header closeButton>
							<Modal.Title className="fw-bold">ตัวอย่าง</Modal.Title>
						</Modal.Header>
						<Modal.Body className="bg-light">
							<NewsPreview formData={formData} />
						</Modal.Body>
						<Modal.Footer>
							<Button
								variant="secondary"
								onClick={() => {
									setShowNewsPreviewModal(false);
								}}
							>
								ปิด
							</Button>
						</Modal.Footer>
					</Modal>

					<EditCard />
					<EditModal />
				</div>
			</div>
		</>
	);

	function EditCard() {
		return (
			<div
				className={`container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-block d-lg-none`}
			>
				<div className="card-body">
					<div className="d-flex justify-content-between mb-4">
						<h5 className="card-topic fw-bold">เผยแพร่</h5>
					</div>
					<div className="buttons">
						<div className="row">
							<div className="col-12">
								<button
									type="button"
									className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
									onClick={() => setShowNewsPreviewModal(true)}
								>
									<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
								</button>
							</div>
						</div>
						<hr />
						<div className="d-flex justify-content-center">
							<button
								type="submit"
								form="edit-news-form"
								className={`${btn.btn_blue} w-100`}
							>
								แก้ไข
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EditNews;
