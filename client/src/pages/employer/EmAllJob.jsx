import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Job from "../../components/Job";
import btn from "../../components/btn.module.css";
import Loading from "../../components/Loading";

import { getEmployerProfile } from "../../services/user.service";

function EmAllJob() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const { user } = useSelector((state) => ({ ...state }));

	const fetchData = async (authtoken) => {
		try {
			const response = await getEmployerProfile(authtoken);
			setData(response.data);
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
		fetchData(user.user.token);
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container p-3 p-md-4 container-card employerJobCard">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="employerJobTitle fw-bold">
					โพสต์ทั้งหมด ({data.length ? "-" : data.post.length})
				</h3>
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
					</>
				) : (
					<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
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
	);

	// function Job({ id, title, company, place, allowance, positions, created }) {
	// 	return (
	// 		<Link to={`/job/${id}`}>
	// 			<div className="job-card" key={id}>
	// 				<div className="row">
	// 					<div
	// 						className="col-12 col-md-3 col-xl-2 d-flex"
	// 						style={{ minWidth: "120px" }}
	// 					>
	// 						<div className="job-card-img mb-3 mb-md-0">
	// 							<img
	// 								src="https://picsum.photos/120"
	// 								alt="Company Logo Image"
	// 								className="img-fluid"
	// 							/>
	// 						</div>
	// 						<div className="job-header-hidden d-block d-md-none px-3">
	// 							<h5 className="job-card-title">
	// 								บริษัท {company} รับนักศึกษาฝึกงาน
	// 							</h5>
	// 							<small className="text-muted">วันที่ลงประกาศ : {created}</small>
	// 						</div>
	// 					</div>
	// 					<div className="col-12 col-md-6 col-xl-7">
	// 						<div className="job-card-details">
	// 							<h5 className="job-card-title d-none d-md-block">
	// 								บริษัท {company} รับนักศึกษาฝึกงาน
	// 							</h5>
	// 							<p className="card-text mb-1">
	// 								ตำแหน่ง :{" "}
	// 								{positions.map((position, index) => (
	// 									<React.Fragment key={index}>
	// 										{index > 0 && ", "}
	// 										<span style={{ color: "grey" }}>{position}</span>
	// 									</React.Fragment>
	// 								))}
	// 							</p>
	// 							<p className="card-text mb-1">สถานที่ : {place}</p>
	// 							<p className="card-text mb-1">เบี้ยเลี้ยง : {allowance}</p>
	// 						</div>
	// 					</div>
	// 					<div className="col-12 col-md-3 col-xl-3">
	// 						<div className="job-actions">
	// 							<p className="card-text">
	// 								<small className="text-muted d-none d-md-block">
	// 									วันที่ลงประกาศ : {created}
	// 								</small>
	// 							</p>

	// 							<button className={`${btn.btn_blue_outline} w-50`}>
	// 								แก้ไข
	// 							</button>
	// 							<button className={`btn btn-outline-danger w-50`}>ลบ</button>
	// 						</div>
	// 					</div>
	// 				</div>
	// 			</div>
	// 		</Link>
	// 	);
	// }
}

export default EmAllJob;
