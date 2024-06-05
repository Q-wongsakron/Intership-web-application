import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import employerDefaultImg from "../assets/employer_default_img.png";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faChevronRight,
	faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

import { getEmployerProfileId as getEmployerProfile } from "../services/user.service";

function EmployerProfile() {
	const params = useParams();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const goBack = () => navigate(-1);

	const fetchData = async () => {
		try {
			const response = await getEmployerProfile(params.employerId);
			const employer = response.data;

			if (employer) {
				// if (employer.post) {
				// 	const currentDate = new Date();
				// 	employer.post = employer.post.filter(
				// 		(item) => new Date(item.dateEndPost) > currentDate
				// 	);
				// }
				setData(employer);
			} else {
				setData(null);
			}
		} catch (error) {
			console.log(
				"Load data failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	// const mappedData = data.map((item) => ({
	// 	job_id: item.job_id,
	// 	company_pic: item.profile.company_pic,
	// 	location: item.location,
	// 	salary: item.salary,
	// 	positions: Array.isArray(item.cat)
	// 		? item.cat
	// 		: typeof item.cat === "string"
	// 		? JSON.parse(item.cat)
	// 		: [],
	// 	dateStartPost: item.dateStartPost,
	// 	dateEndPost: item.dateEndPost,
	// }));

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [params.employerId]);

	if (loading) {
		return <Loading />;
	}
	if (!data) {
		return <PageNotFound />;
	}

	const maxCompanyNameLength = 35;
	let truncatedCompanyName = loading
		? "Loading..."
		: data?.profile?.company_name.slice(0, maxCompanyNameLength);
	if (data?.profile?.company_name.length > maxCompanyNameLength) {
		truncatedCompanyName += "...";
	}

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
				{/* <div className="container p-1 p-sm-2 px-sm-4 jobNavigationCard">
					<div className="d-flex justify-content-between">
						<a className={`a-text`} onClick={goBack}>
							ย้อนกลับ
						</a>
						<></>
					</div>
				</div> */}

				<div className="fw-bold mb-4">
					<Link to={"/"}>หน้าหลัก</Link>
					<span>{` > `}</span>
					<span>บริษัท/หน่วยงาน</span>
					<span>
						{data?.profile?.company_name ? ` > ` + truncatedCompanyName : ""}
					</span>
				</div>

				<div className="container p-2 p-sm-4 container-card employerProfileDetailCard bg-light-blue">
					{/* <div className="d-flex justify-content-between">
						<h3 className="std-profile-title mb-3 fw-bold">ข้อมูลของฉัน</h3>
						<button className="btn btn-secondary d-none">แก้ไขข้อมูล</button>
					</div> */}

					<div className="row">
						<div className="col-12">
							<div className="employerProfileDetail px-2 pt-3">
								<div className="d-flex justify-content-start">
									<div className="d-flex flex-row employerTitle">
										<div className="employer-card-img">
											<div className="job-card-img mb-3 mb-md-0 me-3">
												<img
													src={
														data.profile.company_pic
															? import.meta.env.VITE_FILE_API +
															  `/uploads/${data.profile.company_pic}`
															: employerDefaultImg
													}
													alt="Company Logo Image"
													className="img-fluid"
												/>
											</div>
										</div>
										<div className="employerTitleText">
											{data ? (
												<h4 className="fw-bold">{data.profile.company_name}</h4>
											) : (
												<p className="text-muted">กำลังโหลดข้อมูล...</p>
											)}
										</div>
									</div>
									{/* <div className="mt-2 mt-sm-0 employerAction">
										<button className={`btn btn-sm ${btn.btn_grey_outline}`}>
											ดูเว็บไซต์
										</button>
									</div> */}
								</div>
								<div className="row mt-4">
									<div className="col-sm-12 employerAbout">
										<p className="fw-bold">เกี่ยวกับเรา</p>
										{data.profile.about ? (
											<h6>{data.profile.about}</h6>
										) : (
											<p className="text-muted">-</p>
										)}
									</div>
								</div>
								<div className="row mt-4">
									<div className="col-sm-12 employerLocation">
										<p className="fw-bold">ที่ตั้งบริษัท/หน่วยงาน</p>
										{data ? (
											<>
												<h6>{data.profile.address} </h6>
												<h6>
													ตำบล/แขวง {data.profile.subdistrict}, อำเภอ/เขต{" "}
													{data.profile.district}, จังหวัด{" "}
													{data.profile.province}, รหัสไปรษณีย์{" "}
													{data.profile.pcode}
												</h6>
											</>
										) : (
											<p className="text-muted">กำลังโหลดข้อมูล...</p>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container p-2 p-sm-4 mt-4 container-card employerJobCard">
					<div className="d-flex justify-content-between mb-4">
						<h4 className="employerJobTitle fw-bold">
							ตำแหน่งฝึกงานที่เปิดรับ ({data.post.length ? data.post.length : 0}
							)
						</h4>
					</div>

					<div className="employerJob">
						{data.post.length ? (
							<>
								{/* {data.post
									.slice()
									.reverse()
									.map((item) => (
										<div key={item.job_id} className="mb-2">
											<Job
												key={item.job_id}
												id={item.job_id}
												img={data.profile.company_pic}
												title={item.job_title}
												company={data.profile.company_name}
												location={item.location}
												allowance={item.salary}
												positions={
													Array.isArray(item.cat)
														? item.cat
														: typeof item.cat === "string"
														? JSON.parse(item.cat)
														: []
												}
												startPost={item.dateStartPost}
												endPost={item.dateEndPost}
											/>
										</div>
									))} */}

								{/* <div className="text-center mt-4">
									<Link to={"/alljob"}>
										<button className={`${btn.btn_blue} w-100`}>
											ดูที่ฝึกงานทั้งหมด
										</button>
									</Link>
								</div> */}

								<PaginationBar data={data} />
							</>
						) : (
							<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-50 text-muted bg-light container-card">
								<h4>ยังไม่มีตำแหน่งฝึกงานที่เปิดรับในระบบ</h4>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);

	function PaginationBar({ data }) {
		const sliceReverseData = data.post.slice().reverse();

		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 4;

		const indexOfLastItem = currentPage * itemsPerPage;
		const indexOfFirstItem = indexOfLastItem - itemsPerPage;

		const firstIndexOfPage = indexOfFirstItem + 1;
		const lastIndexOfPage = Math.min(indexOfLastItem, data.post.length);

		const currentItems = sliceReverseData.slice(
			indexOfFirstItem,
			indexOfLastItem
		);
		const totalPages = Math.ceil(sliceReverseData.length / itemsPerPage);

		const handlePageChange = (newPage) => {
			if (newPage >= 1 && newPage <= totalPages) {
				setCurrentPage(newPage);
			}
		};

		const calculatePageNumbers = () => {
			const pageNumbers = [];
			const pageRange = 3;
			const startPage = Math.max(1, currentPage - pageRange);
			const endPage = Math.min(totalPages, currentPage + pageRange);

			if (startPage > 1) {
				pageNumbers.push(1);
				if (startPage > 2) {
					pageNumbers.push("...");
				}
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(i);
			}

			if (endPage < totalPages) {
				if (endPage < totalPages - 1) {
					pageNumbers.push("...");
				}
				pageNumbers.push(totalPages);
			}

			return pageNumbers;
		};

		const pageNumbers = calculatePageNumbers();

		return (
			<div>
				{currentItems.map((item, index) => (
					<div key={index} className="mb-2">
						<Job
							key={item.job_id}
							id={item.job_id}
							img={data.profile.company_pic}
							title={item.job_title}
							company={data.profile.company_name}
							location={item.location}
							allowance={item.salary}
							positions={
								Array.isArray(item.cat)
									? item.cat
									: typeof item.cat === "string"
									? JSON.parse(item.cat)
									: []
							}
							startPost={item.dateStartPost}
							endPost={item.dateEndPost}
						/>
					</div>
				))}

				<div className="d-flex justify-content-between">
					<div>{`${firstIndexOfPage} - ${lastIndexOfPage} จากทั้งหมด ${data.post.length} รายการ`}</div>

					<div
						className="btn-toolbar"
						role="toolbar"
						aria-label="Toolbar with button groups"
					>
						<div
							className="btn-group btn-group-sm"
							role="group"
							aria-label="First group"
						>
							<button
								type="button"
								className="btn btn-outline-secondary"
								disabled={currentPage === 1}
								onClick={() => handlePageChange(currentPage - 1)}
								style={{
									cursor: "pointer",
								}}
							>
								<FontAwesomeIcon icon={faChevronLeft} />
							</button>
							{pageNumbers.map((pageNumber, index) => (
								<React.Fragment key={index}>
									{pageNumber === currentPage ? (
										<>
											<button
												type="button"
												className="btn btn-dark"
												onClick={() =>
													typeof pageNumber === "number"
														? handlePageChange(pageNumber)
														: null
												}
												style={{
													cursor:
														typeof pageNumber === "number"
															? "pointer"
															: "default",
												}}
											>
												{pageNumber}
											</button>
										</>
									) : (
										<>
											<button
												type="button"
												className="btn btn-outline-secondary"
												onClick={() =>
													typeof pageNumber === "number"
														? handlePageChange(pageNumber)
														: null
												}
												style={{
													cursor:
														typeof pageNumber === "number"
															? "pointer"
															: "default",
												}}
											>
												{pageNumber}
											</button>
										</>
									)}
								</React.Fragment>
							))}
							<button
								type="button"
								className="btn btn-outline-secondary"
								disabled={currentPage === totalPages}
								onClick={() => handlePageChange(currentPage + 1)}
								style={{
									cursor: "pointer",
								}}
							>
								<FontAwesomeIcon icon={faChevronRight} />
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EmployerProfile;
