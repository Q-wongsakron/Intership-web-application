import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";

import { getStudentProfile } from "../../services/user.service";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/PDFViewer.css";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

function StdProfile() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [resumeFile, setResumeFile] = useState(null);
	const [viewPdf, setViewPdf] = useState(null);

	const { user } = useSelector((state) => ({ ...state }));

	const loadData = async (authtoken) => {
		try {
			const response = await getStudentProfile(authtoken);
			setData(response.data);
			setViewPdf(`http://localhost:5500/uploads/${response.data.resume}`);
		} catch (error) {
			console.log(
				"Load data failed: ",
				err.response ? err.response.data : err.message
			);
		} finally {
			setLoading(false);
		}
	};

	const handleResumeUpload = async () => {
		try {
			const formData = new FormData();
			formData.append("stdResumeFile", resumeFile);

			await axios.put("http://localhost:5500/api/uploadFileResume", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					authtoken: user.user.token,
				},
			});

			console.log("Resume file uploaded successfully");
		} catch (error) {
			console.error("Resume file upload failed", error);
		}
	};

	const handleResumeFileChange = (e) => {
		setResumeFile(e.target.files[0]);
	};
	const renderToolbar = (Toolbar) => (
		<>
			<Toolbar />
			<div
				style={{
					borderTop: "1px solid rgba(0, 0, 0, 0.1)",
					marginTop: "4px",
					padding: "4px",
				}}
			></div>
		</>
	);

	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		renderToolbar,
	});
	useEffect(() => {
		setLoading(true);
		loadData(user.user.token);
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-3 p-md-4 container-card stdProfileCard">
				<div className="d-flex justify-content-between">
					<h3 className="stdProfileTitle mb-3 fw-bold">ข้อมูลของฉัน</h3>
					<Link to={"/student/profile/edit"}>
						<button className={`${btn.btn_blue_outline}`}>แก้ไขข้อมูล</button>
					</Link>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="stdProfileDetail px-2 pt-3">
							<div className="row">
								<div className="col-sm-6 stdName">
									<p className="fw-bold">ชื่อ-นามสกุล</p>
									{data ? (
										<h6>{data.name_title_th}{data.displayname_th}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
								
								<div className="col-sm-6 mt-2 mt-sm-0 stdSurname">
									<p className="fw-bold">ชื่อ-นามสกุล (ภาษาอังกฤษ)</p>
									{data ? (
										<h6>{data.name_title_en}{data.displayname_en}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 std_id">
									<p className="fw-bold">เลขทะเบียน</p>
									{data ? (
										<h6>{data.std_id}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdDepartment">
									<p className="fw-bold">ภาควิชา</p>
									{data ? (
										<h6>{data.department}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdFaculty">
									<p className="fw-bold">คณะ</p>
									{data ? (
										<h6>{data.faculty}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
									<p className="fw-bold">GPA</p>
									{data.gpa ? (
										<h6>{data.gpa}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdFaculty">
									<p className="fw-bold">ประสบการณ์</p>
									{data.experience ? (
										<h6>{data.experience}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
									<p className="fw-bold">ทักษะ</p>
									{data.skill ? (
										<h6>{data.skill}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdMail">
									<p className="fw-bold">อีเมล</p>
									{data ? (
										<h6>{data.email}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
									<p className="fw-bold">โทรศัพท์</p>
									{data.tel ? (
										<h6>{data.tel}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container p-3 p-md-4 mt-4 container-card std-resume-card">
				<div className="d-flex justify-content-between">
					<h4 className="std-resume-title mb-3 fw-bold">Resume</h4>
				</div>
				<div className="std-resume">
					<div className="d-flex flex-column flex-sm-row mb-4">
						<div className="flex-grow-1">
							<label htmlFor="stdResumeFile" className="form-label fw-bold">
								อัปโหลดไฟล์ Resume เป็น .pdf
							</label>
							<input
								className="form-control"
								type="file"
								id="stdResumeFile"
								name="stdResumeFile"
								accept=".pdf"
								onChange={handleResumeFileChange}
							/>
						</div>
						<div className="align-self-end ms-0 ms-sm-2 mt-2 mt-sm-0">
							<button
								type="submit"
								className={`${btn.btn_blue_outline}`}
								onClick={handleResumeUpload}
							>
								อัปโหลด Resume
							</button>
						</div>
					</div>
					<br />
					<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
						{loading && <p>Loading...</p>}
						{!loading && viewPdf && (
							<Viewer
								fileUrl={viewPdf}
								// httpHeaders={{
								// 	authtoken: user.user.token,
								// }}
								plugins={[defaultLayoutPluginInstance]}
								withCredentials={false}
							/>
						)}
						{!loading && !viewPdf && <p>No PDF</p>}
					</Worker>
				</div>
			</div>
		</>
	);
}

export default StdProfile;
