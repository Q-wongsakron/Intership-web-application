import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";

import { useSelector } from "react-redux";

function StdAllDocs() {
	const [file, setFile] = useState(null);

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">ไฟล์เอกสารทั้งหมด</h3>
			</div>

			<FileItem file={file} fileLabel="ไฟล์รายงาน (pdf)" />
			<FileItem file={file} fileLabel="ไฟล์รายงาน (docx)" />
			<br />
			<FileItem file={file} fileLabel="ไฟล์ใบบันทึกเวลา (pdf)" />
			<br />
			<FileItem file={file} fileLabel="ไฟล์นำเสนอ (pdf)" />
			<FileItem file={file} fileLabel="ไฟล์นำเสนอ (ppt)" />
		</div>
	);

	function FileItem({ file, fileLabel }) {
		const handleDownload = (e) => {};

		return (
			<div className="d-flex flex-row mb-3">
				<div className="my-auto">
					<p className="my-auto fw-bold">{fileLabel}</p>
				</div>
				<div className="align-self-end ms-2">
					<button
						type="button"
						className={`${btn.btn_blue_outline}`}
						onClick={handleDownload}
					>
						ดาวน์โหลด
					</button>
				</div>
			</div>
		);
	}
}

export default StdAllDocs;
