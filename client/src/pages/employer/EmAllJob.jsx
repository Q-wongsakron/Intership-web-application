import React from "react";

import { Link } from "react-router-dom";
import btn from "../../components/btn.module.css";

function EmAllJob() {
	const mockupObject = {
		title: "รับนักศึกษาฝึกงาน ตำแหน่ง x, y, z",
		company: "com x",
		place: "bkk",
		allowance: 100,
		positions: ["full-stack (3)", "front-end (1)", "back-end (2)"],
		created: "xx/xx/xxxx",
	};

	const duplicatedObjects = [];

	let nextId = 1;

	const numberOfDuplicates = 3;

	for (let i = 0; i < numberOfDuplicates; i++) {
		const copy = { ...mockupObject };
		copy.id = nextId;
		nextId++;

		duplicatedObjects.push(copy);
	}

	return (
		<div className="container p-3 p-sm-4 mt-4 container-card employerJobCard">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="employerJobTitle fw-bold">โพสต์ทั้งหมด</h3>
			</div>
			<div className="employerJob">
				{duplicatedObjects.map((item) => (
					<div key={item.id} className="mb-2">
						<Job
							id={item.id}
							title={item.title}
							company={item.company}
							place={item.place}
							allowance={item.allowance}
							positions={item.positions}
							created={item.created}
						/>
					</div>
				))}
			</div>
		</div>
	);

	function Job({ id, title, company, place, allowance, positions, created }) {
		return (
			<Link to={`/job/${id}`}>
				<div className="job-card" key={id}>
					<div className="row">
						<div
							className="col-12 col-md-3 col-xl-2 d-flex"
							style={{ minWidth: "120px" }}
						>
							<div className="job-card-img mb-3 mb-md-0">
								<img
									src="https://picsum.photos/120"
									alt="Company Logo Image"
									className="img-fluid"
								/>
							</div>
							<div className="job-header-hidden d-block d-md-none px-3">
								<h5 className="job-card-title">
									บริษัท {company} รับนักศึกษาฝึกงาน
								</h5>
								<small className="text-muted">วันที่ลงประกาศ : {created}</small>
							</div>
						</div>
						<div className="col-12 col-md-6 col-xl-7">
							<div className="job-card-details">
								<h5 className="job-card-title d-none d-md-block">
									บริษัท {company} รับนักศึกษาฝึกงาน
								</h5>
								<p className="card-text mb-1">
									ตำแหน่ง :{" "}
									{positions.map((position, index) => (
										<React.Fragment key={index}>
											{index > 0 && ", "}
											<span style={{ color: "grey" }}>{position}</span>
										</React.Fragment>
									))}
								</p>
								<p className="card-text mb-1">สถานที่ : {place}</p>
								<p className="card-text mb-1">เบี้ยเลี้ยง : {allowance}</p>
							</div>
						</div>
						<div className="col-12 col-md-3 col-xl-3">
							<div className="job-actions">
								<p className="card-text">
									<small className="text-muted d-none d-md-block">
										วันที่ลงประกาศ : {created}
									</small>
								</p>

								<button className={`${btn.btn_blue_outline} w-50`}>
									แก้ไข
								</button>
								<button className={`btn btn-outline-danger w-50`}>ลบ</button>
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

export default EmAllJob;
