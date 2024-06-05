import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPenToSquare,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";

import { listAllUser, chaneRole } from "../../services/user.service";

const ManageUser = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [msg, setMsg] = useState("");
	const [alertKey, setAlertKey] = useState(0);

	const navigate = useNavigate();

	const [sendData, setSendData] = useState({});
	const [modalBody, setModalBody] = useState("");

	const user = useSelector((state) => state.user);

	const showAlert = () => {
		setAlertKey((prevKey) => prevKey + 1);
	};

	// useEffect(() => {
	// 	loadData(user.user.token);
	// }, [user.user.token]);

	// const loadData = async (authtoken) => {
	// 	//ดึง data user ใน model
	// 	await listAllUser(authtoken)
	// 		.then((res) => {
	// 			console.log(res.data);
	// 			setData(res.data);
	// 		})
	// 		.catch((err) => {
	// 			console.log(err);
	// 		});
	// };
	const loadData = async (authtoken) => {
		try {
			const response = await listAllUser(authtoken);
			setData(response.data);
			// console.log(response.data);
		} catch (err) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const role = ["employee", "head", "teacher", "secretary"];
	const handleConfirmChangeRole = async () => {
		// console.log(emp_tu_id, e.target.value);
		// const value = {
		// 	emp_tu_id: emp_tu_id,
		// 	role: e.target.value,
		// };
		setShowModal(false);
		await chaneRole(user.user.token, sendData)
			.then((res) => {
				setMsg(`ผู้ใช้ ${sendData.emp_tu_id}: Role => ${sendData.role}`);
				loadData(user.user.token);
			})
			.catch((err) => {
				console.log(err);
			});

		showAlert(); //
	};

	const handleChangeRole = async (emp_tu_id, e) => {
		setModalBody(emp_tu_id);
		setShowModal(true);

		setSendData({
			emp_tu_id: emp_tu_id,
			role: e.target.value,
		});
	};

	const [showModal, setShowModal] = useState(false);
	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ยืนยันการเปลี่ยน Role</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						ยืนยันการเปลี่ยน Role ของผู้ใช้ :{" "}
						<span className="fw-semibold">{modalBody}</span> เป็น{" "}
						<span className={`fw-semibold text-light-blue`}>
							{sendData.role}
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
						className={`${btn.btn_blue} m-1`}
						onClick={() => {
							handleConfirmChangeRole();
							navigate("/admin/change-role");
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
			label: "ชื่อ",
			is_hide: false,
		},
		emp_tu_id: {
			label: "ชื่อผู้ใช้",
			is_hide: false,
		},
		email: {
			label: "อีเมล",
			is_hide: false,
		},
		department: {
			label: "ภาควิชา",
			is_hide: false,
		},
		role: {
			label: "Role",
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
	const applyData = data.map((item, index) => ({
		id: index,
		emp_tu_id: item.emp_tu_id,
		displayname_th: item.displayname_th,
		displayname_en: item.displayname_en,
		email: item.email,
		department: item.department,
		organization: item.organization,
		role: item.role,
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
				name: "ชื่อ",
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
				name: "ชื่อผู้ใช้",
				selector: (row) => row.emp_tu_id,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.emp_tu_id}</p>
					</div>
				),
				omit: tableColOptions.emp_tu_id.is_hide,
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
				name: "ภาควิชา",
				selector: (row) => row.department,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.department}</p>
					</div>
				),
				omit: tableColOptions.department.is_hide,
			},
			{
				name: "ROLE",
				selector: (row) => row.role,
				sortable: true,
				reorder: true,
				cell: (row) => (
					// <div>
					// 	<p className="my-1">{row.role}</p>
					// </div>
					<select
						onChange={(e) => handleChangeRole(row.emp_tu_id, e)}
						value={row.role}
						className="form-select form-select-sm"
						// style={{ width: "100px" }}
					>
						{role.map((roleItem) => (
							<option key={roleItem} value={roleItem}>
								{roleItem}
							</option>
						))}
					</select>
				),
				omit: tableColOptions.role.is_hide,
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
		"emp_tu_id",
		"displayname_th",
		"email",
		"department",
		"role",
	];
	const filteredData = applyData.filter((item) => {
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
		// if (value !== "role" && role.includes(searchQuery)) {
		// 	setSearchQuery("");
		// }
		setSelectedSearchField(value);
		setSearchQuery("");
	};
	const handleSearchQuery = (e) => {
		const { name, value } = e.target;
		// console.log("name & value: ", name, value);

		if (name === "searchRoleSelect" && value === "เลือก Role...") {
			setSearchQuery("");
		} else {
			setSearchQuery(value);
		}
	};

	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-3 p-sm-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">จัดการสิทธิ์ (บุคลากร)</h3>
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

						{selectedSearchField === "role" ? (
							<select
								className="form-select w-75"
								id="searchRoleSelect"
								name="searchRoleSelect"
								onChange={(e) => handleSearchQuery(e)}
							>
								<option defaultValue="choose">เลือก Role...</option>
								{role.map((roleItem) => (
									<option key={roleItem} value={roleItem}>
										{roleItem}
									</option>
								))}
								{/* <option defaultValue="choose">เลือก ROLE</option>
							<option value="verified">verified</option>
							<option value="notverify">notverify</option> */}
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

				<ConfirmModal />

				{msg ? (
					<AlertBox key={alertKey} message={msg} duration={3000} />
				) : (
					<></>
				)}

				{/* <div className="table-responsive text-nowrap">
					<table className="table table-striped">
						<thead>
							<tr className="table-dark">
								<th scope="col">#</th>
								<th scope="col">ชื่อผู้ใช้</th>
								<th scope="col">ROLE</th>
								<th scope="col">ACTION</th>
							</tr>
						</thead>
						<tbody>
							{data
								? data.map((item, index) => (
										<tr key={index}>
											<th scope="row">{index + 1}</th>
											<td>{item.emp_tu_id}</td>
											<td>{item.role}</td>
											<td>
												<select
													onChange={(e) => handleChangeRole(item.emp_tu_id, e)}
													value={item.role}
													className="form-select"
													style={{ width: "100px" }}
												>
													{role.map((roleItem) => (
														<option key={roleItem} value={roleItem}>
															{roleItem}
														</option>
													))}
												</select>
											</td>
										</tr>
								  ))
								: null}
						</tbody>
					</table>
					<Link to={"/admin"}>Back</Link>
				</div> */}
			</div>
		</>
	);
};

export default ManageUser;
