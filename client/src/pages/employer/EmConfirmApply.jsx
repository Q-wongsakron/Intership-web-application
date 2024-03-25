import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Modal, Button } from "react-bootstrap";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import axios from "axios";

function EmConfirmApply() {
	const [data, setData] = useState([]);

	const [showResumeModal, setShowResumeModal] = useState(false);
	
	const [showRefuseModal, setShowRefuseModal] = useState(false);
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);
	const [selectedConfirmId, setSelectedConfirmId] = useState(null);
	const [selectedStudentName, setSelectedStudentName] = useState(null);

	const [viewPdf, setViewPdf] = useState(null);

	const { user } = useSelector((state) => ({ ...state }));

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

	const fetchData = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5500/api/allConfirm",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			console.log(response.data);
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	const [selectedSearchField, setSelectedSearchField] = useState("position");
	const [searchQuery, setSearchQuery] = useState("");
	const filteredData = data.filter((item) => {
		const fields = selectedSearchField.split(".");
		let fieldValue = item;

		for (const field of fields) {
			if (fieldValue && fieldValue.hasOwnProperty(field)) {
				fieldValue = fieldValue[field];
			} else {
				fieldValue = undefined;
				break;
			}
		}

		if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
			const objectValues = Object.values(fieldValue);
			return objectValues.some(
				(value) =>
					typeof value === "string" &&
					value.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
			);
		} else {
			return (
				typeof fieldValue === "string" &&
				fieldValue
					.trim()
					.toLowerCase()
					.includes(searchQuery.trim().toLowerCase())
			);
		}
	});


	const handleViewProfile = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setSelectedStudentDetails(response.data);
			setShowProfileModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	const handleViewResume = async (std_id) => {
		try {
			const response = await axios.get(
				`http://localhost:5500/api/profileStudent/${std_id}`,
				{}
			);
			console.log(response.data);
			setViewPdf(`http://localhost:5500/uploads/${response.data.resume}`);
			setShowResumeModal(true);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};
	const handleRefuseConfirm = (apply_id, displayname_th) => {
		setSelectedConfirmId(apply_id);
		setSelectedStudentName(displayname_th);
		setShowRefuseModal(true);
	};
	const refuseConfirm = async () => {
		try {
			const response = await axios.delete(
				`http://localhost:5500/api/refuseConfirm/${selectedConfirmId}`,
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			console.log(response.data);
			// You might want to handle the success or update the UI accordingly
			// For example, close the modal and refresh the data
			setShowRefuseModal(false);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

		// fetch Data from Gened DOC with license
	const handleViewCourtesyLic = async (std_id) => {
			try {
				const response = await axios.get(
					`http://localhost:5500/api/getGenDoc/${std_id}`,
					{}
				);
				if(!response.data){
					const selfDoc = await axios.get(`http://localhost:5500/api/getGenDocSelf/${std_id}`,
					{});
					setViewPdf(`http://localhost:5500/uploads/${selfDoc.data.courtesy_license}`);
					setShowResumeModal(true);
				}else{
					setViewPdf(`http://localhost:5500/uploads/${response.data.courtesy_license}`);
					setShowResumeModal(true);
				}
				
	
			} catch (error) {
				console.error("Error fetching student details:", error);
			}
		};
	
		// fetch Data from Gened DOC with Letter มาทำเพิ่ม
	const handleViewLetter = async (std_id) => {
			try {
	
				const response = await axios.get(
					`http://localhost:5500/api/getGenDoc/${std_id}`,
					{}
				);
				if(!response.data){
					const selfDoc = await axios.get(`http://localhost:5500/api/getGenDocSelf/${std_id}`,
					{});
					setViewPdf(`http://localhost:5500/uploads/${selfDoc.data.intern_letter}`);
					setShowResumeModal(true);
				}else{
					setViewPdf(`http://localhost:5500/uploads/${response.data.intern_letter}`);
					setShowResumeModal(true);
				}
	
			} catch (error) {
				console.error("Error fetching student details:", error);
			}
		};
	// const hasCourtesyLic = async(std_id) => {
	// 	try {
	// 		const response = await axios.get(
	// 			`http://localhost:5500/api/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		console.log("hello you",response && response.data.courtesy_license !== undefined);
	// 		return response && response.data.courtesy_license !== undefined;
			
	// 	} catch (error) {
	// 		console.error("Error fetching student details:", error);
	// 	}
	// 		// return studentData && studentData.courtesy_license !== undefined;
	// 	};
		
	// const hasDoc = async(std_id) => {
	// 	try {
	// 		const response = await axios.get(
	// 			`http://localhost:5500/api/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		const response2 = await axios.get(
	// 			`http://localhost:5500/api/getGenDoc/${std_id}`,
	// 			{}
	// 		);
	// 		console.log("hello you",response && response.data.courtesy_license !== undefined);
	// 		return response && response.data.courtesy_license !== undefined;

			
	// 	} catch (error) {
	// 		console.error("Error fetching student details:", error);
	// 	}
	// 		// return studentData && studentData.intern_letter !== undefined;
	// 	};
	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">นักศึกษาที่รับฝึกงานแล้ว ({data.length})</h3>
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
						onChange={(e) => setSelectedSearchField(e.target.value)}
					>
						<option value="position" label="ตำแหน่ง">
							ตำแหน่ง
						</option>
						<option value="posts_job.job_title" label="จากโพสต์">
							จากโพสต์
						</option>
						<option value="student.displayname_th" label="ชื่อ-นามสกุล">
							ชื่อ-นามสกุล
						</option>
						<option value="date_confirm" label="วันที่รับ">
							วันที่รับ
						</option>
					</select>

					<input
						type="text"
						className="form-control w-75"
						aria-label="Sizing example input"
						aria-describedby="inputGroup-sizing-sm"
						placeholder="ค้นหา..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<div className="mx-1">({filteredData.length})</div>
				</div>
			</div>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ตำแหน่ง</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">จากโพสต์</th>
							<th scope="col">เอกสารจากภาควิชา</th>
							<th scope="col">วันที่รับ</th>
							<th scope="col">RESUME</th>
							<th scope="col">ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((data, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{data.position}</td>
								<td>{`${data.student.displayname_th} `}</td>
								<td>{data.student.email}</td>
								<td>{data.student.tel}</td>
								<td>{data.posts_job.job_title}</td>
								<td>
								{data.status != "รอดำเนินเอกสาร" ? (
									<div>								
										<Link to="#">
											<button type="button" className={`btn btn-secondary m-1`} onClick={() => handleViewCourtesyLic(data.student.std_id)}>
												<FontAwesomeIcon icon={faEye} />
											</button>
										</Link>
										<Link to="#">
											<button type="button" className={`btn btn-secondary m-1`} onClick={() => handleViewLetter(data.student.std_id)}>
												<FontAwesomeIcon icon={faEye} />
											</button>
										</Link>
									</div>
								) : (
									<p>รอดำเนินเอกสาร</p>
								)}
									
						
									
							</td>
								<td>{data.date_confirm}</td>
								<td>
									<div>
										<a href="#" onClick={() => handleViewResume(data.student.std_id)}>
											Resume
										</a>
									</div>
								</td>
								<td>
									
									<button
										className={`btn btn-sm btn-outline-secondary`}
										onClick={() => handleViewProfile(data.student.std_id)}
									>
										<FontAwesomeIcon icon={faEye} />
									</button>
									<button
										className={`btn btn-sm btn-outline-danger ms-2`}
										onClick={() =>
											handleRefuseConfirm(data.confirm_id, data.student.displayname_th)
										}
									>
										<FontAwesomeIcon icon={faTimes} />
									</button>
									
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Modal
				show={showRefuseModal}
				onHide={() => setShowRefuseModal(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">
						ยืนยันการปฏิเสธรับนักศึกษาฝึกงาน
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					คุณยืนยันที่จะปฏิเสธรับนักศึกษา {selectedStudentName} เข้าฝึกงาน
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowRefuseModal(false)}>
						ปิด
					</Button>
					<Button variant="danger" onClick={refuseConfirm}>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showProfileModal}
				onHide={() => setShowProfileModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Student Profile</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedStudentDetails && (
						<div className="row">
							<div className="col-12">
								<div className="stdProfileDetail px-2 pt-3">
									<div className="row">
										<div className="col-sm-6 stdName">
											<p className="fw-bold">ชื่อ-นามสกุล</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.displayname_th}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdSurname">
											<p className="fw-bold">ชื่อ-นามสกุล (ภาษาอังกฤษ)</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.displayname_en}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 std_id">
											<p className="fw-bold">รหัสนักศึกษา</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.std_id}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdDepartment">
											<p className="fw-bold">ภาควิชา</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.department}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdFaculty">
											<p className="fw-bold">คณะ</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.faculty}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">GPA</p>
											{selectedStudentDetails.gpa ? (
												<h6>{selectedStudentDetails.gpa}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdFaculty">
											<p className="fw-bold">ประสบการณ์</p>
											{selectedStudentDetails.experience ? (
												<h6>{selectedStudentDetails.experience}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">ทักษะ</p>
											{selectedStudentDetails.skill ? (
												<h6>{selectedStudentDetails.skill}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
									<div className="row mt-3">
										<div className="col-sm-6 stdMail">
											<p className="fw-bold">อีเมล</p>
											{selectedStudentDetails ? (
												<h6>{selectedStudentDetails.email}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
										<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
											<p className="fw-bold">โทรศัพท์</p>
											{selectedStudentDetails.tel ? (
												<h6>{selectedStudentDetails.tel}</h6>
											) : (
												<p className="text-muted">-</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowProfileModal(false)}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={showResumeModal}
				onHide={() => setShowResumeModal(false)}
				centered
				size="lg"
			>
				<Modal.Header closeButton>
					<Modal.Title>Student Resume</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
							{viewPdf && (
								<Viewer
									fileUrl={viewPdf}
									// httpHeaders={{
									// 	authtoken: user.user.token,
									// }}
									plugins={[defaultLayoutPluginInstance]}
									// withCredentials={true}
								/>
							)}
							{!viewPdf && <p>No PDF</p>}
						</Worker>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowResumeModal(false)}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);

	// <div className="container p-3 p-sm-4 container-card">
	// 	<div className="d-flex justify-content-between mb-4">
	// 		<h3 className="fw-bold">นักศึกษาที่รับฝึกงานแล้ว</h3>
	// 	</div>

	// 	<div className="table-responsive text-nowrap">
	// 		<table className="table table-striped">
	// 			<thead>
	// 				<tr className="table-dark">
	// 					<th scope="col">#</th>
	// 					<th scope="col">ตำแหน่ง</th>
	// 					<th scope="col">ชื่อ-นามสกุล</th>
	// 					<th scope="col">อีเมล</th>
	// 					<th scope="col">เบอร์โทร</th>
	// 					<th scope="col">สถานะ</th>
	// 					<th scope="col">RESUME</th>
	// 					<th scope="col">ACTION</th>
	// 				</tr>
	// 			</thead>
	// 			<tbody>
	// 				<tr>
	// 					<th scope="row">1</th>
	// 					<td>DepOps</td>
	// 					<td>วงศกร กองกะมุด</td>
	// 					<td>qq@ex.com</td>
	// 					<td>0929123456</td>
	// 					<td>ระหว่างฝึกงาน</td>
	// 					<td>
	// 						<Link to={"#"}>resume-file</Link>
	// 					</td>
	// <td>
	// 	<Link to={"#"}>
	// 		<button type="button" className={`btn btn-secondary m-1`}>
	// 			<FontAwesomeIcon icon={faEye} />
	// 		</button>
	// 	</Link>
	// </td>
	// 				</tr>
	/* {data
							? data.map((item, index) => (
									<tr key={index}>
										<th scope="row">{index + 1}</th>
										<td>{item.company_name}</td>
										<td>{item.address}</td>
										<td>{item.contact_name}</td>
										<td>{item.contact_email}</td>
										<td>{item.contact_tel}</td>
										<td>{item.username}</td>
										<td>{item.employer_id}</td>
										<td>
											<select
												className="form-select from-select-sm"
												value={item.status}
												onChange={(e) =>
													handleStatusChange(item.employer_id, e.target.value)
												}
											>
												<option value="verified">verified</option>
												<option value="notverify">notverify</option>
											</select>
										</td>
										<td>ACTION</td>
									</tr>
							  ))
							: null} */
	// 			</tbody>
	// 		</table>
	// 	</div>
	// </div>
	// );
}

export default EmConfirmApply;
