import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import employerDefaultImg from "../assets/employer_default_img.png";
import Loading from "../components/Loading";
import PageNotFound from "./PageNotFound";

import { getEmployerProfileId as getEmployerProfile } from "../services/user.service";

function EmployerProfile() {
	const params = useParams();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	// const { user } = useSelector((state) => ({ ...state }));

	const fetchData = async () => {
		try {
			const response = await getEmployerProfile(params.employerId);
			const employer = response.data;

			if (employer) {
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

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
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
															? `http://localhost:5500/uploads/${data.profile.company_pic}`
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
							ตำแหน่งฝึกงานที่เปิดรับ
						</h4>
					</div>

					<div className="employerJob">
						{data.post.length ? (
							<>
								{data.post
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
									))}

								{/* <div className="text-center mt-4">
									<Link to={"/alljob"}>
										<button className={`${btn.btn_blue} w-100`}>
											ดูที่ฝึกงานทั้งหมด
										</button>
									</Link>
								</div> */}
							</>
						) : (
							<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-50 text-muted bg-light container-card">
								<h4>ยังไม่มีตำแหน่งฝึกงานที่เปิดรับในระบบ</h4>

								<small>
									- บริษัท/หน่วยงาน สามารถประกาศรับนักศึกษาฝึกงานได้ที่ :{" "}
									<span className="text-light-blue">
										<Link to={"/employer/create-job"}>+ ประกาศรับฝึกงาน</Link>
									</span>
								</small>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default EmployerProfile;
