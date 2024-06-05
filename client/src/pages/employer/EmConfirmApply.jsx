import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import Loading from "../../components/Loading";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faCheck,
	faTimes,
	faNoteSticky,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faFile, faHourglassHalf } from "@fortawesome/free-regular-svg-icons";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";

import axios from "axios";

function EmConfirmApply() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [showResumeModal, setShowResumeModal] = useState(false);

	const [showRefuseModal, setShowRefuseModal] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
	const [selectedStudent, setSelectedStudent] = useState({
		displayname_th: null,
		confirm_id: null,
	});

	const [viewPdf, setViewPdf] = useState(null);
	const [modalTitle, setModalTitle] = useState("");

	// const { user } = useSelector((state) => ({ ...state }));
	const user = useSelector((state) => state.user);

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

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/allConfirm",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			// console.log(response.data);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	// const [selectedSearchField, setSelectedSearchField] = useState("position");
	// const [searchQuery, setSearchQuery] = useState("");
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

	const handleViewResume = async (std_id) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setViewPdf(
				import.meta.env.VITE_FILE_API + `/uploads/${response.data.resume}`
			);
			setModalTitle("เรซูเม่");
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};
	const handleRefuseConfirm = (confirm_id, displayname_th) => {
		setSelectedStudent({
			...selectedStudent,
			confirm_id: confirm_id,
			displayname_th: displayname_th,
		});
		setShowRefuseModal(true);
	};
	// const refuseConfirm = async () => {
	// 	try {
	// 		const response = await axios.delete(
	// 			import.meta.env.VITE_APP_API +
	// 				`/refuseConfirm/${selectedStudent.confirm_id}`,
	// 			{
	// 				headers: {
	// 					authtoken: user.user.token,
	// 				},
	// 			}
	// 		);
	// 		console.log(response.data);
	// 		// You might want to handle the success or update the UI accordingly
	// 		// For example, close the modal and refresh the data
	// 		setShowRefuseModal(false);
	// 		fetchData();
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	// fetch Data from Gened DOC with license
	const handleViewCourtesyLic = async (std_id, academic_year) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/getGenDoc/${std_id}/${academic_year}`,
				{}
			);

			setViewPdf(
				import.meta.env.VITE_FILE_API +
					`/uploads/${response.data.courtesy_license}`
			);
			setModalTitle("หนังสือขอความอนุเคราะห์ฝึกงาน");
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	// fetch Data from Gened DOC with Letter มาทำเพิ่ม
	const handleViewLetter = async (std_id, academic_year) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + `/getGenDoc/${std_id}/${academic_year}`,
				{}
			);
			setViewPdf(
				import.meta.env.VITE_FILE_API +
					`/uploads/${response.data.intern_letter}`
			);
			setModalTitle("หนังสือส่งตัว");
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};
	// const hasCourtesyLic = async(std_id) => {
	// 	try {
	// 		const response = await axios.get(
	// 			import.meta.env.VITE_APP_API+`/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		console.log("hello you",response && response.data.courtesy_license !== undefined);
	// 		return response && response.data.courtesy_license !== undefined;

	// 	} catch (error) {
	// 		console.error("Error fetching student details:", error);
	// 	}
	// 		// return studentData && studentData.courtesy_license !== undefined;
	// 	};

	// const hasDoc = async(std_id) => {
	// 	try {
	// 		const response = await axios.get(
	// 			import.meta.env.VITE_APP_API+`/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		const response2 = await axios.get(
	// 			import.meta.env.VITE_APP_API+`/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		console.log("hello you",response && response.data.courtesy_license !== undefined);
	// 		return response && response.data.courtesy_license !== undefined;

	// 	} catch (error) {
	// 		console.error("Error fetching student details:", error);
	// 	}
	// 		// return studentData && studentData.intern_letter !== undefined;
	// 	};

	// console.log(data);

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
		resume: {
			label: "เรซูเม่",
			is_hide: false,
		},
		job_title: {
			label: "สมัครจากโพสต์",
			is_hide: false,
		},
		date_confirm: {
			label: "วันที่รับ",
			is_hide: false,
		},
		status: {
			label: "เอกสารจากภาควิชา",
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
	const confirmData = data.map((item) => ({
		id: item.confirm_id,
		academic_year: item.academic_year,
		confirm_id: item.confirm_id,
		position: item.position,
		std_id: item.std_id,
		displayname_th:
			item.student.name_title_th === null
				? item.student.displayname_th
				: item.student.name_title_th + item.student.displayname_th,
		email: item.student.email,
		tel: item.student.tel,
		resume: item.student.resume,
		job_id: item.job_id,
		job_title: item.posts_job.job_title,
		date_confirm: item.date_confirm,
		status: item.status,
	}));
	const confirmColumns = useMemo(
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
				name: "วันที่รับ",
				selector: (row) => row.date_confirm,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.date_confirm}</p>
					</div>
				),
				omit: tableColOptions.date_confirm.is_hide,
			},
			{
				name: <p className="mb-0">เอกสารจากภาควิชา</p>,
				selector: (row) => row.status,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<>
						{row.status !== "รอดำเนินเอกสาร" ? (
							<div>
								<p
									className="a-text mb-2"
									onClick={() =>
										handleViewCourtesyLic(row.std_id, row.academic_year)
									}
								>
									<FontAwesomeIcon icon={faFile} /> เอกสาร[1]
								</p>
								<p
									className="a-text mb-0"
									onClick={() =>
										handleViewLetter(row.std_id, row.academic_year)
									}
								>
									<FontAwesomeIcon icon={faFile} /> เอกสาร[2]
								</p>
							</div>
						) : (
							<p className="mb-0 text-muted">
								<FontAwesomeIcon icon={faHourglassHalf} /> {row.status}
							</p>
						)}
						{/* <p className="m-auto">{row.status}</p> */}
					</>
				),
				omit: tableColOptions.status.is_hide,
			},
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
						{/* <button
							className={`btn btn-sm btn-outline-danger ms-2`}
							onClick={() =>
								handleRefuseConfirm(row.confirm_id, row.displayname_th)
							}
						>
							<FontAwesomeIcon icon={faTimes} />
						</button> */}
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
		"date_confirm",
	];
	const filteredData = confirmData
		// .filter((item) => item.status === "รอการตอบรับ")
		.filter((item) => {
			if (selectedSearchField === "all") {
				return fieldsToSearch.some((field) =>
					item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
				);
			} else {
				// ของเดิมที่เป็นแบบเลือกว่าจะค้นหา field ไหน
				// return item[selectedSearchField]
				// 	.trim()
				// 	.toLowerCase()
				// 	.includes(searchQuery.trim().toLowerCase());

				// แก้ถ้าข้อมูลมันเป็น Null
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

	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">
						นักศึกษาที่รับฝึกงานแล้ว (ทั้งหมด {data.length} คน)
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
								.filter(
									([key]) =>
										key !== "actions" && key !== "resume" && key !== "status"
								)
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
					columns={confirmColumns}
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

				{/* <div className="table-responsive text-nowrap">
					<table className="table table-striped">
						<thead>
							<tr className="table-dark">
								<th scope="col">#</th>
								<th scope="col">ตำแหน่ง</th>
								<th scope="col">ชื่อ-นามสกุล</th>
								<th scope="col">อีเมล</th>
								<th scope="col">เบอร์โทร</th>
								<th scope="col">จากโพสต์</th>
								<th scope="col">เอกสารจากภาควิชา</th>
								<th scope="col">วันที่รับ</th>
								<th scope="col">RESUME</th>
								<th scope="col">ACTIONS</th>
							</tr>
						</thead>
						<tbody>
							{data.map((data, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{data.position}</td>
									<td>{`${data.student.displayname_th} `}</td>
									<td>{data.student.email}</td>
									<td>{data.student.tel}</td>
									<td>{data.posts_job.job_title}</td>
									<td>
										{data.status != "รอดำเนินเอกสาร" ? (
											<div>
												<Link to="#">
													<button
														type="button"
														className={`btn btn-secondary m-1`}
														onClick={() =>
															handleViewCourtesyLic(
																data.student.std_id,
																data.academic_year
															)
														}
													>
														<FontAwesomeIcon icon={faEye} />
													</button>
												</Link>
												<Link to="#">
													<button
														type="button"
														className={`btn btn-secondary m-1`}
														onClick={() =>
															handleViewLetter(
																data.student.std_id,
																data.academic_year
															)
														}
													>
														<FontAwesomeIcon icon={faEye} />
													</button>
												</Link>
											</div>
										) : (
											<p>รอดำเนินเอกสาร</p>
										)}
									</td>
									<td>{data.date_confirm}</td>
									<td>
										<div>
											<a
												href="#"
												onClick={() => handleViewResume(data.student.std_id)}
											>
												Resume
											</a>
										</div>
									</td>
									<td>
										<button
											className={`btn btn-sm btn-outline-secondary`}
											onClick={() => handleViewProfile(data.student.std_id)}
										>
											<FontAwesomeIcon icon={faEye} />
										</button>
										<button
											className={`btn btn-sm btn-outline-danger ms-2`}
											onClick={() =>
												handleRefuseConfirm(
													data.confirm_id,
													data.student.displayname_th
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
				</div> */}

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
						<span className="fw-bold">
							{selectedStudent.displayname_th}
						</span>{" "}
						เข้าฝึกงาน
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant="secondary"
							onClick={() => setShowRefuseModal(false)}
						>
							ปิด
						</Button>
						{/* <Button variant="danger" onClick={refuseConfirm}>
							ยืนยัน
						</Button> */}
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
						<Modal.Title className="fw-bold">{modalTitle}</Modal.Title>
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
						<Button
							variant="secondary"
							onClick={() => setShowResumeModal(false)}
						>
							ปิด
						</Button>
					</Modal.Footer>
				</Modal>
			</div>

			{data.length ? <Annotation /> : <></>}
		</>
	);

	function Annotation({ status }) {
		return (
			<>
				<div className="container p-3 p-md-4 mt-4 bg-light container-card">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							<FontAwesomeIcon
								icon={faNoteSticky}
								className="text-light-blue"
							/>{" "}
							คำอธิบายประกอบ
						</h5>
					</div>

					{/* <p className="m-auto">ไฟล์เอกสาร/หนังสือ</p> */}

					<ul className="list-group list-group-flush">
						<div>
							<li className="list-group-item">
								<span className="a-text">
									<FontAwesomeIcon icon={faFile} /> เอกสาร[1]
								</span>{" "}
								คือ หนังสือขอความอนุเคราะห์ฝึกงาน
							</li>
							<li className="list-group-item">
								<span className="a-text">
									<FontAwesomeIcon icon={faFile} /> เอกสาร[2]
								</span>{" "}
								คือ หนังสือส่งตัว
							</li>
						</div>
					</ul>

					<p className="mb-0 mt-4 fw-bold">
						หมายเหตุ
						หากต้องการยกเลิกหรือปฏิเสธการรับนักศึกษาคนใดคนหนึ่งเข้าฝึกงานหลังจากที่ได้ทำการยืนยันรับนักศึกษาคนนั้นเข้าฝึกงานแล้ว
						หากท่านมีเหตุผลอันสมควร กรุณาติดต่อภาควิชาฯ
					</p>
				</div>
			</>
		);
	}
}

export default EmConfirmApply;
