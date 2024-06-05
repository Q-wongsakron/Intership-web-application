import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPenToSquare,
	faXmark,
	faCircle,
	faUser,
	faPerson,
	faBuilding,
	faBarsProgress,
	faTableCellsLarge,
	faRectangleAd,
	faCircleCheck,
	faCheck,
	faTableList,
	faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import {
	faFile,
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
	faCircle as faCircleReg,
	faCircleCheck as faCircleCheckReg,
	faCircleXmark,
	faHourglass,
	faHourglassHalf,
} from "@fortawesome/free-regular-svg-icons";
import { Modal, Button } from "react-bootstrap";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import DataTable from "react-data-table-component";
import { customStyles } from "../../components/dataTableCustomStyles";
import NoTableData from "../../components/NoTableData";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { th } from "date-fns/locale";

function StudentMornitor() {
	const [data, setData] = useState([]);
	const [allStdDocs, setAllStdDocs] = useState([]);
	const [combinedData, setCombinedData] = useState([]);
	const [loading, setLoading] = useState(true);

	const [showAllFileModal, setShowAllFileModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState({});

	const user = useSelector((state) => state.user);

	// จัดการตัวดูไฟล์จะได้ไม่ต้องเขียนหลายฟังข์ชัน
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
					// console.log(File);
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

	//จัดการปุ่มดูไฟล์
	const handleSeeDocument = async (
		std_id,
		displayname_th,
		date_upload_docs
	) => {
		try {
			setSelectedStudent({
				...selectedStudent,
				id: std_id,
				displayname_th: displayname_th,
				date_upload_docs: date_upload_docs,
			});
			setShowAllFileModal(true);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
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
		company_name: {
			label: "บริษัท/หน่วยงาน",
			is_hide: false,
		},
		company_tel: {
			label: "เบอร์ติดต่อบริษัท",
			is_hide: false,
		},
		company_email: {
			label: "อีเมลติดต่อบริษัท",
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
		docs: {
			label: "เอกสาร",
			is_hide: false,
		},
		// actions: {
		// 	label: "ACTIONS",
		// 	is_hide: false,
		// },
	});
	//จัดการซ่อนคอรัม
	const handleHideColumn = (e) => {
		const { name, checked } = e.target;

		setTableColOptions({
			...tableColOptions,
			[name]: { ...tableColOptions[name], is_hide: checked },
		});
	};
	// จัดการ field ข้อมูล ที่จะนำไปใช้แสดงผล
	const studentData = combinedData.map((item, index) => ({
		id: index,
		displayname_th:
			item.name_title_th === null
				? item.displayname_th
				: item.name_title_th + item.displayname_th,
		std_id: item.std_id,
		email: item.email,
		tel:
			item.tel !== null
				? item.tel
				: item.self_enroll
				? item.self_enroll.tel
				: null,
		company_name: item.apply
			? item.apply.employer.company_name
			: item.confirm
			? item.confirm.employer?.company_name
			: item.self_enroll
			? item.self_enroll.company_name
			: null,
		company_tel: item.apply
			? item.apply.employer.contact_tel
			: item.confirm
			? item.confirm.employer?.contact_tel
			: item.self_enroll
			? item.self_enroll.tel
			: null,
		company_email: item.apply
			? item.apply.employer.contact_email
			: item.confirm
			? item.confirm.employer?.contact_email
			: item.self_enroll
			? item.self_enroll.email
			: null,
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
		date_upload_docs: {
			date_upload_report_pdf: item.date_upload_report_pdf,
			date_upload_report_docx: item.date_upload_report_docx,
			date_upload_timestamp_pdf: item.date_upload_timestamp_pdf,
			date_upload_present_pdf: item.date_upload_present_pdf,
			date_upload_present_ppt: item.date_upload_present_ppt,
		},
	}));
	// useMemo
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
				name: <p className="mb-0">เบอร์ติดต่อบริษัท</p>,
				selector: (row) => row.company_tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.company_tel}</p>
					</div>
				),
				omit: tableColOptions.company_tel.is_hide,
			},
			{
				name: <p className="mb-0">อีเมลติดต่อบริษัท</p>,
				selector: (row) => row.company_email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.company_email}</p>
					</div>
				),
				omit: tableColOptions.company_email.is_hide,
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
								{/* <span className={`text-my-purple`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								{row.status} */}
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
				name: "เอกสาร",
				selector: (row) => row.docs,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<button
						type="button"
						className={`btn btn-sm btn-outline-secondary`}
						onClick={() =>
							handleSeeDocument(
								row.std_id,
								row.displayname_th,
								row.date_upload_docs
							)
						}
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
		"email",
		"tel",
		"company_name",
		"company_tel",
		"company_email",
		"status",
		"std_eval",
		"emp_eval",
	];
	const filteredData = studentData.filter((item) => {
		if (selectedSearchField === "all") {
			return fieldsToSearch.some((field) =>
				typeof item[field] === "number" // std_eval -.-
					? item[field] === 1
						? "ทำแบบประเมินแล้ว"
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						: "ยังไม่ทำแบบประเมิน"
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
					: item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
			);
		} else {
			let toStr = "";
			if (selectedSearchField === "std_eval") {
				const intStdEval = item[selectedSearchField];
				if (intStdEval === 1) {
					toStr = "ทำแบบประเมินแล้ว";
				} else {
					toStr = "ยังไม่ทำแบบประเมิน";
				}
				return toStr?.toLowerCase().includes(searchQuery.trim().toLowerCase());
			}
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

	const formatDate = (dateString) => {
		if (dateString === null || dateString === undefined) {
			return "ยังไม่มีข้อมูล";
		} else {
			const date = new Date(dateString);
			return format(date, "วันที่อัปโหลด dd/MM/yyyy เวลา HH:mm:ss น.", {
				locale: th,
			});
		}
	};

	const [isProgressBar, setIsProgressBar] = useState(false);
	const toggleProgressBar = () => {
		setIsProgressBar(!isProgressBar);
	};

	const [isFullDocsTable, setIsFullDocsTable] = useState(false);
	const toggleFullDocsTable = () => {
		setIsFullDocsTable(!isFullDocsTable);
	};

	useEffect(() => {
		setLoading(true);

		const fetchData = async () => {
			try {
				const response = await axios.get(
					import.meta.env.VITE_APP_API + "/studentMornitor"
				);
				setData(response.data);

				const resAllDocStd = await axios.get(
					import.meta.env.VITE_APP_API + "/getAllDocStudent"
				);
				setAllStdDocs(resAllDocStd.data);

				const allKeys = new Set(
					resAllDocStd.data.flatMap((doc) => Object.keys(doc))
				);
				const combinedStdData = response.data.map((student) => {
					const matchingDoc =
						resAllDocStd.data.find((doc) => doc.std_id === student.std_id) ||
						{};

					for (const key of allKeys) {
						if (!student.hasOwnProperty(key)) {
							student[key] = matchingDoc[key] || null;
						}
					}

					return { ...student, ...matchingDoc };
				});
				console.log(combinedStdData);
				setCombinedData(combinedStdData);
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
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between">
					<h3 className="fw-bold mb-auto">
						สรุปสถานะนักศึกษา (ทั้งหมด {studentData.length} คน)
					</h3>
				</div>

				<hr className="hr-grey" />

				<div className="d-flex justify-content-between mb-2">
					<h5 className="fw-bold text-my-purple">สถานะการฝึกงาน</h5>
					<div className="btn-group" role="group">
						<button
							type="button"
							className={`btn btn-sm ${
								isProgressBar ? "btn-outline-dark" : "btn-dark"
							}`}
							onClick={toggleProgressBar}
						>
							<FontAwesomeIcon icon={faTableCellsLarge} />
						</button>
						<button
							type="button"
							className={`btn btn-sm ${
								!isProgressBar ? "btn-outline-dark" : "btn-dark"
							}`}
							onClick={toggleProgressBar}
						>
							<FontAwesomeIcon icon={faBarsProgress} />
						</button>
					</div>
				</div>
				<StatCard studentData={studentData} isProgressBar={isProgressBar} />

				<hr className="hr-grey" />

				<div className="d-flex justify-content-between mb-2">
					<h5 className="fw-bold text-my-purple">การส่งไฟล์เอกสาร</h5>
					<div className="btn-group" role="group">
						<button
							type="button"
							className={`btn btn-sm ${
								isFullDocsTable ? "btn-outline-dark" : "btn-dark"
							}`}
							onClick={toggleFullDocsTable}
						>
							<FontAwesomeIcon icon={faTableList} />
						</button>
						<button
							type="button"
							className={`btn btn-sm ${
								!isFullDocsTable ? "btn-outline-dark" : "btn-dark"
							}`}
							onClick={toggleFullDocsTable}
						>
							<FontAwesomeIcon icon={faTableCells} />
						</button>
					</div>
				</div>
				<StdDocsTable
					allStdDocs={allStdDocs}
					stdDataLength={studentData.length}
					combinedStdData={combinedData}
					isFulltable={isFullDocsTable}
				/>

				<hr className="hr-grey" />

				<div className="d-flex justify-content-between mb-2">
					<h5 className="fw-bold text-my-purple">การทำแบบประเมิน</h5>
				</div>
				<ProgressBarV1
					studentData={studentData}
					allStatuses={["ทำแบบประเมินแล้ว", "ยังไม่ทำแบบประเมิน"]}
				/>
				<ProgressBarV2
					studentData={studentData}
					allStatuses={["รอบริษัทประเมิน", "ผ่าน", "ไม่ผ่าน"]}
				/>
			</div>

			<div className="container p-3 p-md-4 mt-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">
						สถานะนักศึกษารายบุคคล (ทั้งหมด {studentData.length} คน)
					</h3>
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
								.filter(([key]) => key !== "actions" && key !== "docs")
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
					defaultSortFieldId={3}
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

				{isProgressBar && (
					<>
						<div className="d-flex flex-wrap flex-lg-nowrap justify-content-start">
							<p className={`border border-danger rounded p-1 ms-3`}>
								<span className={`text-danger`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								หาที่ฝึกงาน
							</p>
							<p className={`border border-warning rounded p-1 ms-3`}>
								<span className={`text-warning`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								รอเอกสารจากภาควิชา
							</p>
							<p className={`border border-info rounded p-1 ms-3`}>
								<span className={`text-info`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								ระหว่างฝึกงาน
							</p>
							<p className={`border border-success rounded p-1 ms-3`}>
								<span className={`text-success`}>
									<FontAwesomeIcon icon={faCircle} />
								</span>{" "}
								เสร็จสิ้นการฝึกงาน
							</p>
						</div>
					</>
				)}

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
							<th scope="col">สถานะ</th>
							<th scope="col">เอกสาร</th>
							<th scope="col">แบบประเมินนักศึกษา</th>
							<th scope="col">แบบประเมินบริษัท</th>
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

								{item.status == "0" ? (
									<td>หาที่ฝึกงาน</td>
								) : item.status == "1" ? (
									<td>รอการตอบรับ</td>
								) : item.status == "2" ? (
									<td>รอเอกสารจากภาควิชา</td>
								) : item.status == "3" ? (
									<td>ระหว่างฝึกงาน</td>
								) : item.status == "4" ? (
									<td>เสร็จสิ้นการฝึกงาน</td>
								) : (
									<td>Error</td>
								)}
								<td>
									<button
										type="button"
										className={`btn btn-sm btn-outline-dark`}
										onClick={() =>
											handleSeeDocument(item.std_id, item.displayname_th)
										}
									>
										<FontAwesomeIcon icon={faEye} />
									</button>
								</td>

								{item.std_eval == "1" ? (
									<td>ทำแบบประเมินแล้ว</td>
								) : (
									<td>ยังไม่ทำแบบประเมิน</td>
								)}

								{item.emp_eval == "รอบริษัทประเมิน" ? (
									<td>รอบริษัทประเมิน</td>
								) : (
									<td>{item.emp_eval}</td>
								)}
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
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									หนังสือขอความอนุเคราะห์
								</span>
							</li>
							<li className="list-group-item my-1">
								<span
									className="a-text"
									onClick={() => handleDownload("หนังสือส่งตัว")}
								>
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									หนังสือส่งตัว
								</span>
							</li>
							<li className="list-group-item my-1">
								<p
									className={`mb-0 ${
										selectedStudent?.date_upload_docs?.date_upload_report_pdf
											? "a-text"
											: ""
									}`}
									onClick={() =>
										selectedStudent?.date_upload_docs?.date_upload_report_pdf
											? handleDownload("รายงาน-pdf")
											: null
									}
								>
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									รายงาน (.pdf)
								</p>
								<small className="text-muted">
									{formatDate(
										selectedStudent?.date_upload_docs?.date_upload_report_pdf
									)}
								</small>
							</li>
							<li className="list-group-item my-1">
								<p
									className={`mb-0 ${
										selectedStudent?.date_upload_docs?.date_upload_report_docx
											? "a-text"
											: ""
									}`}
									onClick={() =>
										selectedStudent?.date_upload_docs?.date_upload_report_docx
											? handleDownload("รายงาน-docx")
											: null
									}
								>
									<FontAwesomeIcon
										icon={faFileWord}
										className="docx-file-color"
									/>{" "}
									รายงาน (.docx)
								</p>
								<small className="text-muted">
									{formatDate(
										selectedStudent?.date_upload_docs?.date_upload_report_docx
									)}
								</small>
							</li>
							<li className="list-group-item my-1">
								<p
									className={`mb-0 ${
										selectedStudent?.date_upload_docs?.date_upload_timestamp_pdf
											? "a-text"
											: ""
									}`}
									onClick={() =>
										selectedStudent?.date_upload_docs?.date_upload_timestamp_pdf
											? handleDownload("ใบบันทึกเวลา")
											: null
									}
								>
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									ใบบันทึกเวลา
								</p>
								<small className="text-muted">
									{formatDate(
										selectedStudent?.date_upload_docs?.date_upload_timestamp_pdf
									)}
								</small>
							</li>
							<li className="list-group-item my-1">
								<p
									className={`mb-0 ${
										selectedStudent?.date_upload_docs?.date_upload_present_pdf
											? "a-text"
											: ""
									}`}
									onClick={() =>
										selectedStudent?.date_upload_docs?.date_upload_present_pdf
											? handleDownload("ไฟล์นำเสนอ-pdf")
											: null
									}
								>
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									ไฟล์นำเสนอ (.pdf)
								</p>
								<small className="text-muted">
									{formatDate(
										selectedStudent?.date_upload_docs?.date_upload_present_pdf
									)}
								</small>
							</li>
							<li className="list-group-item my-1">
								<p
									className={`mb-0 ${
										selectedStudent?.date_upload_docs?.date_upload_present_ppt
											? "a-text"
											: ""
									}`}
									onClick={() =>
										selectedStudent?.date_upload_docs?.date_upload_present_ppt
											? handleDownload("ไฟล์นำเสนอ-pptx")
											: null
									}
								>
									<FontAwesomeIcon
										icon={faFilePowerpoint}
										className="pptx-file-color"
									/>{" "}
									ไฟล์นำเสนอ (.pptx)
								</p>
								<small className="text-muted">
									{formatDate(
										selectedStudent?.date_upload_docs?.date_upload_present_ppt
									)}
								</small>
							</li>
						</ul>
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
		</>
	);
}

function StatCard({ studentData, isProgressBar }) {
	let allStatuses = [
		"หาที่ฝึกงาน",
		"รอการตอบรับ",
		"รอเอกสารจากภาควิชา",
		"ระหว่างฝึกงาน",
		"เสร็จสิ้นการฝึกงาน",
	];
	let statusCount = allStatuses.reduce((acc, status, index) => {
		acc["s" + index] = studentData.filter(
			(item) => item.status === status
		).length;
		return acc;
	}, {});

	//// test data
	// const s0 = 2;
	// const s1 = 0;
	// const s2 = 1;
	// const s3 = 22;
	// const s4 = 5;
	// const s0 = 30;
	// const s1 = 0;
	// const s2 = 0;
	// const s3 = 0;
	// const s4 = 0;
	//// test data

	const s0 = statusCount.s0;
	const s1 = statusCount.s1;
	const s2 = statusCount.s2;
	const s3 = statusCount.s3;
	const s4 = statusCount.s4;

	// const total = s0 + s1 + s2 + s3 + s4;
	const total = studentData.length;
	const s0s1 = s0 + s1;
	const s0s1Percent = ((s0s1 / total) * 100).toFixed(2);
	const s2Percent = ((s2 / total) * 100).toFixed(2);
	const s3Percent = ((s3 / total) * 100).toFixed(2);
	const s4Percent = ((s4 / total) * 100).toFixed(2);

	return (
		<>
			{isProgressBar ? (
				<div className="w-100 mt-3">
					<div className="d-flex flex-column flex-sm-row justify-content-between">
						<h6 className="fw-bold mb-0">
							<FontAwesomeIcon icon={faBarsProgress} /> สถานะนักศึกษา
						</h6>
						<small className="mb-0 text-muted fw-semibold">
							ทั้งหมด {total} คน
						</small>
					</div>
					<div className="progress" style={{ height: "30px" }}>
						<div
							className="progress-bar bg-danger"
							role="progressbar"
							style={{ width: `${s0s1Percent}%` }}
							aria-valuenow={s0s1Percent}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<span>
								{/* {allStatuses[0]} ({s0s1Percent} %) */}
								{/* {s0s1Percent} % */}
								{s0s1} (
								{s0s1Percent % 1 === 0 ? parseInt(s0s1Percent) : s0s1Percent} %)
							</span>
						</div>
						<div
							className="progress-bar bg-warning"
							role="progressbar"
							style={{ width: `${s2Percent}%` }}
							aria-valuenow={s2Percent}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<span>
								{/* {allStatuses[2]} ({s2Percent} %) */}
								{/* {s2Percent} % */}
								{s2} ({s2Percent % 1 === 0 ? parseInt(s2Percent) : s2Percent} %)
							</span>
						</div>
						<div
							className="progress-bar bg-info"
							role="progressbar"
							style={{ width: `${s3Percent}%` }}
							aria-valuenow={s3Percent}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<span>
								{/* {allStatuses[3]} ({s3Percent} %) */}
								{/* {s3Percent} % */}
								{s3} ({s3Percent % 1 === 0 ? parseInt(s3Percent) : s3Percent} %)
							</span>
						</div>
						<div
							className="progress-bar bg-success"
							role="progressbar"
							style={{ width: `${s4Percent}%` }}
							aria-valuenow={s4Percent}
							aria-valuemin="0"
							aria-valuemax="100"
						>
							<span>
								{/* {allStatuses[4]} ({s4Percent} %) */}
								{/* {s4Percent} % */}
								{s4} ({s4Percent % 1 === 0 ? parseInt(s4Percent) : s4Percent} %)
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className="row g-3 gy-lg-0 mt-4">
					<div className="col-6 col-sm-6 col-lg-3">
						<div className="stat-card-container container-card" onClick={null}>
							<div className="stat-card-title bg-gradient bg-danger rounded-top p-2">
								<h6 className="fw-bold mb-0">
									<span className={`text-white`}>หาที่ฝึกงาน</span>{" "}
								</h6>
							</div>
							<div className="stat-card-body d-flex justify-content-end border-bottom border-danger border-3 rounded-bottom p-3">
								<h4 className="fw-bold mb-0">{s0 + s1} คน</h4>
							</div>
						</div>
					</div>
					<div className="col-6 col-sm-6 col-lg-3">
						<div className="stat-card-container container-card" onClick={null}>
							<div className="stat-card-title bg-gradient bg-warning rounded-top p-2">
								<h6 className="fw-bold mb-0">
									<span className={`text-white`}>รอเอกสารจากภาควิชา</span>{" "}
								</h6>
							</div>
							<div className="stat-card-body d-flex justify-content-end border-bottom border-warning border-3 rounded-bottom p-3">
								<h4 className="fw-bold mb-0">{s2} คน</h4>
							</div>
						</div>
					</div>
					<div className="col-6 col-sm-6 col-lg-3">
						<div className="stat-card-container container-card" onClick={null}>
							<div className="stat-card-title bg-gradient bg-info rounded-top p-2">
								{/* <div className="stat-card-title bg-gradient bg-my-purple rounded-top p-2"> */}
								<h6 className="fw-bold mb-0">
									<span className={`text-white`}>ระหว่างฝึกงาน</span>{" "}
								</h6>
							</div>
							<div className="stat-card-body d-flex justify-content-end border-bottom border-info border-3 rounded-bottom p-3">
								{/* <div className="stat-card-body d-flex justify-content-end border-my-purple border-3 rounded-bottom p-3"> */}
								<h4 className="fw-bold mb-0">{s3} คน</h4>
							</div>
						</div>
					</div>
					<div className="col-6 col-sm-6 col-lg-3">
						<div className="stat-card-container container-card" onClick={null}>
							<div className="stat-card-title bg-gradient bg-success rounded-top p-2">
								<h6 className="fw-bold mb-0">
									<span className={`text-white`}>เสร็จสิ้นการฝึกงาน</span>{" "}
								</h6>
							</div>
							<div className="stat-card-body d-flex justify-content-end border-bottom border-success border-3 rounded-bottom p-3">
								<h4 className="fw-bold mb-0">{s4} คน</h4>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function ProgressBarV1({ studentData, allStatuses }) {
	// let allStatuses = ["ทำแบบประเมินแล้ว", "ยังไม่ทำแบบประเมิน"];
	let statusCount = allStatuses.reduce((acc, std_eval, index) => {
		acc["s" + index] = studentData.filter(
			(item) => item.std_eval === std_eval
		).length;
		return acc;
	}, {});

	//// test data
	// const s0 = 21;
	// const s1 = 9;

	const s0 = statusCount.s0;
	const s1 = statusCount.s1;

	// const total = s0 + s1;
	const total = studentData.length;
	const progress = ((s0 / total) * 100).toFixed(2);
	const s1Percent = ((s1 / total) * 100).toFixed(2);

	return (
		<div className="w-100 mt-3">
			<div className="d-flex flex-column flex-sm-row justify-content-between">
				<h6 className="fw-bold mb-0">
					<FontAwesomeIcon icon={faUser} /> จำนวนนักศึกษาทำแบบประเมินบริษัท
				</h6>
				<small className="mb-0 text-muted fw-semibold">
					{s0} จากทั้งหมด {total}
				</small>
			</div>
			<div className="progress" style={{ height: "30px" }}>
				<div
					className="progress-bar"
					role="progressbar"
					// style={{ width: `${progress}%`, background: "#37BF6D" }}
					style={{ width: `${progress}%`, background: "#686bff" }}
					// style={{ width: `${progress}%`, background: "#06b4e4" }}
					// style={{ width: `${progress}%`, background: "#0dcaf0" }}
					aria-valuenow={progress}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<span>
						<FontAwesomeIcon icon={faCircleCheckReg} /> ทำแบบประเมินแล้ว (
						{progress % 1 === 0 ? parseInt(progress) : progress} %)
					</span>
				</div>
				{s0 === 0 && (
					<div
						className="progress-bar bg-light"
						role="progressbar"
						style={{ width: `${s1Percent}%` }}
						aria-valuenow={s1Percent}
						aria-valuemin="0"
						aria-valuemax="100"
					>
						<span className="text-muted">
							<FontAwesomeIcon icon={faHourglassHalf} /> ยังไม่ทำแบบประเมิน
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

const ProgressBarV2 = ({ studentData, allStatuses }) => {
	let statusCount = allStatuses.reduce((acc, emp_eval, index) => {
		acc["status_" + index] = studentData.filter(
			(item) => item.emp_eval === emp_eval
		).length;
		return acc;
	}, {});

	//// test data
	// const wait = 12;
	// const pass = 16;
	// const notPass = 2;

	const wait = statusCount.status_0;
	const pass = statusCount.status_1;
	const notPass = statusCount.status_2;

	// const total = wait + pass + notPass;
	const total = studentData.length;
	const evaluated = pass + notPass;
	const evaluatedPercent = ((evaluated / total) * 100).toFixed(2);
	const waitPercent = ((wait / total) * 100).toFixed(2);
	const passPercent = ((pass / total) * 100).toFixed(2);
	const notPassPercent = ((notPass / total) * 100).toFixed(2);

	return (
		<div className="w-100 mt-3">
			<div className="d-flex flex-column flex-sm-row justify-content-between">
				<h6 className="fw-bold mb-0">
					<FontAwesomeIcon icon={faBuilding} /> จำนวนบริษัททำแบบประเมินนักศึกษา
				</h6>
				<small className="mb-0 text-muted fw-semibold">
					{evaluated} จากทั้งหมด {total}{" "}
					{evaluated !== 0 && `(ผ่าน ${pass} คน, ไม่ผ่าน ${notPass} คน)`}
				</small>
			</div>
			<div className="progress" style={{ height: "30px" }}>
				<div
					className="progress-bar"
					role="progressbar"
					// style={{ width: `${passPercent}%`, background: "#37BF6D" }}
					style={{ width: `${passPercent}%`, background: "#686bff" }}
					// style={{ width: `${passPercent}%`, background: "#06b4e4" }}
					// style={{ width: `${passPercent}%`, background: "#0dcaf0" }}
					aria-valuenow={passPercent}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<span>
						<FontAwesomeIcon icon={faCircleCheckReg} /> ผ่าน (
						{passPercent % 1 === 0 ? parseInt(passPercent) : passPercent} %)
					</span>
				</div>
				<div
					className="progress-bar"
					role="progressbar"
					// style={{ width: `${notPassPercent}%`, background: "#D55151" }}
					// style={{ width: `${notPassPercent}%`, background: "#8DC4A2" }}
					style={{ width: `${notPassPercent}%`, background: "#8A8DFD" }}
					// style={{ width: `${notPassPercent}%`, background: "#71C7DF" }}
					// style={{ width: `${notPassPercent}%`, background: "#82E0F3" }}
					aria-valuenow={notPassPercent}
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<span>
						<FontAwesomeIcon icon={faCircleXmark} /> ไม่ผ่าน (
						{notPassPercent % 1 === 0
							? parseInt(notPassPercent)
							: notPassPercent}{" "}
						%)
					</span>
				</div>
				{evaluated === 0 && (
					<div
						className="progress-bar bg-light"
						role="progressbar"
						style={{ width: `${waitPercent}%` }}
						aria-valuenow={waitPercent}
						aria-valuemin="0"
						aria-valuemax="100"
					>
						<span className="text-muted">
							<FontAwesomeIcon icon={faHourglassHalf} /> รอบริษัทประเมิน
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

//////////////////////////
//// DOCS STAT TABLE ////
/////////////////////////

function StdDocsTable({
	allStdDocs,
	stdDataLength,
	combinedStdData,
	isFulltable,
}) {
	const fieldNamesMapping = {
		present_pdf: "ไฟล์นำเสนอ (.pdf)",
		present_ppt: "ไฟล์นำเสนอ (.pptx)",
		report_docx: "รายงาน (.docx)",
		report_pdf: "รายงาน (.pdf)",
		timestamp_pdf: "ใบบันทึกเวลา (.pdf)",
	};

	const countUploadedFilesOfAllStudents = (students) => {
		const fileFields = [
			"present_pdf",
			"present_ppt",
			"report_docx",
			"report_pdf",
			"timestamp_pdf",
		];
		const file_counts = {};

		fileFields.forEach((field) => {
			file_counts[field] = 0;
		});

		students.forEach((student) => {
			fileFields.forEach((field) => {
				if (student[field] !== null) {
					file_counts[field]++;
				}
			});
		});

		return file_counts;
	};

	///////////////////////////////////////////////
	// STARTING REACT-DATA-TABLE-COMPONENT PART //
	/////////////////////////////////////////////
	const [tableColOptions, setTableColOptions] = useState({
		file: {
			label: "ไฟล์เอกสาร",
			is_hide: false,
		},
		count: {
			label: "จำนวนคนที่ส่ง/นักศึกษาทั้งหมด",
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

	const fileCounts = countUploadedFilesOfAllStudents(allStdDocs);
	const allStdDocsData = Object.entries(fileCounts).map(
		([field, count], index) => ({
			id: index,
			field: fieldNamesMapping[field],
			count,
		})
	);
	const allStdDocsColumns = useMemo(
		() => [
			{
				name: "id",
				selector: (row) => row.id,
				sortable: true,
				reorder: true,
				omit: true,
			},
			{
				name: <p className="mb-0">ไฟล์เอกสาร</p>,
				selector: (row) => row.field,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.field}</p>
					</div>
				),
				omit: tableColOptions.file.is_hide,
			},
			{
				name: <p className="mb-0">จำนวนคนที่ส่ง/นักศึกษาทั้งหมด</p>,
				selector: (row) => row.count,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">
							{row.count}/{stdDataLength}
						</p>
					</div>
				),
				omit: tableColOptions.count.is_hide,
			},
		],
		[tableColOptions]
	);

	///////////////////////////////////////////////
	// STARTING REACT-DATA-TABLE-COMPONENT PART //
	/////////////////////////////////////////////
	const [tableColOptions2, setTableColOptions2] = useState({
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
			is_hide: true,
		},
		tel: {
			label: "เบอร์โทร",
			is_hide: true,
		},
		date_upload_report_pdf: {
			label: "รายงาน (.pdf)",
			is_hide: false,
		},
		date_upload_report_docx: {
			label: "รายงาน (.docx)",
			is_hide: false,
		},
		date_upload_timestamp_pdf: {
			label: "ใบบันทึกเวลา (.pdf)",
			is_hide: false,
		},
		date_upload_present_pdf: {
			label: "ไฟล์นำเสนอ (.pdf)",
			is_hide: false,
		},
		date_upload_present_ppt: {
			label: "ไฟล์นำเสนอ (.pptx)",
			is_hide: false,
		},
	});
	const handleHideColumn2 = (e) => {
		const { name, checked } = e.target;

		setTableColOptions2({
			...tableColOptions2,
			[name]: { ...tableColOptions2[name], is_hide: checked },
		});
	};

	const allStdDocsData2 = combinedStdData.map((item, index) => ({
		id: index,
		displayname_th:
			item.name_title_th === null
				? item.displayname_th
				: item.name_title_th + item.displayname_th,
		std_id: item.std_id,
		email: item.email,
		tel: item.tel !== null ? item.tel : item.self_enroll?.tel,
		date_upload_report_pdf: item.date_upload_report_pdf,
		date_upload_report_docx: item.date_upload_report_docx,
		date_upload_timestamp_pdf: item.date_upload_timestamp_pdf,
		date_upload_present_pdf: item.date_upload_present_pdf,
		date_upload_present_ppt: item.date_upload_present_ppt,
	}));
	const allStdDocsColumns2 = useMemo(
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
				omit: tableColOptions2.displayname_th.is_hide,
			},
			{
				name: <p className="mb-0">เลขทะเบียน</p>,
				selector: (row) => row.std_id,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap">
						<p className="my-1">{row.std_id}</p>
					</div>
				),
				omit: tableColOptions2.std_id.is_hide,
			},
			{
				name: <p className="mb-0">อีเมล</p>,
				selector: (row) => row.email,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.email}</p>
					</div>
				),
				omit: tableColOptions2.email.is_hide,
			},
			{
				name: <p className="mb-0">เบอร์โทร</p>,
				selector: (row) => row.tel,
				sortable: true,
				reorder: true,
				cell: (row) => (
					<div>
						<p className="my-1">{row.tel}</p>
					</div>
				),
				omit: tableColOptions2.tel.is_hide,
			},
			{
				name: <p className="mb-0">รายงาน (.pdf)</p>,
				selector: (row) => row.date_upload_report_pdf,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap" title="วันและเวลาที่อัปโหลดไฟล์">
						<p className="my-1">{formatDate(row.date_upload_report_pdf)}</p>
						<p className="my-1">{formatTime(row.date_upload_report_pdf)}</p>
					</div>
				),
				omit: tableColOptions2.date_upload_report_pdf.is_hide,
			},
			{
				name: <p className="mb-0">รายงาน (.docx)</p>,
				selector: (row) => row.date_upload_report_docx,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap" title="วันและเวลาที่อัปโหลดไฟล์">
						<p className="my-1">{formatDate(row.date_upload_report_docx)}</p>
						<p className="my-1">{formatTime(row.date_upload_report_docx)}</p>
					</div>
				),
				omit: tableColOptions2.date_upload_report_docx.is_hide,
			},
			{
				name: <p className="mb-0">ใบบันทึกเวลา (.pdf)</p>,
				selector: (row) => row.date_upload_timestamp_pdf,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap" title="วันและเวลาที่อัปโหลดไฟล์">
						<p className="my-1">{formatDate(row.date_upload_timestamp_pdf)}</p>
						<p className="my-1">{formatTime(row.date_upload_timestamp_pdf)}</p>
					</div>
				),
				omit: tableColOptions2.date_upload_timestamp_pdf.is_hide,
			},
			{
				name: <p className="mb-0">ไฟล์นำเสนอ (.pdf)</p>,
				selector: (row) => row.date_upload_present_pdf,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap" title="วันและเวลาที่อัปโหลดไฟล์">
						<p className="my-1">{formatDate(row.date_upload_present_pdf)}</p>
						<p className="my-1">{formatTime(row.date_upload_present_pdf)}</p>
					</div>
				),
				omit: tableColOptions2.date_upload_present_pdf.is_hide,
			},
			{
				name: <p className="mb-0">ไฟล์นำเสนอ (.pptx)</p>,
				selector: (row) => row.date_upload_present_ppt,
				sortable: false,
				reorder: true,
				cell: (row) => (
					<div className="text-nowrap" title="วันและเวลาที่อัปโหลดไฟล์">
						<p className="my-1">{formatDate(row.date_upload_present_ppt)}</p>
						<p className="my-1">{formatTime(row.date_upload_present_ppt)}</p>
					</div>
				),
				omit: tableColOptions2.date_upload_present_ppt.is_hide,
			},
		],
		[tableColOptions2]
	);

	const formatDate = (dateString) => {
		if (dateString === null || dateString === undefined) {
			return "-";
		} else {
			const date = new Date(dateString);
			return format(date, "dd/MM/yyyy", {
				locale: th,
			});
		}
	};
	const formatTime = (dateString) => {
		if (dateString === null || dateString === undefined) {
			return "";
		} else {
			const date = new Date(dateString);
			return format(date, "(HH:mm:ss น.)", {
				locale: th,
			});
		}
	};

	const customStylesX = {
		headCells: {
			style: {
				// background: "#8A8DFD",
				// color: "white",
				fontSize: "0.875rem",
				fontWeight: "600",
				letterSpacing: "0.025rem",
			},
		},
	};

	return (
		<>
			{!isFulltable ? (
				<DataTable
					columns={allStdDocsColumns}
					data={allStdDocsData}
					customStyles={customStylesX}
					defaultSortFieldId={2}
					defaultSortAsc={true} // เรียงจากน้อยไปมาก
					fixedHeader
					responsive
					pagination={false}
					highlightOnHover
					selectableRows={false}
					selectableRowsHighlight
					noDataComponent={<NoTableData />}
				/>
			) : (
				<>
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

									<div className="dropdown-menu">
										<div className="d-flex flex-column flex-sm-row">
											<div className="bg-light px-2">
												<label htmlFor="hideColumn">ซ่อนคอลัมน์</label>
												<ul
													id="hideColumn"
													className="list-unstyled text-nowrap"
												>
													{Object.entries(tableColOptions2).map(
														([key, val] = entry, index) => (
															<li key={index}>
																<div className="form-check form-check-inline">
																	<input
																		className="form-check-input"
																		type="checkbox"
																		name={key}
																		id={`${index}_${key}`}
																		checked={val.is_hide}
																		onChange={(e) => handleHideColumn2(e)}
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
						columns={allStdDocsColumns2}
						data={allStdDocsData2}
						customStyles={customStylesX}
						defaultSortFieldId={3} // std_id
						defaultSortAsc={true} // เรียงจากน้อยไปมาก
						fixedHeader
						responsive
						pagination={true}
						paginationPerPage={10}
						paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30, 35]}
						highlightOnHover
						selectableRows={false}
						selectableRowsHighlight
						noDataComponent={<NoTableData />}
					/>
				</>
			)}
		</>
	);
}

export default StudentMornitor;
