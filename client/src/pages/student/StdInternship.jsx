import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Job from "../../components/Job";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHourglassHalf,
	faListCheck,
	faCheck,
	faCircle,
	faFilePdf,
	faFileAlt,
	faBuilding,
	faSquareCheck,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faSquare as faRegularSquare } from "@fortawesome/free-regular-svg-icons";

import axios from "axios";

import { useSelector } from "react-redux";

import { getStudentProfile } from "../../services/user.service";

function StdInternship() {
	const [applyData, setApplyData] = useState([]);
	const [stdData, setStdData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [internshipCompleted, setInternshipCompleted] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const user = useSelector((state) => state.user);

	const statusColors = {
		s00: "danger",
		s01: "danger",
		s02: "warning",
		s03: "info",
		s04: "success",
	};
	const handleConfirm = (e) => {
		e.preventDefault();
		setShowModal(true);
	};

	const handleEndIntern = async () => {
		setShowModal(false);
		try {
			const response = await axios.put(
				import.meta.env.VITE_APP_API + `/endIntern/${user.user.username}`,
				{},
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			// If the API call is successful, set the internshipCompleted state to true
			setInternshipCompleted(true);
		} catch (error) {
			console.error("Error ending internship:", error);
		}
	};

	const fetchData = async (authtoken) => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/myStatus",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			if (response.data !== null) {
				// console.log(response.data.posts_job); // why delete this line will occur an error?
				setApplyData([response.data]);
			} else {
				setApplyData([]);
			}
			await getStudentProfile(authtoken)
				.then((res) => {
					setStdData(res.data);
				})
				.catch((err) => {
					console.log(
						"Load data failed: ",
						err.response ? err.response.data : err.message
					);
				});
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, [internshipCompleted]); // Add internshipCompleted as a dependency

	if (loading) {
		return <Loading />;
	}

	// console.log(stdData);

	const ConfirmModal = () => {
		return (
			<Modal show={showModal} onHide={() => setShowModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">ยืนยันการจบการฝึกงาน</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					หากคุณได้ทำการฝึกงานเสร็จสิ้นแล้ว กรุณากดยืนยันการจบการฝึกงาน
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={() => {
							handleEndIntern();
							//navigate("/news");
						}}
					>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};
	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">การฝึกงานของฉัน</h3>
				</div>

				<div className="d-sm-none d-block">
					<SmScreenStatusBar />
				</div>

				<div className="d-none d-sm-block">
					<div
						id="stdInternshipStatus"
						className="row justify-content-center text-center text-white stdInternshipStatus bg-white bg-opacity-25 rounded-start rounded-end"
					>
						<div
							className={`col-3 py-3 rounded-start ${
								stdData.status === "1" || stdData.status === "0"
									? `bg-${statusColors.s01} bg-gradient rounded`
									: "bg-dark bg-opacity-25"
							}`}
						>
							<h5 className="m-0">
								{(stdData.status === "1" || stdData.status === "0") && (
									<FontAwesomeIcon icon={faHourglassHalf} />
								)}{" "}
								หาที่ฝึกงาน
							</h5>
						</div>

						<div
							className={`col-3 py-3 border-start border-end ${
								stdData.status === "2"
									? `bg-${statusColors.s02} bg-gradient rounded`
									: "bg-dark bg-opacity-25"
							}`}
						>
							<h5 className="m-0">
								{" "}
								{stdData.status === "2" && (
									<FontAwesomeIcon icon={faHourglassHalf} />
								)}{" "}
								รอเอกสารจากภาควิชา
							</h5>
						</div>

						<div
							className={`col-3 py-3 border-start border-end ${
								stdData.status === "3"
									? `bg-${statusColors.s03} bg-gradient rounded`
									: "bg-dark bg-opacity-25"
							}`}
						>
							<h5 className="m-0">
								{stdData.status === "3" && (
									<FontAwesomeIcon icon={faHourglassHalf} />
								)}{" "}
								ระหว่างฝึกงาน
							</h5>
						</div>

						<div
							className={`col-3 py-3 rounded-end ${
								stdData.status === "4"
									? `bg-${statusColors.s04} bg-gradient rounded`
									: "bg-dark bg-opacity-25"
							}`}
						>
							<h5 className="m-0">
								{stdData.status === "4" && <FontAwesomeIcon icon={faFileAlt} />}{" "}
								หลังฝึกงาน
							</h5>
						</div>
					</div>
				</div>

				<div className="mt-4">
					{stdData ? (
						<StudentStatus status={stdData.status} applyData={applyData} />
					) : (
						<p>No Data</p>
					)}
				</div>
			</div>

			<div className="container p-3 p-md-4 mt-4 bg-light container-card">
				<div className="mb-5">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							<FontAwesomeIcon icon={faListCheck} className="text-light-blue" />{" "}
							สิ่งที่ต้องทำ (To-do list)
						</h5>
					</div>

					<ToDoList status={stdData.status} />
				</div>

				<p>สีแทนสถานะการฝึกงานต่าง ๆ : </p>
				<div className="d-flex flex-wrap flex-lg-nowrap justify-content-start">
					<p className={`border border-${statusColors.s01} rounded p-1 ms-3`}>
						<span className={`text-${statusColors.s01}`}>
							<FontAwesomeIcon icon={faCircle} />
						</span>{" "}
						หาที่ฝึกงาน
					</p>
					<p className={`border border-${statusColors.s02} rounded p-1 ms-3`}>
						<span className={`text-${statusColors.s02}`}>
							<FontAwesomeIcon icon={faCircle} />
						</span>{" "}
						รอเอกสารจากภาควิชา
					</p>
					<p className={`border border-${statusColors.s03} rounded p-1 ms-3`}>
						<span className={`text-${statusColors.s03}`}>
							<FontAwesomeIcon icon={faCircle} />
						</span>{" "}
						ระหว่างฝึกงาน
					</p>
					<p className={`border border-${statusColors.s04} rounded p-1 ms-3`}>
						<span className={`text-${statusColors.s04}`}>
							<FontAwesomeIcon icon={faCircle} />
						</span>{" "}
						หลังฝึกงาน
					</p>
				</div>

				<ConfirmModal />
			</div>
		</>
	);

	function SmScreenStatusBar() {
		return (
			<div className="row justify-content-center text-center text-white stdInternshipStatus bg-white bg-opacity-25 rounded-start rounded-end">
				<div
					className={`col-3 py-2 rounded-start ${
						stdData.status === "1" || stdData.status === "0"
							? `bg-${statusColors.s01} bg-gradient rounded`
							: "bg-dark bg-opacity-25"
					}`}
					title="หาที่ฝึกงาน"
				>
					<h5 className="m-0">
						{(stdData.status === "1" || stdData.status === "0") && (
							<FontAwesomeIcon icon={faHourglassHalf} />
						)}{" "}
					</h5>
				</div>

				<div
					className={`col-3 py-2 border-start border-end ${
						stdData.status === "2"
							? `bg-${statusColors.s02} bg-gradient rounded`
							: "bg-dark bg-opacity-25"
					}`}
					title="รอเอกสารจากภาควิชา"
				>
					<h5 className="m-0">
						{" "}
						{stdData.status === "2" && (
							<FontAwesomeIcon icon={faHourglassHalf} />
						)}{" "}
					</h5>
				</div>

				<div
					className={`col-3 py-2 border-start border-end ${
						stdData.status === "3"
							? `bg-${statusColors.s03} bg-gradient rounded`
							: "bg-dark bg-opacity-25"
					}`}
					title="ระหว่างฝึกงาน"
				>
					<h5 className="m-0">
						{stdData.status === "3" && (
							<FontAwesomeIcon icon={faHourglassHalf} />
						)}{" "}
					</h5>
				</div>

				<div
					className={`col-3 py-2 rounded-end ${
						stdData.status === "4"
							? `bg-${statusColors.s04} bg-gradient rounded`
							: "bg-dark bg-opacity-25"
					}`}
					title="หลังฝึกงาน"
				>
					<h5 className="m-0">
						{stdData.status === "4" && <FontAwesomeIcon icon={faFileAlt} />}{" "}
					</h5>
				</div>
			</div>
		);
	}

	function StudentStatus({ status, applyData }) {
		const [showModal, setShowMoal] = useState(false);

		if (applyData && (status === "1" || status === "0")) {
			return (
				<div
					className={`stdStatusDetail border border-${statusColors.s01} rounded p-2`}
				>
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							สถานะ :{" "}
							<span className={`text-${statusColors.s01}`}>หาที่ฝึกงาน</span>
						</h5>
					</div>

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faUser} className="text-light-blue" />{" "}
							กรุณาอัปเดตโปรไฟล์ก่อนทำการสมัครฝึกงาน
						</p>
						<ul>
							<li>
								<Link to={"/student/profile"}>
									ไปที่หน้า "โปรไฟล์" เพื่ออัปโหลดไฟล์ Resume ขนาด A4
								</Link>
							</li>
							<li>
								<Link to={"/student/profile/edit"}>
									ไปที่หน้า "แก้ไขโปรไฟล์" เพื่ออัปเดตโปรไฟล์
								</Link>
							</li>
						</ul>
					</div>

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faListCheck} className="text-light-blue" />{" "}
							สิ่งที่ต้องทำระหว่างการหาที่ฝึกงาน
						</p>
						<ul>
							<li>
								<Link to={"/alljob"}>สมัครฝึกงานในระบบ</Link>
							</li>
							<li>
								<Link to={"/student/self-enroll"}>ยื่นข้อมูลที่ฝึกงานเอง</Link>
							</li>
						</ul>
					</div>

					{applyData.length !== 0 &&
					applyData.some((item) => item.status === "รอการตอบรับ") ? (
						<div className="mt-2 mt-sm-0">
							<div className="d-flex justify-content-between mb-2">
								<h5 className="fw-bold">รอการตอบรับการสมัคร</h5>
							</div>
							{applyData &&
								Array.isArray(applyData) &&
								applyData.map((item) => (
									<Job
										key={item.posts_job.job_id}
										id={item.posts_job.job_id}
										title={item.posts_job.job_title}
										img={item.employer.company_pic}
										company={item.employer.company_name}
										place={item.posts_job.location}
										allowance={item.posts_job.salary}
										location={item.posts_job.location}
										positions={
											Array.isArray(item.posts_job.cat)
												? item.posts_job.cat
												: typeof item.posts_job.cat === "string"
												? JSON.parse(item.posts_job.cat)
												: []
										}
										startPost={item.posts_job.dateStartPost}
										endPost={item.posts_job.dateEndPost}
										status={item.student.status}
										apply_id={item.apply_id}
									/>
								))}
						</div>
					) : null}
				</div>
			);
		} else if (status === "2") {
			return (
				<div
					className={`stdStatusDetail border border-${statusColors.s02} rounded p-2`}
				>
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							สถานะ :{" "}
							<span className={`text-${statusColors.s02}`}>
								รอเอกสารจากภาควิชา
							</span>
						</h5>
					</div>

					<ViewMyEmployer />

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faFilePdf} className="text-light-blue" />{" "}
							เอกสารจากภาควิชา
						</p>
						<ul>
							<li>หนังสือขอความอนุเคราะห์ฝึกงาน</li>
							<li>หนังสือส่งตัวจากทางภาควิชา</li>
						</ul>
					</div>
				</div>
			);
		} else if (status === "3") {
			return (
				<div
					className={`stdStatusDetail border border-${statusColors.s03} rounded p-2`}
				>
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							สถานะ :{" "}
							<span className={`text-${statusColors.s03}`}>
								อยู่ระหว่างการฝึกงาน
							</span>
						</h5>
					</div>

					<ViewMyEmployer />

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faListCheck} className="text-light-blue" />{" "}
							สิ่งที่ต้องทำระหว่างการฝึกงาน
						</p>
						<ul>
							<li>ไปฝึกงานตามวันเวลาที่กำหนด</li>
							<li>กรอกใบบันทึกเวลา และบันทึกข้อมูลว่าวันนี้ทำอะไรบ้าง</li>
						</ul>
					</div>

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faFilePdf} className="text-light-blue" />{" "}
							เอกสารจากภาควิชา
						</p>
						<ul>
							<li>
								<Link to={"/student/documents"}>
									หนังสือขอความอนุเคราะห์ฝึกงาน
								</Link>
							</li>
							<li>
								<Link to={"/student/documents"}>
									หนังสือส่งตัวจากทางภาควิชา
								</Link>
							</li>
						</ul>
					</div>

					<div className="d-flex flex-column flex-lg-row justify-content-end align-items-center">
						<p className="fw-bold mb-0">
							<span className="text-danger">*</span>{" "}
							หากนักศึกษาไปฝึกงานเสร็จเรียบร้อยแล้ว ให้กดปุ่ม
							"เสร็จสิ้นการฝึกงาน" เพื่อที่จะสามารถอัปโหลดเอกสารต่าง ๆ ต่อไป
						</p>
						<button
							className={`btn btn-info mt-2 mt-lg-auto ms-lg-2 text-white`}
							onClick={handleConfirm}
						>
							<FontAwesomeIcon icon={faCheck} /> เสร็จสิ้นการฝึกงาน
						</button>
					</div>
				</div>
			);
		} else if (status === "4") {
			return (
				<div
					className={`stdStatusDetail border border-${statusColors.s04} rounded p-2`}
				>
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							สถานะ :{" "}
							<span className={`text-${statusColors.s04}`}>
								หลังเสร็จสิ้นการฝึกงาน
							</span>
						</h5>
					</div>

					<ViewMyEmployer />

					<div className="toDo my-2">
						<p className="fw-bold mb-auto">
							<FontAwesomeIcon icon={faListCheck} className="text-light-blue" />{" "}
							สิ่งที่ต้องทำหลังจากการฝึกงานเสร็จสิ้น
						</p>
						<ul>
							<li>
								<Link to={"/student/upload"}>
									อัปโหลดไฟล์เอกสารต่าง ๆ (รายงาน, ใบบันทึกเวลา, ไฟล์นำเสนอ)
								</Link>
							</li>
							<li>
								<Link to={"/student/evaluation"}>
									ทำแบบประเมินบริษัท/หน่วยงานที่ไปฝึกงาน
								</Link>
							</li>
							<li>
								<Link to={"https://acrd.engr.tu.ac.th/apprentice/"}>
									กรอกข้อมูลการฝึกงานให้คณะ
								</Link>
							</li>
						</ul>
					</div>
				</div>
			);
		} else {
			return (
				<div className="stdStatusDetail">
					<p>not ok</p>
				</div>
			);
		}
	}

	function ViewMyEmployer() {
		return (
			<div>
				<p className="fw-bold mb-auto">
					<FontAwesomeIcon icon={faBuilding} className="text-light-blue" />{" "}
					ข้อมูลที่ฝึกงานของฉัน
				</p>
				<ul>
					<li>
						<Link to={"/student/my-employer"}>ดูข้อมูลที่ฝึกงาน</Link>
					</li>
				</ul>
			</div>
		);
	}

	function ToDoList({ status }) {
		const isChecked = (s) => {
			const parseCurrentStatus = parseInt(status);
			const parseStatus = parseInt(s);
			let icon;

			if (parseCurrentStatus > parseStatus) {
				icon = (
					<FontAwesomeIcon icon={faSquareCheck} className="text-light-blue" />
				);
			} else if (parseCurrentStatus === parseStatus) {
				icon = (
					<FontAwesomeIcon icon={faHourglassHalf} className="text-light-blue" />
				);
			} else {
				icon = (
					<FontAwesomeIcon icon={faRegularSquare} className="text-light-blue" />
				);
			}
			return icon;
		};

		return (
			<div className="toDoList">
				<ul className="list-group list-group-flush">
					<div>
						<li className="list-group-item">
							{status === "0" ? isChecked("0") : isChecked("1")}{" "}
							ขั้นตอนการหาที่ฝึกงาน
						</li>
						<li className="list-group-item">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									{/* {status === "1" ? (
										isChecked("1")
									) : isChecked("999") ? (
										status === "2" ? (
											isChecked("-1")
										) : (
											isChecked("1")
										)
									) : (
										<></>
									)}{" "} */}
									สมัครฝึกงานในระบบ หรือ ยื่นที่ฝึกงานเอง
								</li>
							</ul>
						</li>
					</div>
					<br />

					<div>
						<li className="list-group-item">
							{isChecked("2")} รอการอนุมัติเอกสารจากภาควิชา
						</li>
						<li className="list-group-item">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">หนังสือขอความอนุเคราะห์</li>
								<li className="list-group-item">หนังสือส่งตัว</li>
							</ul>
						</li>
					</div>
					<br />

					<div>
						<li className="list-group-item">
							{isChecked("3")} ขั้นตอนระหว่างการฝึกงาน (ระยะเวลา 2 เดือน
							หรือไม่ต่ำกว่า 240 ชม.)
						</li>
						<li className="list-group-item">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">เซ็นใบบันทึกเวลาทุกวัน</li>
							</ul>
						</li>
					</div>
					<br />

					<div>
						{/* <li className="list-group-item">
							{isChecked("4")} ขั้นตอนหลังจากฝึกงานเสร็จ
						</li> */}
						<li className="list-group-item">ขั้นตอนหลังจากฝึกงานเสร็จ</li>
						<li className="list-group-item">
							<ul className="list-group list-group-flush">
								<li className="list-group-item">ส่งใบบันทึกเวลา</li>
								<li className="list-group-item">ส่งรายงาน</li>
								<li className="list-group-item">ส่งสไลด์นำเสนอ</li>
								<li className="list-group-item">ทำแบบประเมิน</li>
							</ul>
						</li>
					</div>
				</ul>

				{/* <p>
					[ ] ขั้นตอนการหาที่ฝึกงาน [ ] ไปที่ยื่นที่ฝึกงานเอง/ไปที่หน้าหลัก
					(สมัครฝึกงาน) [ ] ขั้นตอนระหว่างการฝึกงาน (ระยะเวลา 2 เดือน
					หรือไม่ต่ำกว่า 240 ชม.) เซ็นใบบันทึกเวลาทุกวัน [ ]
					ขั้นตอนหลังจากฝึกงานเสร็จ [ ] ส่งรายงาน [ ] ส่งใบบันทึกเวลา [ ]
					ทำแบบประเมิน
				</p> */}
			</div>
		);
	}
}

export default StdInternship;
