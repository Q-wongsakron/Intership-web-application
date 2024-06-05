import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import {
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
} from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import Loading from "../../components/Loading";
import { format } from "date-fns";
import { th } from "date-fns/locale";

function StdAllDocs() {
	const [file, setFile] = useState(null);
	const [allStdDocsData, setAllStdDocsData] = useState(null);
	const [loading, setLoading] = useState(true);

	const user = useSelector((state) => state.user);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/getAllDocStudent"
			);

			const stdAllDocsData = response.data;

			if (stdAllDocsData.length > 0) {
				const userRecords = stdAllDocsData.filter(
					(record) => record.std_id === user.user.username
				);
				if (userRecords.length > 0) {
					const latestUserRecord = userRecords[userRecords.length - 1];
					setAllStdDocsData({
						date_upload_report_pdf:
							latestUserRecord.date_upload_report_pdf !== null
								? latestUserRecord.date_upload_report_pdf
								: null,
						date_upload_report_docx:
							latestUserRecord.date_upload_report_docx !== null
								? latestUserRecord.date_upload_report_docx
								: null,
						date_upload_timestamp_pdf:
							latestUserRecord.date_upload_timestamp_pdf !== null
								? latestUserRecord.date_upload_timestamp_pdf
								: null,
						date_upload_present_pdf:
							latestUserRecord.date_upload_present_pdf !== null
								? latestUserRecord.date_upload_present_pdf
								: null,
						date_upload_present_ppt:
							latestUserRecord.date_upload_present_ppt !== null
								? latestUserRecord.date_upload_present_ppt
								: null,
					});
				}
				// console.log(userRecords[userRecords.length - 1]);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async (fileType) => {
		try {
			if (fileType === "หนังสือขอความอนุเคราะห์") {
				try {
					//console.log("Downloaded")
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFileCourtesy/${user.user.username}`,
						{ responseType: "blob" }
					);
					console.log(File);
					const fileBlob = new Blob([File.data], { type: "application/pdf" });

					const fileURL = URL.createObjectURL(fileBlob);

					const newWindow = window.open(fileURL, "_blank");
					//console.log(user.user.username)
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
							`/getFileLetter/${user.user.username}`,
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
							`/getFileReportPdf/${user.user.username}`,
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
							`/getFileReportDocx/${user.user.username}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/docx" });

					const downloadLink = document.createElement("a");
					downloadLink.href = URL.createObjectURL(fileBlob);
					downloadLink.download = `report_${user.user.username}.docx`;

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
							`/getFileTimesheet/${user.user.username}`,
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
							`/getFilePresentationPdf/${user.user.username}`,
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
			} else if (fileType === "ไฟล์นำเสนอ-ppt") {
				try {
					const File = await axios.get(
						import.meta.env.VITE_APP_API +
							`/getFilePresentationPpt/${user.user.username}`,
						{ responseType: "blob" }
					);
					const fileBlob = new Blob([File.data], { type: "application/pptx" });

					const downloadLink = document.createElement("a");
					downloadLink.href = URL.createObjectURL(fileBlob);
					downloadLink.download = `presentation_${user.user.username}.pptx`;

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

	const formatDate = (dateString) => {
		if (dateString === null) {
			return "ยังไม่มีข้อมูล";
		} else {
			const date = new Date(dateString);
			return format(date, "วันที่อัปโหลด dd/MM/yyyy เวลา HH:mm:ss น.", {
				locale: th,
			});
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, [user.user.token]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">คลังเอกสารของฉัน</h3>

				<Link to={"/student/upload"}>
					<button className={`${btn.btn_blue_outline}`}>
						ไปหน้าอัปโหลดเอกสาร
					</button>
				</Link>
			</div>

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
							หนังสือขอความอนุเคราะห์ (.pdf)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("หนังสือขอความอนุเคราะห์")}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
			</div>
			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
							หนังสือส่งตัว (.pdf)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("หนังสือส่งตัว")}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
			</div>

			<br />
			<hr />

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
							รายงาน (.pdf)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("รายงาน-pdf")}
							disabled={!allStdDocsData || allStdDocsData.date_upload_report_pdf === null}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
				<small className="text-muted">
					{allStdDocsData && allStdDocsData.date_upload_report_pdf
						? formatDate(allStdDocsData.date_upload_report_pdf)
						: "No document available"}
				</small>
			</div>

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFileWord} className="docx-file-color" />{" "}
							รายงาน (.docx)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("รายงาน-docx")}
							disabled={!allStdDocsData || allStdDocsData.date_upload_report_docx === null}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
				<small className="text-muted">
					{allStdDocsData && allStdDocsData.date_upload_report_docx
						? formatDate(allStdDocsData.date_upload_report_docx)
						: "No document available"}
				</small>
			</div>

			<br />
			<hr />

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
							ใบบันทึกเวลา (.pdf)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("ใบบันทึกเวลา")}
							disabled={!allStdDocsData || allStdDocsData.date_upload_timestamp_pdf === null}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
				<small className="text-muted">
					{allStdDocsData && allStdDocsData.date_upload_timestamp_pdf
						? formatDate(allStdDocsData.date_upload_timestamp_pdf)
						: "No document available"}
				</small>
			</div>

			<br />
			<hr />

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePdf} className="pdf-file-color" />{" "}
							ไฟล์นำเสนอ (.pdf)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("ไฟล์นำเสนอ-pdf")}
							disabled={!allStdDocsData || allStdDocsData.date_upload_present_pdf === null}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
				<small className="text-muted">
					{allStdDocsData && allStdDocsData.date_upload_present_pdf
						? formatDate(allStdDocsData.date_upload_present_pdf)
						: "No document available"}
				</small>
			</div>

			<div className="mb-3">
				<div className="d-flex flex-row">
					<div className="my-auto">
						<p className="my-auto fw-bold">
							<FontAwesomeIcon icon={faFilePowerpoint} className="pptx-file-color" />{" "}
							ไฟล์นำเสนอ (.pptx)
						</p>
					</div>
					<div className="ms-2">
						<button
							type="button"
							className={`${btn.btn_blue_outline}`}
							onClick={() => handleDownload("ไฟล์นำเสนอ-ppt")}
							disabled={!allStdDocsData || allStdDocsData.date_upload_present_ppt === null}
						>
							<FontAwesomeIcon icon={faDownload} />
						</button>
					</div>
				</div>
				<small className="text-muted">
					{allStdDocsData && allStdDocsData.date_upload_present_ppt
						? formatDate(allStdDocsData.date_upload_present_ppt)
						: "No document available"}
				</small>
			</div>

			<Link to={"/student/upload"}>ไปหน้าอัปโหลดเอกสาร</Link>
		</div>
	);
}

export default StdAllDocs;
