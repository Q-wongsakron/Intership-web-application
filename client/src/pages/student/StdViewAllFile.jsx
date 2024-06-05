import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
	faFile,
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
} from "@fortawesome/free-regular-svg-icons";
import { Modal, Button } from "react-bootstrap";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";
import { toast } from "react-toastify";
import axios from "axios";

function StdViewAllFile() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [showAllFileModal, setShowAllFileModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState({});

	const user = useSelector((state) => state.user);

	const handleDownload = async (fileType) => {
		try {
			if (fileType === "หนังสือขอความอนุเคราะห์") {
				try {
					//console.log("Downloaded")
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileCourtesy/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					console.log(File);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
					//console.log(selectedStudent.id)
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "หนังสือส่งตัว") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileLetter/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "รายงาน-pdf") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileReportPdf/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					console.log(File);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "รายงาน-docx") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileReportDocx/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/docx" });

					const downloadLink = document.createElement("a");
					downloadLink.href = URL.createObjectURL(fileBlob);
					downloadLink.download = `report_${selectedStudent.id}.docx`;

					document.body.appendChild(downloadLink);
					downloadLink.click();

					// Clean up
					URL.revokeObjectURL(downloadLink.href);
					document.body.removeChild(downloadLink);
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "ใบบันทึกเวลา") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileTimesheet/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "ไฟล์นำเสนอ-pdf") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFilePresentationPdf/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			} else if (fileType === "ไฟล์นำเสนอ-pptx") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFilePresentationPpt/${selectedStudent.id}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/pptx" });

					const downloadLink = document.createElement("a");
					downloadLink.href = URL.createObjectURL(fileBlob);
					downloadLink.download = `presentation_${selectedStudent.id}.pptx`;

					document.body.appendChild(downloadLink);
					downloadLink.click();

					URL.revokeObjectURL(downloadLink.href);
					document.body.removeChild(downloadLink);
				} catch (err) {
					toast.error(`ยังไม่มีไฟล์!`, {
						autoClose: 5000,
						position: "top-right",
					});
				}
			}
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	const handleSeeDocument = async (std_id, displayname_th) => {
		try {
			setSelectedStudent({
				...selectedStudent,
				id: std_id,
				displayname_th: displayname_th,
			});
			setShowAllFileModal(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const yearOptions = data.reduce((acc, item) => {
		const academicYear = item.apply
			? item.apply.academic_year
			: item.confirm
			? item.confirm.academic_year
			: item.self_enroll.academic_year;

		if (!acc.find((option) => option.value === academicYear)) {
			acc.push({
				label: academicYear,
				value: academicYear,
			});
		}
		return acc;
	}, []);

	// const [selectedYear, setSelectedYear] = useState({ label: "", value: "" });
	const [selectedYear, setSelectedYear] = useState("all");
	const handleSelectYearChange = (e) => {
		e.preventDefault();
		setSearchQuery("");
		setSelectedYear(e.target.value);
	};

	// STARTING REACT-DATA-TABLE-COMPONENT PART
	const [tableColOptions, setTableColOptions] = useState({
		academic_year: {
			label: "ปีการศึกษา",
			is_hide: true,
		},
		displayname_th: {
			label: "ชื่อ-นามสกุล",
			is_hide: false,
		},
		std_id: {
			label: "เลขทะเบียน",
			is_hide: false,
		},
		// email: {
		// 	label: "อีเมล",
		// 	is_hide: false,
		// },
		// tel: {
		// 	label: "เบอร์โทร",
		// 	is_hide: false,
		// },
		company_name: {
			label: "บริษัท/หน่วยงาน",
			is_hide: false,
		},
		docs: {
			label: "เอกสาร",
			is_hide: false,
		},
		// actions: {
		// 	label: "ACTIONS",
		// 	is_hide: false,
		// },
	});
	const handleHideColumn = (e) => {
		const { name, checked } = e.target;

		setTableColOptions({
			...tableColOptions,
			[name]: { ...tableColOptions[name], is_hide: checked },
		});
	};
	const studentData = data.map((item, index) => ({
		id: index,
		displayname_th:
			item.name_title_th === null
				? item.displayname_th
				: item.name_title_th + item.displayname_th,
		std_id: item.std_id,
		email: item.email,
		tel: item.tel !== null ? item.tel : item.self_enroll ? item.self_enroll.tel : null,
		company_name: item.apply
			? item.apply.employer.company_name
			: item.confirm
			? item.confirm.employer.company_name
			: item.self_enroll
			? item.self_enroll.company_name
			: null,
		academic_year: item.apply
			? item.apply.academic_year
			: item.confirm
			? item.confirm.academic_year
			: item.self_enroll
			? item.self_enroll.academic_year
			: null,
	}));
	const studentColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: <p className="mb-0">ปีการศึกษา</p>,
				selector: (row) => row.academic_year,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.academic_year}</p>
					</div>
				),
				omit: tableColOptions.academic_year.is_hide,
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
				name: "เลขทะเบียน",
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
			// {
			// 	name: "อีเมล",
			// 	selector: (row) => row.email,
			// 	sortable: true,
			// 	reorder: true,
			// 	cell: (row) => (
			// 		<div>
			// 			<p className="my-1">{row.email}</p>
			// 		</div>
			// 	),
			// 	omit: tableColOptions.email.is_hide,
			// },
			// {
			// 	name: "เบอร์โทร",
			// 	selector: (row) => row.tel,
			// 	sortable: true,
			// 	reorder: true,
			// 	cell: (row) => (
			// 		<div>
			// 			<p className="my-1">{row.tel}</p>
			// 		</div>
			// 	),
			// 	omit: tableColOptions.tel.is_hide,
			// },
			{
				name: <p className="mb-0">บริษัท/หน่วยงาน</p>,
				selector: (row) => row.company_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.company_name}</p>
					</div>
				),
				omit: tableColOptions.company_name.is_hide,
			},
			{
				name: "เอกสาร",
				selector: (row) => row.docs,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<button
						type="button"
						className={`btn btn-sm btn-outline-secondary`}
						onClick={() => handleSeeDocument(row.std_id, row.displayname_th)}
					>
						<FontAwesomeIcon icon={faEye} />
					</button>
				),
				omit: tableColOptions.docs.is_hide,
			},
			// {
			// 	cell: (row) => (
			// 		<>
			// 			<button
			// 				className={`btn btn-sm btn-outline-secondary`}
			// 				onClick={null}
			// 			>
			// 				<FontAwesomeIcon icon={faEye} />
			// 			</button>
			// 		</>
			// 	),
			// 	ignoreRowClick: true,
			// 	omit: tableColOptions.actions.is_hide,
			// },
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
	};

	// for table search
	const [selectedSearchField, setSelectedSearchField] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const fieldsToSearch = [
		"displayname_th",
		"std_id",
		// "email",
		// "tel",
		"company_name",
	];
	const filteredData = studentData
		.filter((item) => {
			if (item.academic_year === selectedYear) {
				return item.academic_year;
			} else if (selectedYear === "all") {
				return item;
			}
		})
		.filter((item) => {
			if (selectedSearchField === "all") {
				return fieldsToSearch.some((field) =>
					item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
				);
			} else {
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
		const { name, value } = e.target;
		setSearchQuery(value);
	};

	useEffect(() => {
		setLoading(true);

		const fetchData = async () => {
			try {
				const response = await axios.get(
					import.meta.env.VITE_APP_API + "/studentAllFile"
				);
				// console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">คลังเอกสารทั้งหมด</h3>

				<div className="yearFilterBox ms-3 px-2 py-1 bg-light rounded">
					<div className="d-flex flex-column flex-sm-row align-items-center">
						<div className="">
							<label
								className="form-label fw-bold my-1 pe-1 text-nowrap"
								htmlFor="selectYearFilter"
							>
								ปีการศึกษา :
							</label>
						</div>
						<div className="">
							<div className="input-group input-group-sm">
								<select
									id="selectYearFilter"
									className="form-select fw-semibold"
									value={selectedYear}
									onChange={(e) => handleSelectYearChange(e)}
								>
									<option value="all" label="ทั้งหมด" className="fw-semibold">
										ทั้งหมด
									</option>
									{yearOptions.map((item, index) => (
										<option
											key={index}
											value={item.value}
											label={item.label}
											className="fw-semibold"
										>
											{item.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="searchBox mb-2">
				<label className="form-label fw-bold" htmlFor="selectFilter">
					ค้นหาโดย :
				</label>
				<div className="input-group input-group-sm">
					<select
						id="selectFilter"
						className="form-select"
						value={selectedSearchField}
						onChange={(e) => handleSearchFieldChange(e)}
					>
						<option value="all" label="ทั้งหมด">
							ทั้งหมด
						</option>
						{Object.entries(tableColOptions)
							.filter(
								([key]) =>
									key !== "actions" && key !== "docs" && key !== "academic_year"
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
						{/* {selectedRows.length ? (
							<div className="btn-group mx-2" role="group">
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
						) : (
							<div style={{ height: "2.5rem" }}></div>
						)} */}

						<div style={{ height: "2.5rem" }}></div>
					</div>
				</div>
			</div>

			<DataTable
				columns={studentColumns}
				data={filteredData}
				customStyles={customStyles}
				defaultSortFieldId={2}
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
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">เลขทะเบียน</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">เอกสาร</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{`${item.displayname_th} `}</td>
								<td>{item.std_id}</td>
								<td>{item.email}</td>
								{item.tel ? (
									<td>{item.tel}</td>
								) : (
									<td>{item.self_enroll.tel}</td>
								)}

								{item.apply ? (
									<td>{item.apply.employer.company_name}</td>
								) : item.confirm ? (
									<td>{item.confirm.employer.company_name}</td>
								) : (
									<td>{item.self_enroll.company_name}</td>
								)}

								<td>
									<button
										type="button"
										className={`btn btn-sm btn-outline-dark`}
										onClick={() => handleSeeDocument(item.std_id)}
									>
										<FontAwesomeIcon icon={faEye} />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div> */}

			{/* View Docs Modal */}
			<Modal
				show={showAllFileModal}
				onHide={() => setShowAllFileModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">เอกสารทั้งหมด</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						ชื่อ-นามสกุล :{" "}
						<span className="fw-semibold">
							{selectedStudent.displayname_th}
						</span>
					</p>
					<p>
						เลขทะเบียน :{" "}
						<span className="fw-semibold">{selectedStudent.id}</span>
					</p>
					<ul className="list-group list-group-flush">
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("หนังสือขอความอนุเคราะห์")}
							>
								<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
								หนังสือขอความอนุเคราะห์
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("หนังสือส่งตัว")}
							>
								<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
								หนังสือส่งตัว
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("รายงาน-pdf")}
							>
								<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
								รายงาน (.pdf)
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("รายงาน-docx")}
							>
								<FontAwesomeIcon
									icon={faFileWord}
									className="docx-file-color"
								/>{" "}
								รายงาน (.docx)
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("ใบบันทึกเวลา")}
							>
								<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
								ใบบันทึกเวลา
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("ไฟล์นำเสนอ-pdf")}
							>
								<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
								ไฟล์นำเสนอ (.pdf)
							</span>
						</li>
						<li className="list-group-item my-1">
							<span
								className="a-text"
								onClick={() => handleDownload("ไฟล์นำเสนอ-pptx")}
							>
								<FontAwesomeIcon
									icon={faFilePowerpoint}
									className="pptx-file-color"
								/>{" "}
								ไฟล์นำเสนอ (.pptx)
							</span>
						</li>
					</ul>

					{/* <p
						className={`a-text`}
						onClick={() => handleDownload("หนังสือขอความอนุเคราะห์")}
					>
						ดูหนังสือขอความอนุเคราะห์
					</p>
					<p
						className={`a-text`}
						onClick={() => handleDownload("หนังสือส่งตัว")}
					>
						ดูหนังสือส่งตัว
					</p>
					<p className={`a-text`} onClick={() => handleDownload("รายงาน-pdf")}>
						ดูรายงาน-pdf
					</p>
					<p className={`a-text`} onClick={() => handleDownload("รายงาน-docx")}>
						ดูรายงาน-docx
					</p>
					<p
						className={`a-text`}
						onClick={() => handleDownload("ใบบันทึกเวลา")}
					>
						ใบบันทึกเวลา
					</p>
					<p
						className={`a-text`}
						onClick={() => handleDownload("ไฟล์นำเสนอ-pdf")}
					>
						ดูไฟล์นำเสนอ-pdf
					</p>
					<p
						className={`a-text`}
						onClick={() => handleDownload("ไฟล์นำเสนอ-ppt")}
					>
						ดูนำเสนอ-ppt
					</p> */}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowAllFileModal(false)}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default StdViewAllFile;
