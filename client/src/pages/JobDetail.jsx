import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import btn from "../components/btn.module.css";

export default function JobDetail() {
	const params = useParams();
	const navigate = useNavigate();

	const goBack = () => navigate(-1);

	return (
		<>
			<div className="container p-5">
				<br />
				<button className={`${btn.btn_grey}`} onClick={goBack}>
					ย้อนกลับ{" "}
				</button>

				<h3>Job ID: {params.jobId}</h3>
				<br />

				<div className="row gx-5">
					<div className="col-md-9">
						<h5>x</h5>
						<h5>x</h5>
						<h5>x</h5>
						<h5>x</h5>
						<h5>x</h5>
					</div>
					<div className="col-md-3 bg-light">
						<div className="bg-primary">
							<h5>ดูโปรไฟล์บริษัท?</h5>
						</div>

						<div className="bg-primary">
							<h5>ตำแหน่งฝึกงานอื่น ๆ</h5>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
