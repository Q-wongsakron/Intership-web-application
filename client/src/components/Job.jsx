import React from "react";
import { Link } from "react-router-dom";
import btn from "./btn.module.css";

import { useSelector } from "react-redux";

export default function Job({
	id,
	title,
	company,
	place,
	allowance,
	positions,
	created,
}) {
	const { user } = useSelector((state) => ({ ...state }));

	return (
		<Link to={`/job/${id}`}>
			<div className="job-card" key={id}>
				<div className="job-img">
					<img src="https://picsum.photos/150" alt="Company Logo Image" />
				</div>
				<div className="job-card-details">
					{/* <h5>{title}</h5> */}
					<h5>บริษัท {company} รับนักศึกษาฝึกงาน</h5>

					{/* <p className="card-text">บริษัท : {company}</p> */}
					<p className="card-text">
						ตำแหน่ง :{" "}
						{positions.map((position, index) => (
							// <span
							// 	className={`${btn.btn_grey_outline} px-1 me-2`}
							// 	key={index}
							// >
							// 	{position}
							// </span>
							<React.Fragment key={index}>
								{index > 0 && ", "}
								<span style={{ color: "grey" }}>{position}</span>
							</React.Fragment>
						))}
					</p>
					<p className="card-text">สถานที่ : {place}</p>
					<p className="card-text">เบี้ยเลี้ยง : {allowance}</p>
				</div>
				<div className="job-actions">
					<p className="card-text">
						<small className="text-muted">วันที่ลงประกาศ : {created}</small>
					</p>
					{user &&
					(user.user.role === "admin" ||
						user.user.role === "head" ||
						user.user.role === "teacher" ||
						user.user.role === "employer") ? (
						""
					) : (
						<button className={`${btn.btn_blue_outline} w-100`}>
							สมัครฝึกงาน
						</button>
					)}
				</div>
			</div>
		</Link>
	);
}
