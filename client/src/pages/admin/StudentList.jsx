import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPenToSquare,
	faXmark,
	faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";
import axios from "axios";

function StudentList() {
	const navigate = useNavigate();

	const [msg, setMsg] = useState("");
	const [alertKey, setAlertKey] = useState(0);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [sendData, setSendData] = useState({});

	const user = useSelector((state) => state.user);

	const showAlert = () => {
		setAlertKey((prevKey) => prevKey + 1);
	};

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/listStudent"
			);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleResetBtnClick = (displayname_th, std_id) => {
		setSelectedStudent({
			displayname_th: displayname_th,
			std_id: std_id,
		});
		setShowModal(true);
	};
	const handleConfirmReset = async (displayname_th, std_id) => {
		console.log(std_id);
		try{
			const resetStudent = await axios.put(import.meta.env.VITE_APP_API + `/resetStudent`,{
				std_id
			})
			setMsg(`รีเซตผู้ใช้ : ${displayname_th} ${std_id}`);
			setShowModal(false);
			showAlert(); //
		}catch (error) {
			console.error("Error fetching data:", error);
		}

	};

	const [selectedStudent, setSelectedStudent] = useState({});
	const [showModal, setShowModal] = useState(false);
	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						ยืนยันการรีเซตผู้ใช้นักศึกษา
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						ยืนยันการรีเซตสถานะของนักศึกษา :{" "}
						<span className="fw-semibold">
							{selectedStudent.displayname_th} {selectedStudent.std_id}
						</span>{" "}
						หรือไม่ ?
					</p>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className={`${btn.btn_grey} m-1`}
						onClick={() => setShowModal(false)}
					>
						ยกเลิก
					</button>
					<button
						type="button"
						className={`btn btn-danger m-1`}
						onClick={() => {
							handleConfirmReset(
								selectedStudent.displayname_th,
								selectedStudent.std_id
							);
							navigate("/admin/student-list");
						}}
					>
						ยืนยัน
					</button>
				</Modal.Footer>
			</Modal>
		);
	};

	// STARTING REACT-DATA-TABLE-COMPONENT PART
	const [tableColOptions, setTableColOptions] = useState({
		displayname_th: {
			label: "ชื่อ-นามสกุล",
			is_hide: false,
		},
		std_id: {
			label: "เลขทะเบียน",
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
		status: {
			label: "สถานะ",
			is_hide: false,
		},
		std_eval: {
			label: "แบบประเมินนักศึกษา",
			is_hide: false,
		},
		emp_eval: {
			label: "แบบประเมินบริษัท",
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
	const studentData = data.map((item, index) => ({
		id: index,
		displayname_th:
			item.name_title_th === null
				? item.displayname_th
				: item.name_title_th + item.displayname_th,
		std_id: item.std_id,
		email: item.email,
		tel: item.tel !== null ? item.tel : null,
		status:
			item.status === "0"
				? "หาที่ฝึกงาน"
				: item.status === "1"
				? "รอการตอบรับ"
				: item.status === "2"
				? "รอเอกสารจากภาควิชา"
				: item.status === "3"
				? "ระหว่างฝึกงาน"
				: item.status === "4"
				? "เสร็จสิ้นการฝึกงาน"
				: "มีข้อผิดพลาด",
		std_eval: item.std_eval === 1 ? "ทำแบบประเมินแล้ว" : "ยังไม่ทำแบบประเมิน",
		emp_eval: item.emp_eval,
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
				name: <p className="mb-0">เลขทะเบียน</p>,
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
				name: "อีเมล",
				selector: (row) => row.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.email}</p>
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
						<p className="my-1">{row.tel !== null ? row.tel : "-"}</p>
					</div>
				),
				omit: tableColOptions.tel.is_hide,
			},
			{
				name: "สถานะ",
				selector: (row) => row.status,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						{row.status === "หาที่ฝึกงาน" ? (
							<p className="my-1">
								<span className={`text-danger`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								{row.status}
							</p>
						) : row.status === "รอการตอบรับ" ? (
							<p className="my-1">
								<span className={`text-danger`}>
									<FontAwesomeIcon icon={faCircleReg} />
								</span>{" "}
								{row.status}
							</p>
						) : row.status === "รอเอกสารจากภาควิชา" ? (
							<p className="my-1">
								<span className={`text-warning`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								{row.status}
							</p>
						) : row.status === "ระหว่างฝึกงาน" ? (
							<p className="my-1">
								<span className={`text-info`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								{row.status}
							</p>
						) : row.status === "เสร็จสิ้นการฝึกงาน" ? (
							<p className="my-1">
								<span className={`text-success`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								{row.status}
							</p>
						) : (
							<p className="my-1">มีข้อผิดพลาด</p>
						)}
					</div>
				),
				omit: tableColOptions.status.is_hide,
			},
			{
				name: <p className="mb-0">แบบประเมินนักศึกษา</p>,
				selector: (row) => row.std_eval,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.std_eval}</p>
					</div>
				),
				omit: tableColOptions.std_eval.is_hide,
			},
			{
				name: <p className="mb-0">แบบประเมินบริษัท</p>,
				selector: (row) => row.emp_eval,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.emp_eval}</p>
					</div>
				),
				omit: tableColOptions.emp_eval.is_hide,
			},
			{
				sortable: false,
				reorder: true,
				cell: (row) => (
					<button
						type="button"
						className={`btn btn-sm btn-outline-danger`}
						onClick={() => handleResetBtnClick(row.displayname_th, row.std_id)}
					>
						รีเซต
					</button>
				),
				omit: tableColOptions.actions.is_hide,
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
		const selectedRowData = selectedRows.map((item) => item.employer_id);
		setSelectedRows(selectedRowData);
	};

	// for table search
	const [selectedSearchField, setSelectedSearchField] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const filteredData = studentData.filter((item) => {
		if (selectedSearchField === "all") {
			return [
				"displayname_th",
				"std_id",
				"email",
				"tel",
				"status",
				"std_eval",
				"emp_eval",
			].some((field) =>
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
		setSelectedStatusOption("choose");
		setSelectedStdEvalOption("choose");
		setSelectedEmpEvalOption("choose");
	};

	const [selectedStatusOption, setSelectedStatusOption] = useState("choose");
	const [selectedStdEvalOption, setSelectedStdEvalOption] = useState("choose");
	const [selectedEmpEvalOption, setSelectedEmpEvalOption] = useState("choose");

	const handleSearchQuery = (e) => {
		const { name, value } = e.target;

		if (
			(name === "searchStatusSelect" && value === "เลือกสถานะ...") ||
			(name === "searchStdEvalSelect" && value === "เลือกสถานะการประเมิน...") ||
			(name === "searchEmpEvalSelect" && value === "เลือกสถานะการประเมิน...")
		) {
			setSearchQuery("");
		} else {
			setSearchQuery(value);
		}

		if (e.target.tagName.toLowerCase() === "select") {
			switch (selectedSearchField) {
				case "status":
					setSelectedStatusOption(value);
					break;
				case "std_eval":
					setSelectedStdEvalOption(value);
					break;
				case "emp_eval":
					setSelectedEmpEvalOption(value);
					break;
				default:
					break;
			}
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">รีเซตผู้ใช้ (นักศึกษา)</h3>
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
							.filter(([key]) => key !== "actions")
							.map(([key, val] = entry, index) => (
								<option key={index} value={key} label={val.label}>
									{val.label}
								</option>
							))}
					</select>

					{selectedSearchField === "status" ? (
						<select
							className="form-select w-75"
							id="searchStatusSelect"
							name="searchStatusSelect"
							value={selectedStatusOption}
							onChange={(e) => handleSearchQuery(e)}
						>
							<option defaultValue="choose">เลือกสถานะ...</option>
							<option value="หาที่ฝึกงาน">หาที่ฝึกงาน</option>
							<option value="รอการตอบรับ">รอการตอบรับ</option>
							<option value="รอเอกสารจากภาควิชา">รอเอกสารจากภาควิชา</option>
							<option value="ระหว่างฝึกงาน">ระหว่างฝึกงาน</option>
							<option value="เสร็จสิ้นการฝึกงาน">เสร็จสิ้นการฝึกงาน</option>
						</select>
					) : selectedSearchField === "std_eval" ? (
						<select
							className="form-select w-75"
							id="searchStdEvalSelect"
							name="searchStdEvalSelect"
							value={selectedStdEvalOption}
							onChange={(e) => handleSearchQuery(e)}
						>
							<option defaultValue="choose">เลือกสถานะการประเมิน...</option>
							<option value="ทำแบบประเมินแล้ว">ทำแบบประเมินแล้ว</option>
							<option value="ยังไม่ทำแบบประเมิน">ยังไม่ทำแบบประเมิน</option>
						</select>
					) : selectedSearchField === "emp_eval" ? (
						<select
							className="form-select w-75"
							id="searchEmpEvalSelect"
							name="searchEmpEvalSelect"
							value={selectedEmpEvalOption}
							onChange={(e) => handleSearchQuery(e)}
						>
							<option defaultValue="choose">เลือกสถานะการประเมิน...</option>
							<option value="รอบริษัทประเมิน">รอบริษัทประเมิน</option>
							<option value="ผ่าน">ผ่าน</option>
							<option value="ไม่ผ่าน">ไม่ผ่าน</option>
						</select>
					) : (
						<input
							type="search"
							className="form-control w-75"
							placeholder="ค้นหา..."
							value={searchQuery}
							onChange={(e) => handleSearchQuery(e)}
						/>
					)}
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
				defaultSortFieldId={3} // std_id column
				defaultSortAsc={true} // เรียงจากน้อยไปมาก
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

			<ConfirmModal />

			{msg ? <AlertBox key={alertKey} message={msg} duration={3000} /> : <></>}
		</div>
	);
}

export default StudentList;
