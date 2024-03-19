import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faCheck,
	faTimes,
	faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import customStyles from "../../components/dataTableCustomStyles";
import "../../components/PDFViewer.css";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function EmSeeApply() {
	const [data, setData] = useState([]);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showRefuseModal, setShowRefuseModal] = useState(false);
	const [selectedApplyId, setSelectedApplyId] = useState(null);
	const [selectedStudentName, setSelectedStudentName] = useState(null);
	const [viewPdf, setViewPdf] = useState(null);
	const [showResumeModal, setShowResumeModal] = useState(false);
	const [requireDocStates, setRequireDocStates] = useState({});
	const [selectPosition, setSelectPosition] = useState(null);
	const { user } = useSelector((state) => ({ ...state }));

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5500/api/allApply", {
				headers: {
					authtoken: user.user.token,
				},
			});

			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const [showProfileModal, setShowProfileModal] = useState(false);
	const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

	const handleViewProfile = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setSelectedStudentDetails(response.data);
			setShowProfileModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleViewResume = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setViewPdf(`http://localhost:5500/uploads/${response.data.resume}`);
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleConfirmApply = (apply_id, displayname_th, position) => {
		setSelectedApplyId(apply_id);
		setSelectedStudentName(displayname_th);
		setSelectPosition(position);
		setShowConfirmModal(true);
	};

	const handleRefuseApply = (apply_id, displayname_th) => {
		setSelectedApplyId(apply_id);
		setSelectedStudentName(displayname_th);
		setShowRefuseModal(true);
	};

	const renderToolbar = (Toolbar) => (
		<>
			<Toolbar />
			<div
				style={{
					borderTop: "1px solid rgba(0, 0, 0, 0.1)",
					marginTop: "4px",
					padding: "4px",
				}}
			></div>
		</>
	);

	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		renderToolbar,
	});
	const confirmApply = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5500/api/createConfirm",
				{
					apply_id: selectedApplyId,
					require_doc: requireDocStates.require_doc,
				},
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			console.log(response.data);
			// You might want to handle the success or update the UI accordingly
			// For example, close the modal and refresh the data
			setShowConfirmModal(false);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const refuseApply = async () => {
		try {
			const response = await axios.delete(
				`http://localhost:5500/api/refuseApply/${selectedApplyId}`,
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			console.log(response.data);
			// You might want to handle the success or update the UI accordingly
			// For example, close the modal and refresh the data
			setShowRefuseModal(false);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	// for react-data-table-component
	const applyData = data.map(({ apply_id, ...otherField }) => ({
		...otherField,
		id: apply_id,
	}));
	const applyColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.apply_id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				// name: <p className="m-auto">ชื่อบริษัท/หน่วยงาน</p>,
				name: "ตำแหน่ง",
				selector: (row) => row.position,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.position}</p>
					</div>
				),
			},
			{
				name: "ชื่อ-นามสกุล",
				selector: (row) => row.student.displayname_th,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.student.displayname_th}</p>
					</div>
				),
			},
			{
				name: "อีเมล",
				selector: (row) => row.student.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.student.email}</p>
					</div>
				),
			},
			{
				name: "เบอร์โทร",
				selector: (row) => row.student.tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.student.tel}</p>
					</div>
				),
			},
			{
				name: "สมัครจากโพสต์",
				selector: (row) => row.posts_job.job_title,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.posts_job.job_title}</p>
					</div>
				),
			},
			{
				name: "วันที่สมัคร",
				selector: (row) => row.date_apply,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.date_apply}</p>
					</div>
				),
			},
			{
				name: "ต้องการเอกสาร",
				selector: (row) => row.date_apply,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.date_apply}</p>
					</div>
				),
			},
			{
				name: "RESUME",
				selector: (row) => row.student.resume,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<a href="#" onClick={() => handleViewResume(row.student.std_id)}>
							Resume
						</a>
					</div>
				),
			},
			{
				// button: "true",
				cell: (row) => (
					<>
						<button
							className={`btn btn-sm btn-outline-secondary`}
							onClick={() => handleViewProfile(row.student.std_id)}
						>
							<FontAwesomeIcon icon={faEye} />
						</button>
						<button
							className={`btn btn-sm btn-outline-success ms-2`}
							onClick={() =>
								handleConfirmApply(
									row.apply_id,
									row.student.displayname_th,
									row.position
								)
							}
						>
							<FontAwesomeIcon icon={faCheck} />
						</button>
						<button
							className={`btn btn-sm btn-outline-danger ms-2`}
							onClick={() =>
								handleRefuseApply(row.apply_id, row.student.displayname_th)
							}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</>
				),
				ignoreRowClick: true,
				// allowOverflow: true,
			},
		],
		[]
	);

	// fow table selectableRows
	const [selectedRows, setSelectedRows] = useState([]);
	const [toggledClearRows, setToggleClearRows] = useState(false);

	const handleClearRows = () => {
		setSelectedRows([]);
		setToggleClearRows(!toggledClearRows);
	};

	const handleRowSelected = ({ allSelected, selectedCount, selectedRows }) => {
		const selectedRowData = selectedRows.map((item) => item.apply_id);
		console.log(selectedRowData);
		setSelectedRows(selectedRowData);
	};

	// for table search
	const [selectedSearchField, setSelectedSearchField] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const fieldsToSearch = [
		"position",
		"date_apply",
		"posts_job.job_title",
		"student.displayname_th",
		"student.email",
	];
	const filteredData = data.filter((item) => {
		if (selectedSearchField === "all") {
			return fieldsToSearch.some(
				(field) =>
					item[field] &&
					item[field].toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			const fields = selectedSearchField.split(".");
			let fieldValue = item;

			for (const field of fields) {
				if (fieldValue && fieldValue.hasOwnProperty(field)) {
					fieldValue = fieldValue[field];
				} else {
					fieldValue = undefined;
					break;
				}
			}

			if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
				const objectValues = Object.values(fieldValue);
				return objectValues.some(
					(value) =>
						typeof value === "string" &&
						value
							.trim()
							.toLowerCase()
							.includes(searchQuery.trim().toLowerCase())
				);
			} else {
				return (
					typeof fieldValue === "string" &&
					fieldValue
						.trim()
						.toLowerCase()
						.includes(searchQuery.trim().toLowerCase())
				);
			}
		}
	});
	// const filteredData = data.filter((item) => {
	// 	const fields = selectedSearchField.split(".");
	// 	let fieldValue = item;

	// 	for (const field of fields) {
	// 		if (fieldValue && fieldValue.hasOwnProperty(field)) {
	// 			fieldValue = fieldValue[field];
	// 		} else {
	// 			fieldValue = undefined;
	// 			break;
	// 		}
	// 	}

	// 	if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
	// 		const objectValues = Object.values(fieldValue);
	// 		return objectValues.some(
	// 			(value) =>
	// 				typeof value === "string" &&
	// 				value.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
	// 		);
	// 	} else {
	// 		return (
	// 			typeof fieldValue === "string" &&
	// 			fieldValue
	// 				.trim()
	// 				.toLowerCase()
	// 				.includes(searchQuery.trim().toLowerCase())
	// 		);
	// 	}
	// });
	const handleSearchFieldChange = (e) => {
		const value = e.target.value;
		setSelectedSearchField(value);
	};
	const handleSearchQuery = (e) => {
		setSearchQuery(e.target.value);
		// handleClearRows();
	};

	// console.log(requireDocStates);

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">นักศึกษาที่สมัครฝึกงาน ({data.length})</h3>
			</div>

			<div className="searchBox">
				<label className="form-label fw-bold" htmlFor="selectFilter">
					ค้นหาโดย :
				</label>
				<div className="input-group input-group-sm mb-3">
					<select
						id="selectFilter"
						className="form-select"
						value={selectedSearchField}
						// onChange={(e) => setSelectedSearchField(e.target.value)}
						onChange={(e) => handleSearchFieldChange(e)}
					>
						<option value="all" label="ทั้งหมด">
							ทั้งหมด
						</option>
						<option value="position" label="ตำแหน่ง">
							ตำแหน่ง
						</option>
						<option value="posts_job.job_title" label="จากโพสต์">
							จากโพสต์
						</option>
						<option value="student.displayname_th" label="ชื่อ-นามสกุล">
							ชื่อ-นามสกุล
						</option>
						<option value="student.email" label="อีเมล">
							อีเมล
						</option>
						<option value="date_apply" label="วันที่สมัคร">
							วันที่สมัคร
						</option>
					</select>

					<input
						type="text"
						className="form-control w-75"
						aria-label="Sizing example input"
						aria-describedby="inputGroup-sizing-sm"
						placeholder="ค้นหา..."
						value={searchQuery}
						onChange={(e) => handleSearchQuery(e)}
					/>
					<div className="mx-1">({filteredData.length})</div>
				</div>
			</div>

			{filteredData.length && selectedRows.length ? (
				<div className="row my-1 my-sm-auto">
					<div className="col">
						<div
							className="btn-toolbar"
							role="toolbar"
							aria-label="Toolbar with button groups"
						>
							<div className="btn-group me-2" role="group">
								<div className="me-2">
									<p>
										เลือกทั้งหมด <span>{selectedRows.length}</span> :{" "}
									</p>
								</div>
								<div>
									<button
										className={`btn btn-sm btn-outline-dark me-2`}
										onClick={handleClearRows}
									>
										ยกเลิกการเลือก
									</button>
									<button
										className={`btn btn-sm btn-outline-success me-2 mt-1 mt-sm-auto`}
										onClick={null}
									>
										<FontAwesomeIcon icon={faPenToSquare} />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div style={{ height: "2.5rem" }}></div>
			)}
			<DataTable
				columns={applyColumns}
				data={filteredData}
				customStyles={customStyles}
				defaultSortFieldId={1}
				defaultSortAsc={false} // เรียงจากมากไปน้อย
				fixedHeader
				responsive
				pagination
				highlightOnHover
				selectableRows
				selectableRowsHighlight
				onSelectedRowsChange={handleRowSelected}
				clearSelectedRows={toggledClearRows}
			/>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ตำแหน่ง</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">จากโพสต์</th>
							<th scope="col">วันที่สมัคร</th>
							<th scope="col">Require Doc</th>
							<th scope="col">RESUME</th>
							<th scope="col">ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((item, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{item.position}</td>
								<td>{`${item.student.displayname_th} `}</td>
								<td>{item.student.email}</td>
								<td>{item.student.tel}</td>
								<td>{item.posts_job.job_title}</td>
								<td>{item.date_apply}</td>
								<td>
									{/* Checkbox for Require Doc */}
									<input
										type="checkbox"
										checked={requireDocStates["require_doc"] === 1}
										onChange={(e) =>
											setRequireDocStates({
												...requireDocStates,
												require_doc: e.target.checked ? 1 : 0,
											})
										}
									/>
								</td>
								<td>
									<a
										href="#"
										onClick={() => handleViewResume(item.student.std_id)}
									>
										Resume
									</a>
								</td>
								<td>
									<button
										type="button"
										className="btn btn-secondary m-1"
										onClick={() => handleViewProfile(item.student.std_id)}
									>
										<FontAwesomeIcon icon={faEye} />
									</button>
									<button
										type="button"
										className="btn btn-success m-1"
										onClick={() =>
											handleConfirmApply(
												item.apply_id,
												item.student.displayname_th,
												item.position
											)
										}
									>
										<FontAwesomeIcon icon={faCheck} />
									</button>
									<button
										type="button"
										className="btn btn-danger m-1"
										onClick={() =>
											handleRefuseApply(
												item.apply_id,
												item.student.displayname_th
											)
										}
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{/* Confirm Modal */}
			<Modal
				show={showConfirmModal}
				onHide={() => setShowConfirmModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						ยืนยันการรับนักศึกษาฝึกงาน
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						คุณยืนยันที่จะรับนักศึกษา{" "}
						<span className="fw-bold">{selectedStudentName}</span>{" "}
						เข้าฝึกงานในตำแหน่ง{" "}
						<span className="fw-bold">{selectPosition}</span>{" "}
					</p>
					<p>{data.position}</p>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowConfirmModal(false)}
					>
						ปิด
					</Button>
					<Button variant="success" onClick={confirmApply}>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showRefuseModal}
				onHide={() => setShowRefuseModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						ยืนยันการปฏิเสธรับนักศึกษาฝึกงาน
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณยืนยันที่จะปฏิเสธรับนักศึกษา {selectedStudentName} เข้าฝึกงาน
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowRefuseModal(false)}>
						ปิด
					</Button>
					<Button variant="danger" onClick={refuseApply}>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showProfileModal}
				onHide={() => setShowProfileModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Student Profile</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedStudentDetails && (
						<div className="row">
							<div className="col-12">
								<div className="stdProfileDetail px-2 pt-3">
									<div className="row">
										<div className="col-sm-6 stdName">
											<p className="fw-bold">ชื่อ-นามสกุล</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.displayname_th}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdSurname">
											<p className="fw-bold">ชื่อ-นามสกุล (ภาษาอังกฤษ)</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.displayname_en}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 std_id">
											<p className="fw-bold">รหัสนักศึกษา</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.std_id}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdDepartment">
											<p className="fw-bold">ภาควิชา</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.department}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdFaculty">
											<p className="fw-bold">คณะ</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.faculty}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">GPA</p>
											{selectedStudentDetails.gpa ? (
												<h6>{selectedStudentDetails.gpa}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdFaculty">
											<p className="fw-bold">ประสบการณ์</p>
											{selectedStudentDetails.experience ? (
												<h6>{selectedStudentDetails.experience}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">ทักษะ</p>
											{selectedStudentDetails.skill ? (
												<h6>{selectedStudentDetails.skill}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdMail">
											<p className="fw-bold">อีเมล</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.email}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">โทรศัพท์</p>
											{selectedStudentDetails.tel ? (
												<h6>{selectedStudentDetails.tel}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowProfileModal(false)}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showResumeModal}
				onHide={() => setShowResumeModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Student Resume</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
							{viewPdf && (
								<Viewer
									fileUrl={viewPdf}
									// httpHeaders={{
									// 	authtoken: user.user.token,
									// }}
									plugins={[defaultLayoutPluginInstance]}
									// withCredentials={true}
								/>
							)}
							{!viewPdf && <p>No PDF</p>}
						</Worker>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowResumeModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default EmSeeApply;
