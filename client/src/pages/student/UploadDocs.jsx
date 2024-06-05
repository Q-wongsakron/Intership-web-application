import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { getStudentProfile } from "../../services/user.service";
import {
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function UploadDocs() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [disabledFieldset, setDisabledFieldset] = useState(false);

	const user = useSelector((state) => state.user);

	const [file, setFile] = useState({
		reportPdf: null,
		reportDocx: null,
		timestampPdf: null,
		slidePdf: null,
		slidePpt: null,
	});

	const fetchData = async (authtoken) => {
		setLoading(true);
		try {
			const response = await getStudentProfile(authtoken);
			setData(response.data);
			setDisabledFieldset(
				response.data?.status === "3" || response.data?.status === "4"
					? false
					: true
			);
		} catch (err) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

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
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("ReportPdfFile", file.reportPdf);

			const response = await axios.put(
				import.meta.env.VITE_APP_API + "/uploadReportPdf",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);

			setFile((prevState) => ({
				...prevState,
				reportPdf: null, // Resetting only the specific file property
			}));
			console.log(response);
			toast.success(`อัปโหลดไฟล์รายงาน (.pdf) สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("file upload failed", error);
			toast.error(`อัปโหลดไฟล์รายงาน (.pdf) ไม่สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitReportDocx = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("ReportDocxFile", file.reportDocx);

			const response = await axios.put(
				import.meta.env.VITE_APP_API + "/uploadReportDocx",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);

			setFile((prevState) => ({
				...prevState,
				reportDocx: null, // Resetting only the specific file property
			}));
			console.log(response);
			toast.success(`อัปโหลดไฟล์รายงาน (.docx) สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("file upload failed", error);
			toast.error(`อัปโหลดไฟล์รายงาน (.docx) ไม่สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleTimestampPdf = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("TimestampFile", file.timePdf);

			const response = await axios.put(
				import.meta.env.VITE_APP_API + "/uploadTimestampPdf",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);

			setFile((prevState) => ({
				...prevState,
				timePdf: null, // Resetting only the specific file property
			}));
			console.log(response);
			toast.success(`อัปโหลดไฟล์ใบบันทึกเวลา (.pdf) สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("file upload failed", error);
			toast.error(`อัปโหลดไฟล์ใบบันทึกเวลา (.pdf) ไม่สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePresentPdf = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("PresentPdfFile", file.slidePdf);

			const response = await axios.put(
				import.meta.env.VITE_APP_API + "/uploadPresentPdf",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);

			setFile((prevState) => ({
				...prevState,
				slidePdf: null, // Resetting only the specific file property
			}));
			console.log(response);
			toast.success(`อัปโหลดไฟล์นำเสนอ (.pdf) สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("file upload failed", error);
			toast.error(`อัปโหลดไฟล์นำเสนอ (.pdf) ไม่สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePresentPpt = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("PresentPptFile", file.slidePpt);

			const response = await axios.put(
				import.meta.env.VITE_APP_API + "/uploadPresentPpt",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						authtoken: user.user.token,
					},
				}
			);

			setFile((prevState) => ({
				...prevState,
				slidePpt: null, // Resetting only the specific file property
			}));
			console.log(response);
			toast.success(`อัปโหลดไฟล์นำเสนอ (.pptx) สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} catch (error) {
			console.error("file upload failed", error);
			toast.error(`อัปโหลดไฟล์นำเสนอ (.pptx) ไม่สำเร็จ!`, {
				autoClose: 5000,
				position: "top-right",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
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
				<h3 className="fw-bold">อัปโหลดไฟล์เอกสาร</h3>

				<Link to={"/student/documents"}>
					<button className={`${btn.btn_blue_outline}`}>
						คลังเอกสารของฉัน
					</button>
				</Link>
			</div>

			{disabledFieldset && (
				<p className="mb-3 fw-bold p-1 border border-warning rounded">
					<span className="text-warning">
						<FontAwesomeIcon icon={faCircleInfo} />{" "}
					</span>{" "}
					<span className="text-black">
						ยังไม่สามารถอัปโหลดไฟล์ได้ในขณะนี้
						เนื่องจากนักศึกษายังอยู่ระหว่างขั้นตอนการหาที่ฝึกงานหรือยังไม่เสร็จสิ้นการฝึกงาน
						(หากเสร็จสิ้นขั้นตอนดังกล่าวแล้วให้กลับมาตรวจสอบหน้านี้อีกครั้ง)
					</span>
				</p>
			)}

			<fieldset disabled={disabledFieldset}>
				<form className="form-outline mb-4" onSubmit={handleSubmitReportPdf}>
					<div className="form-group">
						<div className="d-flex flex-column flex-sm-row mb-4">
							<div className="flex-grow-1">
								<label htmlFor="reportPdf" className="form-label fw-bold">
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									ไฟล์รายงาน (.pdf)
								</label>
								<input
									className="form-control"
									type="file"
									id="reportPdf"
									name="reportPdf"
									accept=".pdf"
									onChange={handleFileChange}
									required
								/>
							</div>
							<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
								<button
									type="submit"
									className={`${btn.btn_blue_outline}`}
									onClick={null}
									disabled={disabledFieldset}
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
								<label htmlFor="reportDocx" className="form-label fw-bold">
									<FontAwesomeIcon
										icon={faFileWord}
										className="docx-file-color"
									/>{" "}
									ไฟล์รายงาน (.docx)
								</label>
								<input
									className="form-control"
									type="file"
									id="reportDocx"
									name="reportDocx"
									accept=".docx"
									onChange={handleFileChange}
									required
								/>
							</div>
							<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
								<button
									type="submit"
									className={`${btn.btn_blue_outline}`}
									onClick={null}
									disabled={disabledFieldset}
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
								<label htmlFor="timePdf" className="form-label fw-bold">
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									ไฟล์ใบบันทึกเวลา (.pdf)
								</label>
								<input
									className="form-control"
									type="file"
									id="timePdf"
									name="timePdf"
									accept=".pdf"
									onChange={handleFileChange}
									required
								/>
							</div>
							<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
								<button
									type="submit"
									className={`${btn.btn_blue_outline}`}
									onClick={null}
									disabled={disabledFieldset}
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
								<label htmlFor="slidePdf" className="form-label fw-bold">
									<FontAwesomeIcon
										icon={faFilePdf}
										className="pdf-file-color"
									/>{" "}
									ไฟล์นำเสนอ (.pdf)
								</label>
								<input
									className="form-control"
									type="file"
									id="slidePdf"
									name="slidePdf"
									accept=".pdf"
									onChange={handleFileChange}
									required
								/>
							</div>
							<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
								<button
									type="submit"
									className={`${btn.btn_blue_outline}`}
									onClick={null}
									disabled={disabledFieldset}
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
								<label htmlFor="stdSlidePptx" className="form-label fw-bold">
									<FontAwesomeIcon
										icon={faFilePowerpoint}
										className="pptx-file-color"
									/>{" "}
									ไฟล์นำเสนอ (.pptx)
								</label>
								<input
									className="form-control"
									type="file"
									id="slidePpt"
									name="slidePpt"
									accept=".pptx"
									onChange={handleFileChange}
									required
								/>
							</div>
							<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
								<button
									type="submit"
									className={`${btn.btn_blue_outline}`}
									onClick={null}
									disabled={disabledFieldset}
								>
									อัปโหลดไฟล์
								</button>
							</div>
						</div>
					</div>
				</form>
			</fieldset>

			<Link to={"/student/documents"}>ไปหน้าคลังเอกสารของฉัน</Link>
		</div>
	);
}

export default UploadDocs;
