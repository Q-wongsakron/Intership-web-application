import React, { useState } from "react";
import axios from "axios";
import { uploadCsv } from "../../services/admin.service";
import { useSelector } from "react-redux";

import btn from "../../components/btn.module.css";

const CsvUploader = () => {
	const user = useSelector((state) => state.user);
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState(null);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleUpload = async () => {
		try {
			if (!file) {
				setMessage("กรุณาเลือกไฟล์ .csv");
				return;
			}

			const formData = new FormData();
			formData.append("csvFile", file);

			const response = await uploadCsv(user.user.token, formData);
			setMessage(response.data.message);
		} catch (error) {
			console.error("Error uploading CSV:", error);
			setMessage("Error uploading CSV. Please try again.");
		}
	};

	return (
		<>
			<div className="container p-3 p-sm-4 mt-4 container-card uploadCsvFileCard">
				<div className="d-flex justify-content-between">
					<h3 className="uploadCsvFileTitle mb-3 fw-bold">
						อัปโหลดไฟล์รายชื่อนักศึกษา
					</h3>
				</div>
				{/* <div className="row">
					<div className="col-12 col-sm-9 csvFileUploader">
						<label htmlFor="csvFileUploader" className="form-label">
							อัปโหลดไฟล์นามสกุล .csv
						</label>
						<input
							className="form-control"
							type="file"
							id="csvFileUploader"
							accept=".csv"
							onChange={handleFileChange}
						/>
					</div>
					<div className="col-12 col-sm-3 mt-2 mt-sm-auto">
						<button
							className={`${btn.btn_blue_outline}`}
							onClick={handleUpload}
						>
							อัปโหลดไฟล์
						</button>
					</div>
				</div> */}
				<div className="d-flex flex-column flex-sm-row">
					<div className="flex-grow-1 csvFileUploader">
						<label htmlFor="csvFileUploader" className="form-label">
							อัปโหลดไฟล์นามสกุล .csv
						</label>
						<input
							className="form-control"
							type="file"
							id="csvFileUploader"
							accept=".csv"
							onChange={handleFileChange}
						/>
					</div>
					<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
						<button
							className={`${btn.btn_blue_outline}`}
							onClick={handleUpload}
						>
							อัปโหลดไฟล์
						</button>
					</div>
				</div>
				<div className="d-flex justify-content-center">
					{message && (
						<p className="fw-bold text-danger mt-2 mb-0">{message}</p>
					)}
				</div>

				<p className="mb-0 mt-4 fw-bold">
					<span className="text-danger">หมายเหตุ</span>{" "}
					กรุณาอัปโหลดไฟล์รายชื่อนักศึกษาในปีการศึกษาปัจจุบัน
					ภายหลังจากที่นักศึกษาในปีการศึกษาก่อนส่งไฟล์เอกสาร (รายงาน,
					ใบบันทึกเวลา, สไลด์นำเสนอ) ทุกอย่างครบแล้ว
				</p>
			</div>
		</>
	);
};

export default CsvUploader;
