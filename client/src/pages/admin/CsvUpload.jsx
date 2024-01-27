import React, { useState } from "react";
import axios from "axios";
import { uploadCsv } from "../../services/admin.service";
import { useSelector } from "react-redux";

import btn from "../../components/btn.module.css";

const CsvUploader = () => {
	const { user } = useSelector((state) => ({ ...state }));
	const [file, setFile] = useState(null);
	const [message, setMessage] = useState(null);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
	};

	const handleUpload = async () => {
		try {
			if (!file) {
				setMessage("Please select a CSV file.");
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
			{/* <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {message && <p>{message}</p>} */}

			<div className="container p-3 p-sm-4 mt-4 container-card uploadCsvFileCard">
				<div className="d-flex justify-content-between">
					<h3 className="uploadCsvFileTitle mb-3 fw-bold">
						อัปโหลดไฟล์รายชื่อนักศึกษา
					</h3>
				</div>
				<div className="row">
					<div className="col-12 col-sm-9 csvFileUploader">
						<label for="csvFileUploader" className="form-label">
							อัปโหลดไฟล์ .csv
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
				</div>
				{message && <p>{message}</p>}
			</div>
		</>
	);
};

export default CsvUploader;
