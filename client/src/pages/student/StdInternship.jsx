import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Job from "../../components/Job";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";

import { useSelector } from "react-redux";

import { getStudentProfile } from "../../services/user.service";

function StdInternship() {
	const [applyData, setApplyData] = useState([]);
	const [stdData, setStdData] = useState([]);
	const [loading, setLoading] = useState(true);

	const { user } = useSelector((state) => ({ ...state }));

	const fetchData = async (authtoken) => {
		try {
			const response = await axios.get("http://localhost:5500/api/myStatus", {
				headers: {
					authtoken: user.user.token,
				},
			});
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
	}, []);

	if (loading) {
		return <Loading />;
	}

	console.log(stdData);

	return (
		<>
			<div className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">การฝึกงานของฉัน</h3>
				</div>

				<div
					id="stdInternshipStatus"
					className="row justify-content-center text-center text-white stdInternshipStatus"
				>
					<div
						className={`col-3 py-3 rounded-start ${
							stdData.status === "1" || stdData.status === "0"
								? "bg-blue"
								: "bg-dark bg-opacity-25"
						}`}
					>
						<h5 className="m-0">หาที่ฝึกงาน</h5>
					</div>
					
					
					<div
						className={`col-3 py-3 border-start border-end ${
							stdData.status === "2" ? "bg-blue" : "bg-dark bg-opacity-25"
						}`}
					>
						<h5 className="m-0">รอเอกสารจากภาควิชา</h5>
					</div>

					<div
						className={`col-3 py-3 border-start border-end ${
							stdData.status === "3" ? "bg-blue" : "bg-dark bg-opacity-25"
						}`}
					>
						<h5 className="m-0">ระหว่างฝึกงาน</h5>
					</div>

					<div
						className={`col-3 py-3 rounded-end ${
							stdData.status === "4" ? "bg-blue" : "bg-dark bg-opacity-25"
						}`}
					>
						<h5 className="m-0">หลังฝึกงาน</h5>
					</div>
				</div>

				<div className="mt-4">
					{stdData ? (
						<StudentStatus status={stdData.status} applyData={applyData} />
					) : (
						<p>something</p>
					)}
				</div>

				{/* <div className="mt-4">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							รอการตอบรับการสมัคร
						</h5>
					</div>
					<div className="mt-2 mt-sm-0">
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
				</div> */}
			</div>

			<div className="container p-3 p-md-4 mt-4 bg-light container-card">
				<div className="mb-5">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">
							<FontAwesomeIcon icon={faListCheck} className="text-light-blue" />{" "}
							สิ่งที่ต้องทำ (To-do list)
						</h5>
					</div>
					<div className="mt-2 mt-sm-0">
						<p>Check List</p>
					</div>
				</div>
			</div>
		</>
	);

	function StudentStatus({ status, applyData }) {
		if (applyData && (status === "1" || status === "0")) {
			return (
				<div className="stdStatusDetail">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">หาที่ฝึกงาน</h5>
					</div>
					<div className="mt-2 mt-sm-0">
						<p>- สมัครฝึกงานในระบบ</p>
						<p>- ยื่นที่ฝึกงานเอง</p>
					</div>
					{applyData.length !== 0 ? (
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
		}else if (status === "2") {
			return (
				<div className="stdStatusDetail">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">รอเอกสารจากภาควิชา</h5>
					</div>
					<div className="mt-2 mt-sm-0">
						<Link to={"/student/my-employer"}>ข้อมูลที่ฝึกงาน</Link>
						<p>- เอกสารขอความอนุเคราะห์ฝึกงาน</p>
						<p>- หนังสือส่งตัวจากทางภาควิชา</p>
					</div>
					
				</div>
			);
		
		
		}else if (status === "3") {
			return (
				<div className="stdStatusDetail">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">ระหว่างฝึกงาน</h5>
					</div>
					<div className="mt-2 mt-sm-0">
						<Link to={"/student/my-employer"}>ข้อมูลที่ฝึกงาน</Link>
						<p>- เมื่อไหร่จะถึงเวลาเลิก</p>
						<p>- อยากกลับบ้าน</p>
					</div>
					<button>ฝึกงานเสร็จแล้วก็กดไหม?</button>
				</div>
			);
		} else if (status === "4") {
			return (
				<div className="stdStatusDetail">
					<div className="d-flex justify-content-between mb-2">
						<h5 className="fw-bold">หลังฝึกงาน</h5>
					</div>
					<div className="mt-2 mt-sm-0">
						<p>- กลับบ้านดิ</p>
						<p>- ส่งพวกไฟล์รายงานด้วย</p>
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
}

export default StdInternship;
