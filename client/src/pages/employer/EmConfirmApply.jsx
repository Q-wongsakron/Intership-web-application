import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import btn from "../../components/btn.module.css";
import AlertBox from "../../components/AlertBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function EmConfirmApply() {
	const [data, setData] = useState([]);

	const { user } = useSelector((state) => ({ ...state }));

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5500/api/allConfirm",
					{
						headers: {
							authtoken: user.user.token,
						},
					}
				);
				console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [user.user.token]);

	const [selectedSearchField, setSelectedSearchField] = useState("position");
	const [searchQuery, setSearchQuery] = useState("");
	const filteredData = data.filter((item) => {
		const fields = selectedSearchField.split(".");
		let fieldValue = item;

		for (const field of fields) {
			if (fieldValue && fieldValue.hasOwnProperty(field)) {
				fieldValue = fieldValue[field];
			} else {
				fieldValue = undefined;
				break;
			}
		}

		if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
			const objectValues = Object.values(fieldValue);
			return objectValues.some(
				(value) =>
					typeof value === "string" &&
					value.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
			);
		} else {
			return (
				typeof fieldValue === "string" &&
				fieldValue
					.trim()
					.toLowerCase()
					.includes(searchQuery.trim().toLowerCase())
			);
		}
	});

	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">นักศึกษาที่รับฝึกงานแล้ว ({data.length})</h3>
			</div>

			<div className="searchBox">
				<label className="form-label fw-bold" htmlFor="selectFilter">
					ค้นหาโดย :
				</label>
				<div className="input-group input-group-sm mb-3">
					<select
						id="selectFilter"
						className="form-select"
						value={selectedSearchField}
						onChange={(e) => setSelectedSearchField(e.target.value)}
					>
						<option value="position" label="ตำแหน่ง">
							ตำแหน่ง
						</option>
						<option value="posts_job.job_title" label="จากโพสต์">
							จากโพสต์
						</option>
						<option value="student.displayname_th" label="ชื่อ-นามสกุล">
							ชื่อ-นามสกุล
						</option>
						<option value="date_confirm" label="วันที่รับ">
							วันที่รับ
						</option>
					</select>

					<input
						type="text"
						className="form-control w-75"
						aria-label="Sizing example input"
						aria-describedby="inputGroup-sizing-sm"
						placeholder="ค้นหา..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<div className="mx-1">({filteredData.length})</div>
				</div>
			</div>

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ตำแหน่ง</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">จากโพสต์</th>
							<th scope="col">เอกสารขอความอนุเคราะห์</th>
							<th scope="col">วันที่รับ</th>
							<th scope="col">RESUME</th>
							<th scope="col">ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((data, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{data.position}</td>
								<td>{`${data.student.displayname_th} `}</td>
								<td>{data.student.email}</td>
								<td>{data.student.tel}</td>
								<td>{data.posts_job.job_title}</td>
								<td>เอกสารขอความอนุเคราะห์</td>
								<td>{data.date_confirm}</td>
								<td>
									<Link to={`/resume/${data.std_id}`}>
										{data.resume ? "View Resume" : "No Resume"}
									</Link>
								</td>
								<td>
									<Link to={"#"}>
										<button type="button" className={`btn btn-secondary m-1`}>
											<FontAwesomeIcon icon={faEye} />
										</button>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);

	// <div className="container p-3 p-sm-4 container-card">
	// 	<div className="d-flex justify-content-between mb-4">
	// 		<h3 className="fw-bold">นักศึกษาที่รับฝึกงานแล้ว</h3>
	// 	</div>

	// 	<div className="table-responsive text-nowrap">
	// 		<table className="table table-striped">
	// 			<thead>
	// 				<tr className="table-dark">
	// 					<th scope="col">#</th>
	// 					<th scope="col">ตำแหน่ง</th>
	// 					<th scope="col">ชื่อ-นามสกุล</th>
	// 					<th scope="col">อีเมล</th>
	// 					<th scope="col">เบอร์โทร</th>
	// 					<th scope="col">สถานะ</th>
	// 					<th scope="col">RESUME</th>
	// 					<th scope="col">ACTION</th>
	// 				</tr>
	// 			</thead>
	// 			<tbody>
	// 				<tr>
	// 					<th scope="row">1</th>
	// 					<td>DepOps</td>
	// 					<td>วงศกร กองกะมุด</td>
	// 					<td>qq@ex.com</td>
	// 					<td>0929123456</td>
	// 					<td>ระหว่างฝึกงาน</td>
	// 					<td>
	// 						<Link to={"#"}>resume-file</Link>
	// 					</td>
	// <td>
	// 	<Link to={"#"}>
	// 		<button type="button" className={`btn btn-secondary m-1`}>
	// 			<FontAwesomeIcon icon={faEye} />
	// 		</button>
	// 	</Link>
	// </td>
	// 				</tr>
	/* {data
							? data.map((item, index) => (
									<tr key={index}>
										<th scope="row">{index + 1}</th>
										<td>{item.company_name}</td>
										<td>{item.address}</td>
										<td>{item.contact_name}</td>
										<td>{item.contact_email}</td>
										<td>{item.contact_tel}</td>
										<td>{item.username}</td>
										<td>{item.employer_id}</td>
										<td>
											<select
												className="form-select from-select-sm"
												value={item.status}
												onChange={(e) =>
													handleStatusChange(item.employer_id, e.target.value)
												}
											>
												<option value="verified">verified</option>
												<option value="notverify">notverify</option>
											</select>
										</td>
										<td>ACTION</td>
									</tr>
							  ))
							: null} */
	// 			</tbody>
	// 		</table>
	// 	</div>
	// </div>
	// );
}

export default EmConfirmApply;
