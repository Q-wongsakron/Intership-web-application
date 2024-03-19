import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import customStyles from "../../components/dataTableCustomStyles";

import {
	employerList as getList,
	verifyEmployer,
} from "../../services/admin.service";

function EmployerList() {
	const navigate = useNavigate();

	const [msg, setMsg] = useState("");
	const [alertKey, setAlertKey] = useState(0);
	const [modalBody, setModalBody] = useState("");
	const [hideCompanyName, setHideCompanyName] = useState(false);
	const [hideCompanyAddress, setHideCompanyAddress] = useState(false);

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [sendData, setSendData] = useState({});

	const { user } = useSelector((state) => ({ ...state }));

	const showAlert = () => {
		setAlertKey((prevKey) => prevKey + 1);
	};

	const handleConfirmStatusChange = async () => {
		setShowModal(false);

		await verifyEmployer(user.user.token, sendData)
			.then((res) => {
				setMsg(
					`Employer ID ${sendData.employer_id}: status => ${sendData.status}`
				);
			})
			.catch((err) => {
				console.error("Failed to update user status", err);
			});
		//เเก้เเล้วให้มันเเสดงค่าปัจจุบัน
		setData((prevUsers) =>
			prevUsers.map((user, index) =>
				user.employer_id === sendData.employer_id
					? { ...user, status: sendData.status }
					: user
			)
		);

		showAlert(); //
	};

	const handleStatusChange = async (employer_id, newStatus, employer_name) => {
		setModalBody(employer_name);
		setShowModal(true);

		setSendData({
			employer_id: employer_id,
			status: newStatus,
		});
	};

	const loadData = async (authtoken) => {
		try {
			const response = await getList(authtoken);
			setData(response.data);
		} catch (err) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

	// const handleModalClose = () => {
	// 	setShowModal(false);
	// 	setShowDetailModalData(false);
	// };

	const [showDetailModalData, setShowDetailModalData] = useState({});
	const [showDetailModal, setShowDetailModal] = useState(false);
	const DetailModal = () => {
		return (
			<Modal
				show={showDetailModal}
				onHide={() => setShowDetailModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">รายละเอียด</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<p>
							ชื่อบริษัท/หน่วยงาน :{" "}
							<span className="fw-semibold">
								{showDetailModalData.company_name}
							</span>
						</p>
						<p>
							ที่อยู่ :{" "}
							<span className="fw-semibold">{showDetailModalData.address}</span>
						</p>
						<p>
							ชื่อผู้ติดต่อ :{" "}
							<span className="fw-semibold">
								{showDetailModalData.contact_name}
							</span>
						</p>
						<p>
							เบอร์ติดต่อ :{" "}
							<span className="fw-semibold">
								{showDetailModalData.contact_tel}
							</span>
						</p>
						<p>
							อีเมลติดต่อ :{" "}
							<span className="fw-semibold">
								{showDetailModalData.contact_email}
							</span>
						</p>
						<hr />
						<p>
							ชื่อผู้ใช้ :{" "}
							<span className="fw-semibold">
								{showDetailModalData.username}
							</span>
						</p>
						<p>
							สถานะ :{" "}
							<span
								className={`fw-semibold ${
									showDetailModalData.status === "verified"
										? "badge text-bg-success"
										: ""
								}`}
							>
								{showDetailModalData.status}
							</span>
						</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<button
						type="button"
						className={`${btn.btn_grey} m-1`}
						onClick={() => setShowDetailModal(false)}
					>
						ปิด
					</button>
				</Modal.Footer>
			</Modal>
		);
	};

	const [showModal, setShowModal] = useState(false);
	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ยืนยันการเปลี่ยนสถานะ</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>
						ยืนยันการเปลี่ยนสถานะของบริษัท/หน่วยงาน :{" "}
						<span className="fw-semibold">{modalBody}</span> เป็น{" "}
						<span
							className={`fw-semibold ${
								sendData.status === "verified" ? "text-success" : ""
							}`}
						>
							{sendData.status}
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
							handleConfirmStatusChange();
							navigate("/admin/employer-list");
						}}
					>
						ยืนยัน
					</button>
				</Modal.Footer>
			</Modal>
		);
	};

	const employerData = data.map(
		({
			employer_id,
			company_name,
			address,
			contact_name,
			contact_email,
			contact_tel,
			username,
			status,
		}) => ({
			id: employer_id,
			employer_id,
			company_name,
			address,
			contact_name,
			contact_email,
			contact_tel,
			username,
			status,
			// actions: { employer_id: employer_id },
		})
	);

	const employerColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.employer_id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				// name: <p className="m-auto">ชื่อบริษัท/หน่วยงาน</p>,
				name: "ชื่อบริษัท/หน่วยงาน",
				selector: (row) => row.company_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<Link to={`/employer/${row.employer_id}/profile`}>
							{row.company_name}
						</Link>
						{/* <p className="m-auto text-wrap">{row.company_name}</p> */}
					</div>
				),
				omit: hideCompanyName,
			},
			{
				name: "ที่อยู่",
				selector: (row) => row.address,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.address}</p>
					</div>
				),
				omit: hideCompanyAddress,
			},
			{
				name: "ชื่อผู้ติดต่อ",
				selector: (row) => row.contact_name,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.contact_name}</p>
					</div>
				),
			},
			{
				name: "อีเมลติดต่อ",
				selector: (row) => row.contact_email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.contact_email}</p>
					</div>
				),
			},
			{
				name: "เบอร์ติดต่อ",
				selector: (row) => row.contact_tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.contact_tel}</p>
					</div>
				),
			},
			{
				name: "ชื่อผู้ใช้",
				selector: (row) => row.username,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="m-auto">{row.username}</p>
					</div>
				),
			},
			{
				name: "สถานะ",
				selector: (row) => row.status,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<select
						className={`form-select form-select-sm ${
							row.status === "verified" ? "text-success" : ""
						}`}
						value={row.status}
						onChange={(e) =>
							handleStatusChange(
								row.employer_id,
								e.target.value,
								row.company_name
							)
						}
						// style={{ minWidth: "7.5rem" }}
					>
						<option className="text-success" value="verified">
							verified
						</option>
						<option className="text-dark" value="notverify">
							notverify
						</option>
					</select>
				),
			},
			{
				// button: "true",
				cell: (row) => (
					<>
						<button
							className={`btn btn-sm btn-outline-secondary`}
							onClick={() => handleDetailBtnClick(row)}
						>
							<FontAwesomeIcon icon={faEye} />
						</button>
						<button
							className={`btn btn-sm btn-outline-success ms-2`}
							onClick={null}
						>
							<FontAwesomeIcon icon={faPenToSquare} />
						</button>
					</>
				),
				ignoreRowClick: true,
				// allowOverflow: true,
			},
		],
		[hideCompanyName, hideCompanyAddress]
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
	const filteredData = employerData.filter((item) => {
		if (selectedSearchField === "all") {
			return [
				"company_name",
				"address",
				"contact_name",
				"contact_email",
				"contact_tel",
				"username",
				"status",
			].some((field) =>
				item[field].toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			// ของเดิมที่เป็นแบบเลือกว่าจะค้นหา field ไหน
			return item[selectedSearchField]
				.trim()
				.toLowerCase()
				.includes(searchQuery.trim().toLowerCase());
		}
	});

	const handleSearchFieldChange = (e) => {
		const value = e.target.value;
		if (
			(value !== "status" && searchQuery === "verified") ||
			searchQuery === "notverify"
		) {
			setSearchQuery("");
		}
		setSelectedSearchField(value);
	};
	const handleSearchQuery = (e) => {
		setSearchQuery(e.target.value);
		// handleClearRows();
	};

	// อันนี้ใช้ค้นหาทั้งหมดตาม field ที่ระบุ
	// const [searchQuery, setSearchQuery] = useState("");
	// const filteredData = employerData.filter((item) =>
	// 	[
	// 		"company_name",
	// 		"address",
	// 		"contact_name",
	// 		"contact_email",
	// 		"contact_tel",
	// 		"username",
	// 		"status",
	// 	].some((field) =>
	// 		item[field].toLowerCase().includes(searchQuery.toLowerCase())
	// 	)
	// );

	const handleDetailBtnClick = (row) => {
		setShowDetailModalData({
			employer_id: row.employer_id,
			company_name: row.company_name,
			address: row.address,
			contact_name: row.contact_name,
			contact_tel: row.contact_tel,
			contact_email: row.contact_email,
			username: row.username,
			status: row.status,
		});
		setShowDetailModal(true);
	};

	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">บริษัท/หน่วยงาน</h3>
			</div>

			<div className="searchBox mb-3">
				<label className="form-label fw-bold" htmlFor="selectFilter">
					ค้นหาโดย :
				</label>
				<div className="input-group input-group-sm">
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
						<option value="company_name" label="ชื่อบริษัท/หน่วยงาน">
							ชื่อบริษัท/หน่วยงาน
						</option>
						<option value="address" label="ที่อยู่">
							ที่อยู่
						</option>
						<option value="status" label="สถานะ">
							สถานะ
						</option>
					</select>

					{selectedSearchField === "status" ? (
						<select
							className="form-select w-75"
							id="inputGroupSelect01"
							onChange={(e) => handleSearchQuery(e)}
						>
							<option defaultValue="choose">เลือกสถานะ</option>
							<option value="verified">verified</option>
							<option value="notverify">notverify</option>
						</select>
					) : (
						<input
							type="text"
							className="form-control w-75"
							placeholder="ค้นหา"
							value={searchQuery}
							onChange={(e) => handleSearchQuery(e)}
						/>
					)}
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
				// title="บริษัท/หน่วยงาน"
				columns={employerColumns}
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

			{filteredData.length !== 0 && (
				<div className="additionalTab mb-2 d-flex flex-column flex-md-row justify-content-start">
					<div>
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="checkbox"
								value=""
								id="hideCompanyName"
								onChange={() => setHideCompanyName(!hideCompanyName)}
							/>
							<label className="form-check-label" htmlFor="hideCompanyName">
								ซ่อนชื่อบริษัท/หน่วยงาน
							</label>
						</div>
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="checkbox"
								value=""
								id="hideAddress"
								onChange={() => setHideCompanyAddress(!hideCompanyAddress)}
							/>
							<label className="form-check-label" htmlFor="hideAddress">
								ซ่อนที่อยู่
							</label>
						</div>
					</div>
				</div>
			)}

			<ConfirmModal />
			<DetailModal />

			{msg ? <AlertBox key={alertKey} message={msg} duration={3000} /> : <></>}
		</div>
	);

	function ItemNotFound() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-50 text-muted bg-light container-card">
				<h5>ค้นหาไม่พบ</h5>
			</div>
		);
	}
}

export default EmployerList;
