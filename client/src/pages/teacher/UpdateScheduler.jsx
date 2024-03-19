import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import btn from "../../components/btn.module.css";

function UpdateScheduler() {
	let testData = [
		{
			index: 0,
			scheduleDate: new Date(),
			scheduleContent: "test1",
		},
		{
			index: 1,
			scheduleDate: new Date(),
			scheduleContent: "test1",
		},
		{
			index: 2,
			scheduleDate: new Date(),
			scheduleContent: "test1",
		},
		{
			index: 3,
			scheduleDate: new Date(),
			scheduleContent: "test1",
		},
		{
			index: 4,
			scheduleDate: new Date(),
			scheduleContent: "test1",
		},
	];

	// const [isEditorValid, setIsEditorValid] = useState(true);

	const [contentFields, setContentFields] = useState([
		{ scheduleDate: new Date(), scheduleContent: "" },
	]);

	const handleScheduleContentChange = (index, e) => {
		let data = [...contentFields];
		data[index][e.target.name] = e.target.value;
		setContentFields(data);
	};
	const handleScheduleDateChange = (index, date) => {
		let data = [...contentFields];
		data[index]["scheduleDate"] = date;
		setContentFields(data);
	};
	const handleQuillChange = (index, html) => {
		let data = [...contentFields];
		data[index]["scheduleContent"] = html;
		setContentFields(data);
	};

	const addContent = (e) => {
		e.preventDefault();
		let newfield = { scheduleDate: new Date(), scheduleContent: "" };
		setContentFields([...contentFields, newfield]);
	};
	const removeContent = (index, e) => {
		e.preventDefault();
		let data = [...contentFields];
		data.splice(index, 1);
		setContentFields(data);
	};

	const handleUpdate = (e) => {
		e.preventDefault();
		console.log(contentFields);
	};

	useEffect(() => {}, []);

	return (
		<div className="row">
			<div className="col-12 col-xl-8">
				<div className="container p-3 p-md-4 container-card">
					<div className="d-flex justify-content-between mb-4">
						<h3 className="fw-bold">แก้ไขกำหนดการ</h3>
					</div>
					<div className="content">
						<form
							id="update-scheduler-form"
							className="form-outline mb-4"
							onSubmit={handleUpdate}
						>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr className="table-light">
											<th scope="col">#</th>
											<th scope="col">วันที่</th>
											<th scope="col">รายละเอียด</th>
											<th scope="col">ACTIONS</th>
										</tr>
									</thead>
									<tbody>
										{contentFields.map((input, index) => {
											return (
												<tr key={index}>
													<th scope="row">{index + 1}</th>
													<td>
														<div className="form-group">
															<DatePicker
																id="scheduleDate"
																className="form-control mb-3"
																name="scheduleDate"
																selected={input.scheduleDate}
																onChange={(date) =>
																	handleScheduleDateChange(index, date)
																}
																dateFormat="dd/MM/yyyy"
															/>
														</div>
													</td>
													<td>
														<div className="form-group mb-4">
															<ReactQuill
																id="schedulerEditorContainer"
																className="editor"
																theme="snow"
																value={input.scheduleContent}
																onChange={(html) =>
																	handleQuillChange(index, html)
																}
															/>
															{/* <input
																type="text"
																id="scheduleContent"
																className="form-control"
																name="scheduleContent"
																value={input.scheduleContent}
																onChange={(e) =>
																	handleScheduleContentChange(index, e)
																}
																maxLength={100}
															/>
															<div className="d-flex justify-content-end">
																<small className="text-muted">
																	{input.scheduleContent.length}/100
																</small>
															</div> */}
														</div>
													</td>
													<td>
														<button
															className={`${btn.btn_grey_outline}`}
															onClick={(e) => removeContent(index, e)}
														>
															<FontAwesomeIcon icon={faTrashCan} />
														</button>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>

							<button
								className={`${btn.btn_blue_outline} w-100`}
								onClick={(e) => addContent(e)}
							>
								+ เพิ่มรายละเอียด
							</button>

							<div className="editorContainer mt-5">
								<label
									className="form-label fw-bold"
									htmlFor="schedulerEditorContainer"
								>
									หมายเหตุ <span className="text-danger">*</span>
								</label>
								<ReactQuill
									id="schedulerEditorContainer"
									className="editor"
									theme="snow"
									value={null}
									onChange={handleQuillChange}
								/>
							</div>
						</form>
					</div>
				</div>
			</div>

			<div className="col-xl-4">
				<div className="container p-3 p-md-4 mt-4 mt-xl-0 container-card bg-light-blue d-none d-xl-block">
					<div className="card-body">
						<div className="d-flex justify-content-between mb-4">
							<h5 className="card-title fw-bold">อัปเดต</h5>
						</div>
						{/* <p className="card-text">
							<b>Status:</b> Draft
						</p>
						<p className="card-text">
							<b>Visibility:</b> Public
						</p> */}

						<div className="buttons">
							<div className="row">
								<div className="col-12 col-xl-6 mb-2">
									<button
										className={`btn btn-sm ${btn.btn_grey_outline} w-100`}
									>
										Save as a draft
									</button>
								</div>
								<div className="col-12 col-xl-6">
									<SchedulerPreviewModal />
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

				<div className="container p-3 p-md-4 mt-4 mt-lg-4 container-card">
					<div className="card-body">
						<div className="d-flex justify-content-between mb-4">
							<h5 className="card-title fw-bold">เพิ่มกำหนดการ</h5>
						</div>

						<div className="mb-4">
							<div className="row">
								<div className="col-12">
									{/* <button
										className={`${btn.btn_blue_outline} w-100`}
										onClick={addScheduler}
									>
										+ เพิ่มกำหนดการ
									</button> */}
								</div>
								<div className="col-12 mt-2">
									<button
										className={`${btn.btn_blue_outline} w-100`}
										onClick={(e) => addContent(e)}
									>
										+ เพิ่มรายละเอียด
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<PublishCard />
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
					{/* <p className="card-text">
                        <b>Status:</b> Draft
                    </p>
                    <p className="card-text">
                        <b>Visibility:</b> Public
                    </p> */}

					<div className="buttons">
						<div className="row">
							<div className="col-12 col-xl-6 mb-2">
								<button className={`btn btn-sm ${btn.btn_grey_outline} w-100`}>
									Save as a draft
								</button>
							</div>
							<div className="col-12 col-xl-6">
								<SchedulerPreviewModal />
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
