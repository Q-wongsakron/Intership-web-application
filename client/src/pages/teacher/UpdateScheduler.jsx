import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import HtmlParser from "../../components/HtmlParser";
import btn from "../../components/btn.module.css";
import axios from "axios";
import DOMPurify from "dompurify";

function UpdateScheduler() {
	const navigate = useNavigate();

	const user = useSelector((state) => state.user);

	const [showSchedulerPreviewModal, setShowSchedulerPreviewModal] =
		useState(false);

	const [scheduleContent, setScheduleContent] = useState("");
	const [noteContent, setNoteContent] = useState("");
	const [formData, setFormData] = useState({
		scheduleContent: scheduleContent,
		note: noteContent,
	});
	const [isEditorValid, setIsEditorValid] = useState(true);

	const [data, setData] = useState({
		detail: "",
	});

	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const handleScheduleChange = (content) => {
		setScheduleContent(content);
	};

	const handleNoteChange = (content) => {
		setNoteContent(content);
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const sanitizedHtml = DOMPurify.sanitize(scheduleContent);
		if (sanitizedHtml.replace(/<[^>]*>/g, "").length === 0) {
			setIsEditorValid(false);
		} else {
			setFormData({
				...formData,
				scheduleContent: scheduleContent,
				note: noteContent,
			});

			setIsEditorValid(true);
			setShowUpdateModal(true);
		}
	};

	const handleConfirmUpdate = async () => {
		setShowUpdateModal(false);
		try {
			const update = await axios.put(
				import.meta.env.VITE_APP_API + `/editSchedule/`,
				formData,
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
		} catch (error) {
			console.error(error);
		}

		fetchData();
	};

	const handleCreate = async (e) => {
		e.preventDefault();

		const sanitizedHtml = DOMPurify.sanitize(scheduleContent);
		if (sanitizedHtml.replace(/<[^>]*>/g, "").length === 0) {
			setIsEditorValid(false);
		} else {
			setFormData({
				...formData,
				scheduleContent: scheduleContent,
				note: noteContent,
			});

			setIsEditorValid(true);
			setShowCreateModal(true);
		}
	};

	const handleConfirmCreate = async () => {
		setShowCreateModal(false);
		try {
			const create = await axios.put(
				import.meta.env.VITE_APP_API + `/createSchedule/`,
				formData,
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
		} catch (error) {
			console.error(error);
		}

		fetchData();
	};

	const fetchData = async () => {
		try {
			const scheduleData = await axios.get(
				import.meta.env.VITE_APP_API + "/listSchedule"
			);
			setData(scheduleData.data);

			if (scheduleData.data.length !== 0) {
				// setFormData({
				// 	scheduleContent: scheduleData.data[0].detail,
				// 	note: scheduleData.data[0].note,
				// });
				setScheduleContent(scheduleData.data[0].detail);
				setNoteContent(scheduleData.data[0].note);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const editorOptions = {
		height: 200,
		buttonList: [
			["undo", "redo"],
			["removeFormat"],
			["bold", "underline", "italic", "fontSize"],
			["font"],
			["fontColor", "hiliteColor"],
			["align", "horizontalRule", "list"],
			["table", "link", "image", "imageGallery"],
			["showBlocks", "codeView"],
		],
		imageRotation: false,
		fontSize: [12, 14, 16, 18, 20],
		colorList: [
			[
				"#828282",
				"#FF5400",
				"#676464",
				"#F1F2F4",
				"#FF9B00",
				"#F00",
				"#fa6e30",
				"#000",
				"rgba(255, 153, 0, 0.1)",
				"#FF6600",
				"#0099FF",
				"#74CC6D",
				"#FF9900",
				"#CCCCCC",
			],
		],
		imageUploadUrl: "http://localhost:8080/chazki-gateway/orders/upload",
		imageGalleryUrl: "http://localhost:8080/chazki-gateway/orders/gallery",
	};

	const UpdateModal = () => {
		return (
			<Modal
				show={showUpdateModal}
				onHide={() => setShowUpdateModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">อัปเดตกำหนดการ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณแน่ใจหรือไม่ว่าต้องการอัปเดตกำหนดการนี้ ? (สามารถแก้ไขได้ตลอดเวลา)
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={() => {
							handleConfirmUpdate();
							navigate("/schedule");
						}}
					>
						อัปเดต
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const CreateModal = () => {
		return (
			<Modal
				show={showCreateModal}
				onHide={() => setShowCreateModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">อัปเดตกำหนดการ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณแน่ใจหรือไม่ว่าต้องการอัปเดตกำหนดการนี้ ? (สามารถแก้ไขได้ตลอดเวลา)
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowCreateModal(false)}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={() => {
							handleConfirmCreate();
							navigate("/schedule");
						}}
					>
						อัปเดต
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	return (
		<div className="row">
			<div className="col-12 col-xl-8">
				<div className="container p-3 p-md-4 container-card">
					<div className="d-flex justify-content-between mb-4">
						<h3 className="fw-bold">แก้ไขกำหนดการ</h3>
					</div>
					<div className="content">
						{data.length !== 0 ? (
							<form
								id="update-scheduler-form"
								className="form-outline mb-4"
								onSubmit={handleUpdate}
							>
								<div className="editorContainer mt-5">
									<label
										className="form-label fw-bold"
										htmlFor="scheduleEditorContainer"
									>
										รายละเอียดกำหนดการ <span className="text-danger">*</span>
									</label>
									<SunEditor
										id="scheduleEditorContainer"
										name="scheduleEditorContainer"
										onChange={handleScheduleChange}
										// setContents={formData.scheduleContent}
										setContents={scheduleContent}
										setOptions={editorOptions}
									/>
									{!isEditorValid && (
										<p className="text-danger fw-bold">
											กรุณากรอกรายละเอียดกำหนดการ
										</p>
									)}
								</div>

								{/* <div className="editorContainer mt-5">
									<label
										className="form-label fw-bold"
										htmlFor="noteEditorContainer"
									>
										หมายเหตุ
									</label>
									<SunEditor
										id="noteEditorContainer"
										name="noteEditorContainer"
										onChange={handleNoteChange}
										// setContents={formData.note}
										setContents={noteContent}
										setOptions={{
											height: 200,
										}}
									/>
								</div> */}
							</form>
						) : (
							<form
								id="update-scheduler-form"
								className="form-outline mb-4"
								onSubmit={handleCreate}
							>
								<div className="editorContainer mt-5">
									<label
										className="form-label fw-bold"
										htmlFor="scheduleEditorContainer"
									>
										รายละเอียดกำหนดการ <span className="text-danger">*</span>
									</label>
									<SunEditor
										id="scheduleEditorContainer"
										name="scheduleEditorContainer"
										onChange={handleScheduleChange}
										// setContents={formData.scheduleContent}
										setContents={scheduleContent}
										setOptions={{
											height: 200,
										}}
									/>
									{!isEditorValid && (
										<p className="text-danger fw-bold">
											กรุณากรอกรายละเอียดกำหนดการ
										</p>
									)}
								</div>

								{/* <div className="editorContainer mt-5">
									<label
										className="form-label fw-bold"
										htmlFor="noteEditorContainer"
									>
										หมายเหตุ
									</label>
									<SunEditor
										id="noteEditorContainer"
										name="noteEditorContainer"
										onChange={handleNoteChange}
										// setContents={formData.note}
										setContents={noteContent}
										setOptions={{
											height: 200,
										}}
									/>
								</div> */}
							</form>
						)}
					</div>
				</div>
			</div>

			<div className="col-xl-4">
				<div className="container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-none d-xl-block">
					<div className="card-body">
						<div className="d-flex justify-content-between mb-4">
							<h5 className="card-title fw-bold">อัปเดต</h5>
						</div>

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
										onClick={() => setShowSchedulerPreviewModal(true)}
									>
										<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
									</button>
								</div>
							</div>

							<hr />

							<div className="d-flex justify-content-center">
								<button
									type="submit"
									form="update-scheduler-form"
									className={`${btn.btn_blue} w-100`}
								>
									อัปเดต
								</button>
							</div>
						</div>
					</div>
				</div>

				<Modal
					show={showSchedulerPreviewModal}
					fullscreen={true}
					onHide={() => setShowSchedulerPreviewModal(false)}
					centered
					size="xl"
				>
					<Modal.Header closeButton>
						<Modal.Title className="fw-bold">ตัวอย่าง</Modal.Title>
					</Modal.Header>
					<Modal.Body className="bg-light">
						<div id="quill-postDesc" className="mt-2 mt-sm-0">
							{scheduleContent ? (
								<>
									{/* <HtmlParser htmlString={formData.scheduleContent} /> */}
									<SunEditor
										onChange={null}
										setContents={scheduleContent}
										disable={true}
										disableToolbar={true}
										hideToolbar={true}
									/>
								</>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => {
								setShowSchedulerPreviewModal(false);
							}}
						>
							ปิด
						</Button>
					</Modal.Footer>
				</Modal>

				<PublishCard />
				<UpdateModal />
				<CreateModal />
			</div>
		</div>
	);

	function PublishCard() {
		return (
			<div
				className={`container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-block d-xl-none`}
			>
				<div className="card-body">
					<div className="d-flex justify-content-between mb-4">
						<h5 className="card-title fw-bold">อัปเดต</h5>
					</div>

					<div className="buttons">
						<div className="row">
							{/* <div className="col-12 col-xl-6 mb-2">
								<button className={`btn btn-sm ${btn.btn_grey_outline} w-100`}>
									Save as a draft
								</button>
							</div> */}
							<div className="col-12">
								<button
									type="button"
									className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
									onClick={() => setShowSchedulerPreviewModal(true)}
								>
									<FontAwesomeIcon icon={faEye} /> ดูตัวอย่าง
								</button>
							</div>
						</div>

						<hr />

						<div className="d-flex justify-content-center">
							<button
								type="submit"
								form="update-scheduler-form"
								className={`${btn.btn_blue} w-100`}
							>
								อัปเดต
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	function SchedulerPreviewModal() {
		return (
			<>
				<button
					type="button"
					className={`btn btn-sm ${btn.btn_blue_outline} w-100`}
					data-bs-toggle="modal"
					data-bs-target="#newsPreviewModal"
				>
					Preview
				</button>

				<div
					className="modal fade"
					id="newsPreviewModal"
					tabIndex={-1}
					aria-labelledby="newsPreviewModalLabel"
					aria-hidden="true"
				>
					<div className="modal-dialog modal-xl modal-fullscreen-lg-down">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="newsPreviewModalLabel">
									Preview
								</h1>
								<button
									type="button"
									className="btn-close"
									data-bs-dismiss="modal"
									aria-label="Close"
								></button>
							</div>
							<div className="modal-body bg-light">
								<div id="quill-postDesc" className="mt-2 mt-sm-0">
									{formData.scheduleContent ? (
										<>
											<HtmlParser htmlString={formData.scheduleContent} />
										</>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
									{/* {jobPostDesc} */}
								</div>
								{/* <NewsPreview formData={formData} /> */}
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className={`btn btn-sm ${btn.btn_grey}`}
									data-bs-dismiss="modal"
								>
									ปิดหน้าต่าง
								</button>
								{/* <button
                                    type="button"
                                    className={`btn btn-sm ${btn.btn_blue}`}
                                    onClick={handlePublish}
                                >
                                    Publish Now
                                </button> */}
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default UpdateScheduler;
