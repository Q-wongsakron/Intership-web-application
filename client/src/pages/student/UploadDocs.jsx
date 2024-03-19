import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";

import { useSelector } from "react-redux";
import axios from "axios";

function UploadDocs() {
	const { user } = useSelector((state) => ({ ...state }));
	const [file, setFile] = useState({
		reportPdf: null,
		reportDocx: null,
		timestampPdf: null,
		slidePdf: null,
		slidePpt: null,
	});

	const handleFileChange = (e) => {
		const { name, value } = e.target;
		const f = e.target.files[0];

		setFile({
			...file,
			[name]: f,
		});
		console.log(file);
	};

	const handleSubmitReportPdf = async (e) => {
		e.preventDefault();
		try {
		  const formData = new FormData();
		  formData.append("ReportPdfFile", file.stdReportPdf);
	
		  
		  await axios.put("http://localhost:5500/api/uploadReportPdf", formData, {
			headers: {
			  "Content-Type": "multipart/form-data",
			  authtoken: user.user.token, 
			},
		  });
		  
		  setFile({["ReportPdf"] : null});
		  console.log(file.stdReportPdf);
		  console.log("file uploaded successfully");
		  
		} catch (error) {
		  console.error("file upload failed", error);
		}
	  };
	  
	const handleSubmitReportDocx = async (e) => {
		e.preventDefault();
		try {
		  const formData = new FormData();
		  formData.append("ReportDocxFile", file.stdReportDocx);
	
		  
		  await axios.put("http://localhost:5500/api/uploadReportDocx", formData, {
			headers: {
			  "Content-Type": "multipart/form-data",
			  authtoken: user.user.token, 
			},
		  });
		  
		  setFile({["ReportDocx"] : null});
		  console.log(file.stdReportDocx);
		  console.log("file uploaded successfully");
		  
		} catch (error) {
		  console.error("file upload failed", error);
		}
	};

	const handleTimestampPdf = async (e) => {
		e.preventDefault();
		try {
		  const formData = new FormData();
		  formData.append("TimestampFile", file.stdTimePdf);
	
		  
		  await axios.put("http://localhost:5500/api/uploadTimestampPdf", formData, {
			headers: {
			  "Content-Type": "multipart/form-data",
			  authtoken: user.user.token, 
			},
		  });
		  
		  setFile({["timestampPdf"] : null});
		  console.log(file.stdTimePdf);
		  console.log("file uploaded successfully");
		  
		} catch (error) {
		  console.error("file upload failed", error);
		}
	};

	const handlePresentPdf = async (e) => {
		e.preventDefault();
		try {
		  const formData = new FormData();
		  formData.append("PresentPdfFile", file.stdSlidePdf);
	
		  
		  await axios.put("http://localhost:5500/api/uploadPresentPdf", formData, {
			headers: {
			  "Content-Type": "multipart/form-data",
			  authtoken: user.user.token, 
			},
		  });
		  
		  setFile({["slidePdf"] : null});
		  console.log(file.stdSlidePdf);
		  console.log("file uploaded successfully");
		  
		} catch (error) {
		  console.error("file upload failed", error);
		}
	};

	const handlePresentPpt = async (e) => {
		e.preventDefault();
		try {
		  const formData = new FormData();
		  formData.append("PresentPptFile", file.stdSlidePpt);
	
		  
		  await axios.put("http://localhost:5500/api/uploadPresentPpt", formData, {
			headers: {
			  "Content-Type": "multipart/form-data",
			  authtoken: user.user.token, 
			},
		  });
		  
		  setFile({["slidePpt"] : null});
		  console.log(file.stdSlidePpt);
		  console.log("file uploaded successfully");
		  
		} catch (error) {
		  console.error("file upload failed", error);
		}
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		
	  };
	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">อัปโหลดไฟล์เอกสาร</h3>
			</div>
			
			<form className="form-outline mb-4" onSubmit={handleSubmitReportPdf}>
				<div className="form-group">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdReportPdf" className="form-label fw-bold">
								"ไฟล์รายงาน (pdf)"
							</label>
							<input
								className="form-control"
								type="file"
								id="stdReportPdf"
								name="stdReportPdf"
								accept=".pdf"
								onChange={handleFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={null}
							>
								อัปโหลดไฟล์
							</button>
						</div>
					</div>
				</div>
			</form>

			<form className="form-outline mb-4" onSubmit={handleSubmitReportDocx}>
				<div className="form-group">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdReportDocx" className="form-label fw-bold">
								"ไฟล์รายงาน (docx)"
							</label>
							<input
								className="form-control"
								type="file"
								id="stdReportDocx"
								name="stdReportDocx"
								accept=".docx"
								onChange={handleFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={null}
							>
								อัปโหลดไฟล์
							</button>
						</div>
					</div>
				</div>
			</form>

			<br />

			<form className="form-outline mb-4" onSubmit={handleTimestampPdf}>
				<div className="form-group">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdTimePdf" className="form-label fw-bold">
								"ไฟล์ใบบันทึกเวลา (pdf)"	
							</label>
							<input
								className="form-control"
								type="file"
								id="stdTimePdf"
								name="stdTimePdf"
								accept=".pdf"
								onChange={handleFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={null}
							>
								อัปโหลดไฟล์
							</button>
						</div>
					</div>
				</div>
			</form>

			<br />

			<form className="form-outline mb-4" onSubmit={handlePresentPdf}>
				<div className="form-group">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdSlidePdf" className="form-label fw-bold">
								"ไฟล์นำเสนอ (pdf)"	
							</label>
							<input
								className="form-control"
								type="file"
								id="stdSlidePdf"
								name="stdSlidePdf"
								accept=".pdf"
								onChange={handleFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={null}
							>
								อัปโหลดไฟล์
							</button>
						</div>
					</div>
				</div>
			</form>



			<form className="form-outline mb-4" onSubmit={handlePresentPpt}>
				<div className="form-group">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdSlidePpt" className="form-label fw-bold">
								"ไฟล์นำเสนอ (ppt)"
							</label>
							<input
								className="form-control"
								type="file"
								id="stdSlidePpt"
								name="stdSlidePpt"
								accept=".ppt"
								onChange={handleFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={null}
							>
								อัปโหลดไฟล์
							</button>
						</div>
					</div>
				</div>
			</form>

		</div>
	);

}

export default UploadDocs;
