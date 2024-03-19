import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Job from "../components/Job";
import btn from "../components/btn.module.css";
import Loading from "../components/Loading";

import axios from "axios";

function AllJob() {
	const [jobData, setJobData] = useState(null); // should be null or empty array?
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5500/api/listPosts");

			if (response.data) {
				setJobData(response.data);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
				<div className="fw-bold mb-4">
					<Link to={"/"}>หน้าหลัก</Link>
					<span>{` > `}</span>
					<Link to={"/alljob"}>ตำแหน่งฝึกงานทั้งหมด</Link>
				</div>

				<div className="row justify-content-center">
					<h3 className="my-4 mb-sm-5 fw-bold">
						ตำแหน่งฝึกงานทั้งหมด ({jobData && jobData.length})
					</h3>
					<div className="col-12 col-lg-9">
						{jobData ? (
							<>
								{jobData
									.slice()
									.reverse()
									.map((item) => (
										<div key={item.job_id} className="mb-2">
											<Job
												key={item.job_id}
												id={item.job_id}
												img={item.employer.company_pic}
												title={item.job_title}
												company={item.employer.company_name}
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
							</>
						) : (
							<PostIsNull />
						)}
					</div>

					<div className="col-12 col-lg-3 my-5 my-lg-0">
						{/* <div className="d-none d-lg-block">
							<div className="d-flex justify-content-between">
								<p>
									<span className="fw-bold">ข่าวประชาสัมพันธ์ - </span>
									<Link to={"/news"}>ดูทั้งหมด</Link>
								</p>
							</div>
							{newsItems ? (
								<>
									{newsItems.map((item) => (
										<>
											<div key={item.id} className="">
												<NewsComponentB
													id={item.id}
													cover_img={item.imageUrl}
													title={item.title}
													content={item.content}
													postedTime={item.postedTime}
												/>
											</div>
										</>
									))}
								</>
							) : (
								<NewsIsNull />
							)}
						</div> */}
					</div>
				</div>
			</div>
		</>
	);

	function PostIsNull() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
				<h4>ยังไม่มีตำแหน่งฝึกงานที่เปิดรับในระบบ</h4>
				<small>
					- นักศึกษา สามารถยื่นฝึกงานเองได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/student/self-enroll"}>ยื่นที่ฝึกงานเอง</Link>
					</span>
				</small>
				<small>
					- บริษัท/หน่วยงาน สามารถประกาศรับนักศึกษาฝึกงานได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/employer/create-job"}>+ ประกาศรับฝึกงาน</Link>
					</span>
				</small>
			</div>
		);
	}
}

export default AllJob;
