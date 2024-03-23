import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "axios";
import { getPost } from "../services/user.service";

import parse from "html-react-parser";
import DOMPurify from "dompurify";

import btn from "../components/btn.module.css";
import employerDefaultImg from "../assets/employer_default_img.png";
import { Button, Modal, Dropdown } from "react-bootstrap";
import PageNotFound from "./PageNotFound";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLocationDot,
	faPerson,
	faBahtSign,
	faClock,
	faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import HtmlParser from "../components/HtmlParser";

export default function JobDetail() {
	const params = useParams();
	const navigate = useNavigate();

	// let parsedPositions;
	const [jobData, setJobData] = useState(null);
	const [jobPostDesc, setJobPostDesc] = useState(null);
	const [parsedPositions, setparsedPositions] = useState(null);
	const [isApply, setIsApply] = useState(false);
	const [apiResponse, setApiResponse] = useState(null);
	const goBack = () => navigate(-1);
	const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
	const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [dropdownOptions, setDropdownOptions] = useState([]);

	const currentDate = Date.now();
	const startPostDate = new Date(jobData.post.dateStartPost);
	const isPostNotStart = currentDate < startPostDate;

	const [loading, setLoading] = useState(true);

	// const loadData = async () => {
	// 	await getPost(params.jobId)
	// 		.then((res) => {
	// 			const job = res.data;
	// 			const parsedPositions =
	// 				typeof job.post.cat === "string"
	// 					? JSON.parse(job.post.cat)
	// 					: job.post.cat;
	// 			setJobData(job);
	// 			setparsedPositions(parsedPositions);
	// 		})
	// 		.catch((err) => {
	// 			console.log(
	// 				"Load data failed: ",
	// 				err.response ? err.response.data : err.message
	// 			);
	// 		});
	// };
	const fetchData = async () => {
		try {
			const response = await getPost(params.jobId);

			if (response.status >= 200 && response.status < 300) {
				const job = response.data;

				if (job) {
					let positionsArray;

					if (typeof job.post.cat === "string") {
						positionsArray = JSON.parse(job.post.cat);
					} else {
						positionsArray = job.post.cat;
					}
					positionsArray = JSON.parse(positionsArray);
					// console.log("positionsArray:", positionsArray);
					setparsedPositions(positionsArray);
					setJobData(job);
					setDropdownOptions(positionsArray);

					setJobPostDesc(job.post.desc);
				} else {
					setJobData(null);
				}
			} else {
				throw new Error(`Failed to fetch data. Status: ${response.status}`);
			}
		} catch (error) {
			console.error("Error fetching data:", error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [params.jobId]);

	const { user } = useSelector((state) => ({ ...state }));

	const handleApplyClick = () => {
		if (user.user.token && user.user.role === "student") {
			setIsApplyModalOpen(true);
		} else {
			navigate("/internal/login");
		}
	};

	const handleApplyModalClose = () => {
		setIsApplyModalOpen(false);
	};

	const handleDropdownSelect = (eventKey) => {
		setSelectedOption(eventKey);
	};

	const handleConfirmeApplyModal = async () => {
		try {
			if (selectedOption) {
				const applyWork = {
					job_id: jobData.post.job_id,
					position: selectedOption,
				};
				const response = await axios.post(
					"http://localhost:5500/api/createApply",
					applyWork,
					{
						headers: {
							authtoken: user.user.token,
						},
					}
				);
				setApiResponse(response.data);

				console.log(response);
				setIsApplyModalOpen(false);
				setIsResponseModalOpen(true);
			} else {
				console.error("No option selected");
			}
		} catch (error) {
			setIsApplyModalOpen(false);
			setIsResponseModalOpen(true);
			setApiResponse(error.response.data);
			console.error(error);
		}
	};

	const ResponseModal = () => {
		return (
			<Modal
				show={isResponseModalOpen}
				onHide={() => setIsResponseModalOpen(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title className="fw-bold">สมัครฝึกงาน</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{apiResponse ? <p>{apiResponse.message}</p> : <p>Loading...</p>}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setIsResponseModalOpen(false)}
					>
						ปิด
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	if (loading) {
		return <Loading />;
	}
	if (!jobData) {
		return <PageNotFound />;
	}

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
				<div className="container p-1 p-sm-2 px-sm-4 jobNavigationCard">
					<div className="d-flex justify-content-between">
						<a className={`a-text`} onClick={goBack}>
							ย้อนกลับ
						</a>
						<></>
					</div>
				</div>

				<div className="row">
					<div className="col-lg-8">
						<div className="container p-3 p-sm-4 mt-3 container-card jobDetailCard bg-light-blue">
							<div className="row">
								<div className="col-12 col-md-3 col-xxl-2 d-flex justify-content-md-center justify-content-lg-start">
									<div className="job-card-img mb-3 mb-md-0">
										<img
											src={
												jobData.profile.company_pic
													? jobData.profile.company_pic
													: employerDefaultImg
											}
											alt="Company Logo Image"
											className="img-fluid"
										/>
									</div>
									<div className="job-header-hidden d-block d-md-none px-3">
										<div className="job-card-title">
											{jobData ? (
												<h5 className="fw-bold">{jobData.post.job_title}</h5>
											) : (
												<p className="text-muted">กำลังโหลดข้อมูล...</p>
											)}
										</div>
										<div className="fw-bold">
											{jobData ? (
												<span>{jobData.profile.company_name}</span>
											) : (
												<p className="text-muted">กำลังโหลดข้อมูล...</p>
											)}
										</div>
										<small className="text-muted">
											รับสมัคร :{" "}
											{jobData ? (
												<>
													{jobData.post.dateStartPost} ถึง{" "}
													{jobData.post.dateEndPost}
												</>
											) : (
												<>กำลังโหลดข้อมูล...</>
											)}
										</small>
									</div>
								</div>

								<div className="col-12 col-md-6 col-xxl-7">
									<div className="job-card-details">
										<div className="job-card-title d-none d-md-block fw-bold">
											{jobData ? (
												<h5 className="fw-bold">{jobData.post.job_title}</h5>
											) : (
												<p className="text-muted">กำลังโหลดข้อมูล...</p>
											)}
										</div>
										<div className="card-text mt-2 d-none d-md-block">
											<p className="fw-bold">
												{jobData ? (
													<span>{jobData.profile.company_name}</span>
												) : (
													<span className="text-muted">กำลังโหลดข้อมูล...</span>
												)}
											</p>
										</div>
										{/* <p className="card-text mb-1">ประเภทธุรกิจ : </p> */}

										<Link
											to={`/employer/${
												jobData ? jobData.post.emp_id : "PageNotFound"
											}/profile`}
											className={`d-none d-md-block w-50 text-center a-btn ${btn.btn_grey_outline}`}
										>
											ดูโปรไฟล์
										</Link>
										<Link
											to={`/employer/${
												jobData ? jobData.post.emp_id : "PageNotFound"
											}/profile`}
											className={`d-block d-md-none my-2 w-100 text-center a-btn ${btn.btn_grey_outline}`}
										>
											ดูโปรไฟล์
										</Link>
									</div>
								</div>

								<div className="col-12 col-md-3 col-xxl-3">
									<div className="job-actions">
										<p className="card-text">
											<small className="text-muted d-none d-md-block">
												รับสมัคร :{" "}
												{jobData ? (
													<>
														{jobData.post.dateStartPost} ถึง{" "}
														{jobData.post.dateEndPost}
													</>
												) : (
													<>กำลังโหลดข้อมูล...</>
												)}
											</small>
										</p>
									</div>
								</div>
							</div>

							{/* <div className="row mt-4">
								<div className="col-sm-12 jobAbout">
										<p className="fw-bold">เกี่ยวกับเรา</p>

										{jobData ? (
											<h6>{jobData.profile.about}</h6>
										) : (
											<p className="text-muted">-</p>
										)}
									</div>
							</div> */}
						</div>

						<SideCard displayClass={"d-block d-lg-none"} />

						<div className="container p-3 p-sm-4 mt-3 container-card jobInfoCard2">
							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">ตำแหน่งฝึกงานที่เปิดรับ</h5>
								</div>
								<div className="mt-2 mt-sm-0">
									{jobData ? (
										<>
											{parsedPositions && (
												<>
													{Array.isArray(parsedPositions) &&
														parsedPositions.map((position, index) => (
															<h6 key={index}>- {position}</h6>
														))}
												</>
											)}
										</>
									) : (
										<p>กำลังโหลดข้อมูล...</p>
									)}
								</div>
							</div>

							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">รายละเอียดงาน</h5>
								</div>
								<div id="quill-postDesc" className="mt-2 mt-sm-0">
									{jobData ? (
										<>
											<HtmlParser htmlString={jobPostDesc} />
										</>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
									{/* {jobPostDesc} */}
								</div>
							</div>

							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">คุณสมบัติผู้สมัคร</h5>
								</div>
								<div className="mt-2 mt-sm-0">
									{jobData ? (
										<h6>{jobData.post.qualifications}</h6>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
								</div>
							</div>

							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">สวัสดิการ</h5>
								</div>
								<div className="mt-2 mt-sm-0">
									{jobData ? (
										<h6>{jobData.post.welfare}</h6>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
								</div>
							</div>

							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">สถานที่ปฏิบัติงาน</h5>
								</div>
								<div className="mt-2 mt-sm-0">
									{jobData ? (
										<>
											<span>{jobData.post.location}</span>
											<br />
											<span>
												{jobData.post.subdistrict}, {jobData.post.district},{" "}
												{jobData.post.province}, {jobData.post.pcode}
											</span>
										</>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
								</div>
							</div>

							<div className="mb-5">
								<div className="d-flex justify-content-between mb-2">
									<h5 className="fw-bold">รายละเอียดเพิ่มเติม</h5>
								</div>
								<div className="mt-2 mt-sm-0">
									{jobData ? (
										<h6>{jobData.post.other}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="col-lg-4">
						<SideCard displayClass={"d-none d-lg-block"} />
					</div>
				</div>
			</div>

			<Modal show={isApplyModalOpen} onHide={handleApplyModalClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>สมัครฝึกงาน</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{/* เพิ่มเนื้อหาตรงนี้ */}
					<p>
						คุณต้องการสมัครฝึกงานกับ{" "}
						<span className="fw-bold">{jobData.profile.company_name}</span>
					</p>
					<div className="d-flex">
						<p className="me-2">ในตำเเหน่ง : </p>
						<Dropdown onSelect={handleDropdownSelect}>
							<Dropdown.Toggle variant="dark" id="dropdown-basic">
								{selectedOption || "Select Option"}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								{dropdownOptions.map((option, index) => (
									<Dropdown.Item key={index} eventKey={option}>
										{option}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleApplyModalClose}>
						ปิด
					</Button>
					<Button
						className={`${btn.btn_blue}`}
						onClick={handleConfirmeApplyModal}
					>
						ยืนยัน
					</Button>
				</Modal.Footer>
			</Modal>

			<ResponseModal />
		</>
	);

	function SideCard({ displayClass }) {
		return (
			<div
				className={`container p-3 p-sm-4 mt-3 sticky-lg-top ${displayClass} container-card jobInfoCard1 bg-light-blue`}
			>
				{/* <div className="d-flex flex-column flex-md-row justify-content-sm-between text-md-center p-2"> */}
				{jobData ? (
					<>
						<div className="mb-4">
							<p className="fw-bold mb-2">
								<FontAwesomeIcon icon={faBuilding} /> บริษัท/หน่วยงาน
							</p>
							{jobData ? (
								<p>{jobData.profile.company_name}</p>
							) : (
								<p className="text-muted">กำลังโหลดข้อมูล...</p>
							)}
						</div>
						<div className="mb-4">
							<p className="fw-bold mb-2">
								<FontAwesomeIcon icon={faLocationDot} /> สถานที่ปฏิบัติงาน
							</p>
							{jobData ? (
								<>
									<span>{jobData.post.location}</span>
									<br />
									<span>
										{jobData.post.subdistrict}, {jobData.post.district},{" "}
										{jobData.post.province}, {jobData.post.pcode}
									</span>
								</>
							) : (
								<p className="text-muted">กำลังโหลดข้อมูล...</p>
							)}
						</div>
						<div className="mb-4">
							<p className="fw-bold mb-2">
								<FontAwesomeIcon icon={faPerson} /> จำนวนรับ
							</p>
							{jobData ? (
								<p>{jobData.post.position_num}</p>
							) : (
								<p className="text-muted">กำลังโหลดข้อมูล...</p>
							)}
						</div>
						<div className="mb-4">
							<p className="fw-bold mb-2">
								<FontAwesomeIcon icon={faBahtSign} /> เบี้ยเลี้ยง
							</p>
							{jobData ? (
								<p>{jobData.post.salary}</p>
							) : (
								<p className="text-muted">กำลังโหลดข้อมูล...</p>
							)}
						</div>
						<div className="mb-4">
							<p className="fw-bold mb-2">
								<FontAwesomeIcon icon={faClock} /> เวลาทำงาน
							</p>
							{jobData ? (
								<p>{jobData.post.work_hours}</p>
							) : (
								<p className="text-muted">กำลังโหลดข้อมูล...</p>
							)}
						</div>

						<div className="">
							{user &&
							(user.user.role === "admin" ||
								user.user.role === "head" ||
								user.user.role === "teacher" ||
								user.user.role === "employer") ? (
								""
							) :isPostNotStart?(<>
								<Button
									className={`${btn.btn_red} w-100`}
									
								>
									ยังไม่เปิดให้สมัคร
								</Button>
							</>) 
							: (
								<>
									<Button
										className={`${btn.btn_blue} w-100`}
										onClick={handleApplyClick}
									>
										สมัครฝึกงานนี้
									</Button>
								</>
							)}
						</div>
					</>
				) : (
					<p className="text-muted">กำลังโหลดข้อมูล...</p>
				)}
				{/* </div> */}
			</div>
		);
	}
}
