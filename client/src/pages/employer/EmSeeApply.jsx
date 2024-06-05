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
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";
import Loading from "../../components/Loading";
import AlertBox from "../../components/AlertBox";

import "../../components/PDFViewer.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function EmSeeApply() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [msg, setMsg] = useState("");
	const [alertKey, setAlertKey] = useState(0);

	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showRefuseModal, setShowRefuseModal] = useState(false);
	const [viewPdf, setViewPdf] = useState(null);
	const [showResumeModal, setShowResumeModal] = useState(false);
	const [requireDocStates, setRequireDocStates] = useState({});
	const [selectedStudent, setSelectedStudent] = useState({
		position: null,
		displayname_th: null,
		apply_id: null,
		require_doc: 0,
	});
	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

	const showAlert = () => {
		setAlertKey((prevKey) => prevKey + 1);
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/allApply",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			setData(response.data);
			// console.log(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const [showProfileModal, setShowProfileModal] = useState(false);
	const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

	const handleViewProfile = async (std_id) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setSelectedStudentDetails(response.data);
			setShowProfileModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleViewResume = async (std_id, displayname_th) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setViewPdf(
				import.meta.env.VITE_FILE_API + `/uploads/${response.data.resume}`
			);
			setSelectedStudent({
				...selectedStudent,
				displayname_th: displayname_th,
			});
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleConfirmApply = (apply_id, displayname_th, position) => {
		setSelectedStudent({
			...selectedStudent,
			position: position,
			displayname_th: displayname_th,
			apply_id: apply_id,
		});
		setShowConfirmModal(true);
	};

	const handleRefuseApply = (apply_id, displayname_th) => {
		setSelectedStudent({
			...selectedStudent,
			position: null,
			displayname_th: displayname_th,
			apply_id: apply_id,
		});
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
		setLoading(true); ////
		try {
			setShowConfirmModal(false); ////

			const response = await axios.post(
				import.meta.env.VITE_APP_API + "/createConfirm",
				{
					apply_id: selectedStudent.apply_id,
					require_doc: selectedStudent.require_doc,
					// require_doc: requireDocStates.require_doc,
				},
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			setMsg(`ยืนยันรับ ${selectedStudent.displayname_th} เข้าฝึกงาน`);
			// console.log(response.data);
			// You might want to handle the success or update the UI accordingly
			// For example, close the modal and refresh the data

			fetchData();
			showAlert();
		} catch (error) {
			console.error(error);
		}
	};

	const refuseApply = async () => {
		try {
			const response = await axios.put(
				import.meta.env.VITE_APP_API +
					`/refuseApplyEmp/${selectedStudent.apply_id}`,
				{}, // Empty object since there's no data to send in the request body
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			setMsg(`ปฎิเสธรับ ${selectedStudent.displayname_th}`);
			console.log(response.data);
			// You might want to handle the success or update the UI accordingly
			// For example, close the modal and refresh the data
			setShowRefuseModal(false);
			fetchData();
			showAlert();
		} catch (error) {
			console.log(user.user.token);
			console.error(error);
		}
	};

	// STARTING REACT-DATA-TABLE-COMPONENT PART
	const [tableColOptions, setTableColOptions] = useState({
		position: {
			label: "ตำแหน่ง",
			is_hide: false,
		},
		std_id: {
			label: "เลขทะเบียนนักศึกษา",
			is_hide: true,
		},
		displayname_th: {
			label: "ชื่อ-นามสกุล",
			is_hide: false,
		},
		email: {
			label: "อีเมล",
			is_hide: false,
		},
		tel: {
			label: "เบอร์โทร",
			is_hide: false,
		},
		job_title: {
			label: "สมัครจากโพสต์",
			is_hide: false,
		},
		date_apply: {
			label: "วันที่สมัคร",
			is_hide: false,
		},
		resume: {
			label: "เรซูเม่",
			is_hide: false,
		},
		actions: {
			label: "ACTIONS",
			is_hide: false,
		},
	});
	const handleHideColumn = (e) => {
		const { name, checked } = e.target;

		setTableColOptions({
			...tableColOptions,
			[name]: { ...tableColOptions[name], is_hide: checked },
		});
	};
	const applyData = data.map((item) => ({
		id: item.apply_id,
		apply_id: item.apply_id,
		position: item.position,
		std_id: item.student.std_id,
		displayname_th:
			item.student.name_title_th === null
				? item.student.displayname_th
				: item.student.name_title_th + item.student.displayname_th,
		email: item.student.email,
		tel: item.student.tel,
		resume: item.student.resume,
		job_id: item.job_id,
		job_title: item.posts_job.job_title,
		date_apply: item.date_apply,
		status: item.status,
	}));
	const applyColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: "ตำแหน่ง",
				selector: (row) => row.position,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.position}</p>
					</div>
				),
				omit: tableColOptions.position.is_hide,
			},
			{
				name: <p className="mb-0">เลขทะเบียนนักศึกษา</p>,
				selector: (row) => row.std_id,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.std_id}</p>
					</div>
				),
				omit: tableColOptions.std_id.is_hide,
			},
			{
				name: <p className="mb-0">ชื่อ-นามสกุล</p>,
				selector: (row) => row.displayname_th,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.displayname_th}</p>
					</div>
				),
				omit: tableColOptions.displayname_th.is_hide,
			},
			{
				name: "อีเมล",
				selector: (row) => row.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.email}</p>
					</div>
				),
				omit: tableColOptions.email.is_hide,
			},
			{
				name: "เบอร์โทร",
				selector: (row) => row.tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.tel}</p>
					</div>
				),
				omit: tableColOptions.tel.is_hide,
			},
			{
				name: "เรซูเม่",
				selector: (row) => row.resume,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<a
							className="a-text"
							onClick={() => handleViewResume(row.std_id, row.displayname_th)}
						>
							<FontAwesomeIcon icon={faFile} /> เรซูเม่
						</a>
					</div>
				),
				omit: tableColOptions.resume.is_hide,
				grow: 0,
			},
			{
				// name: "สมัครจากโพสต์",
				name: <p className="mb-0">สมัครจากโพสต์</p>,
				selector: (row) => row.job_title,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<Link
							to={`/job/${row.job_id}/${row.job_title
								.toLowerCase()
								.replaceAll(" ", "-")}`}
							target="_blank"
						>
							{row.job_title}
						</Link>
					</div>
				),
				omit: tableColOptions.job_title.is_hide,
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
				omit: tableColOptions.date_apply.is_hide,
			},
			// {
			// 	name: <p className="mb-0">ต้องการเอกสาร</p>,
			// 	selector: (row) => row.date_apply,
			// 	sortable: true,
			// 	reorder: true,
			// 	cell: (row) => (
			// 		<input
			// 			type="checkbox"
			// 			checked={requireDocStates["require_doc"] === 1}
			// 			onChange={(e) =>
			// 				setRequireDocStates({
			// 					...requireDocStates,
			// 					require_doc: e.target.checked ? 1 : 0,
			// 				})
			// 			}
			// 		/>
			// 	),
			// },
			{
				// button: "true",
				cell: (row) => (
					<>
						<button
							className={`btn btn-sm btn-outline-secondary`}
							onClick={() => handleViewProfile(row.std_id)}
						>
							<FontAwesomeIcon icon={faEye} />
						</button>
						<button
							className={`btn btn-sm btn-outline-success ms-2`}
							onClick={() =>
								handleConfirmApply(
									row.apply_id,
									row.displayname_th,
									row.position
								)
							}
						>
							<FontAwesomeIcon icon={faCheck} />
						</button>
						<button
							className={`btn btn-sm btn-outline-danger ms-2`}
							onClick={() =>
								handleRefuseApply(row.apply_id, row.displayname_th)
							}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</>
				),
				ignoreRowClick: true,
				// allowOverflow: true,
				omit: tableColOptions.actions.is_hide,
			},
		],
		[tableColOptions]
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
		setSelectedRows(selectedRowData);
		// console.log(selectedStudent.position);
		// console.log(selectedStudent.require_doc);
	};

	// for table search
	const [selectedSearchField, setSelectedSearchField] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const fieldsToSearch = [
		"position",
		"displayname_th",
		"email",
		"tel",
		"job_title",
		"date_apply",
	];
	const filteredData = applyData
		.filter((item) => item.status === "รอการตอบรับ") ////
		.filter((item) => {
			if (selectedSearchField === "all") {
				return fieldsToSearch.some((field) =>
					item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
				);
			} else {
				// ของเดิมที่เป็นแบบเลือกว่าจะค้นหา field ไหน
				return item[selectedSearchField]
					?.toLowerCase()
					.includes(searchQuery.trim().toLowerCase());
			}
		});

	const handleSearchFieldChange = (e) => {
		const value = e.target.value;
		setSelectedSearchField(value);
		setSearchQuery("");
	};
	const handleSearchQuery = (e) => {
		setSearchQuery(e.target.value);
		// handleClearRows();
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	// console.log(requireDocStates);

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">
					นักศึกษาที่สมัครฝึกงาน (ทั้งหมด{" "}
					{data.filter((item) => item.status === "รอการตอบรับ").length} คน)
				</h3>
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
						{Object.entries(tableColOptions)
							.filter(([key]) => key !== "actions" && key !== "resume")
							.map(([key, val] = entry, index) => (
								<option key={index} value={key} label={val.label}>
									{val.label}
								</option>
							))}
					</select>

					<input
						type="search"
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

			<div className="tableToolbar row my-1 my-sm-auto">
				<div className="col">
					<div
						className="btn-toolbar"
						role="toolbar"
						aria-label="Toolbar with button groups"
					>
						<div className="dropdown">
							<button
								className="btn btn-sm btn-outline-secondary dropdown-toggle"
								type="button"
								data-bs-toggle="dropdown"
								data-bs-auto-close="outside"
								aria-expanded="false"
							>
								ตัวเลือกเพิ่มเติม
							</button>

							{selectedRows.length ? (
								<div className="btn-group mx-2" role="group">
									<div>
										<button
											className={`btn btn-sm btn-outline-dark me-2`}
											onClick={handleClearRows}
										>
											เลือกทั้งหมด <span>{selectedRows.length}</span>{" "}
											<FontAwesomeIcon
												icon={faXmark}
												className="text-secondary"
											/>
										</button>
										{/* <button
											className={`btn btn-sm btn-outline-success me-2 mt-1 mt-sm-auto`}
											onClick={null}
										>
											<FontAwesomeIcon icon={faPenToSquare} />
										</button> */}
									</div>
								</div>
							) : (
								<></>
							)}

							<div className="dropdown-menu">
								<div className="d-flex flex-column flex-sm-row">
									<div className="bg-light px-2">
										<label htmlFor="hideColumn">ซ่อนคอลัมน์</label>
										<ul id="hideColumn" className="list-unstyled text-nowrap">
											{Object.entries(tableColOptions).map(
												([key, val] = entry, index) => (
													<li key={index}>
														<div className="form-check form-check-inline">
															<input
																className="form-check-input"
																type="checkbox"
																name={key}
																id={`${index}_${key}`}
																checked={val.is_hide}
																onChange={(e) => handleHideColumn(e)}
															/>
															<label
																className="form-check-label"
																htmlFor={`${index}_${key}`}
															>
																{val.label}
															</label>
														</div>
													</li>
												)
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div style={{ height: "2.5rem" }}></div>
					</div>
				</div>
			</div>

			<DataTable
				columns={applyColumns}
				data={filteredData}
				customStyles={customStyles}
				defaultSortFieldId={1} // id maybe
				defaultSortAsc={false} // เรียงจากมากไปน้อย
				fixedHeader
				responsive
				pagination
				highlightOnHover
				selectableRows={false}
				selectableRowsHighlight
				onSelectedRowsChange={handleRowSelected}
				clearSelectedRows={toggledClearRows}
				noDataComponent={<NoTableData />}
			/>

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
						คุณยืนยันที่จะรับ{" "}
						<span className="fw-bold">{selectedStudent.displayname_th}</span>{" "}
						เข้าฝึกงานในตำแหน่ง{" "}
						<span className="fw-bold">{selectedStudent.position}</span>{" "}
					</p>
					<div className="form-check form-check-inline">
						<input
							type="checkbox"
							id="requireDoc"
							className="form-check-input"
							checked={selectedStudent.require_doc}
							// checked={requireDocStates["require_doc"] === 1}
							onChange={(e) =>
								setSelectedStudent({
									...selectedStudent,
									require_doc: e.target.checked ? 1 : 0,
								})
							}
							// onChange={(e) =>
							// 	setRequireDocStates({
							// 		...requireDocStates,
							// 		require_doc: e.target.checked ? 1 : 0,
							// 	})
							// }
						/>
						<label className="form-check-label" htmlFor="requireDoc">
							เอกสารฉบับจริง
						</label>
					</div>
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
					คุณยืนยันที่จะ<span className="fw-bold text-danger">ปฏิเสธ</span>
					การรับ{" "}
					<span className="fw-bold">{selectedStudent.displayname_th}</span>{" "}
					เข้าฝึกงาน
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
					<Modal.Title className="fw-bold">ข้อมูลนักศึกษา</Modal.Title>
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
											<p className="fw-bold">เลขทะเบียนนักศึกษา</p>
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
												<h6>
													{selectedStudentDetails.experience
														.split("\n")
														.map((line, index) => (
															<span key={index} className="mb-1">
																{line}
															</span>
														))}
												</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">ทักษะ</p>
											{selectedStudentDetails.skill ? (
												<h6>
													{selectedStudentDetails.skill
														.split("\n")
														.map((line, index) => (
															<span key={index} className="mb-1">
																{line}
															</span>
														))}
												</h6>
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
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showResumeModal}
				fullscreen="lg-down"
				onHide={() => setShowResumeModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						{selectedStudent.displayname_th}
					</Modal.Title>
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
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>

			{msg ? <AlertBox key={alertKey} message={msg} duration={3000} /> : <></>}
		</div>
	);
}

function TempTable() {
	return (
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
					{filteredData
						// .filter((item) => item.status === "รอการตอบรับ")
						.map((filteredData, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{filteredData.position}</td>
								<td>{`${filteredData.displayname_th} `}</td>
								<td>{filteredData.email}</td>
								<td>{filteredData.tel}</td>
								<td>{filteredData.job_title}</td>
								<td>{filteredData.date_apply}</td>
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
										onClick={() => handleViewResume(filteredData.std_id)}
									>
										Resume
									</a>
								</td>
								<td>
									<button
										type="button"
										className="btn btn-secondary m-1"
										onClick={() => handleViewProfile(filteredData.std_id)}
									>
										<FontAwesomeIcon icon={faEye} />
									</button>
									<button
										type="button"
										className="btn btn-success m-1"
										onClick={() =>
											handleConfirmApply(
												filteredData.apply_id,
												filteredData.displayname_th,
												filteredData.position
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
												filteredData.apply_id,
												filteredData.displayname_th
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
	);
}

export default EmSeeApply;
