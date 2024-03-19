import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import  axios  from "axios"
function StudentMornitor() {
	const [data, setData] = useState([]);

	const { user } = useSelector((state) => ({ ...state }));

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5500/api/studentMornitor",

				);
				console.log(response.data);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [user.user.token]);
	// const [selectedSearchField, setSelectedSearchField] =
	// 	useState("displayname_th");
	// const [searchQuery, setSearchQuery] = useState("");
	// const filteredData = data.filter((item) => {
	// 	const fields = selectedSearchField.split(".");
	// 	let fieldValue = item;

	// 	for (const field of fields) {
	// 		if (fieldValue && fieldValue.hasOwnProperty(field)) {
	// 			fieldValue = fieldValue[field];
	// 		} else {
	// 			fieldValue = undefined;
	// 			break;
	// 		}
	// 	}

	// 	if (typeof fieldValue === "object" && !Array.isArray(fieldValue)) {
	// 		const objectValues = Object.values(fieldValue);
	// 		return objectValues.some(
	// 			(value) =>
	// 				typeof value === "string" &&
	// 				value.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
	// 		);
	// 	} else {
	// 		return (
	// 			typeof fieldValue === "string" &&
	// 			fieldValue
	// 				.trim()
	// 				.toLowerCase()
	// 				.includes(searchQuery.trim().toLowerCase())
	// 		);
	// 	}
	// });
    
	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">
					ติดตามสถานะนักศึกษา 
				</h3>
			</div>

			{/* <div className="searchBox">
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
			</div> */}

			<div className="table-responsive text-nowrap">
				<table className="table table-striped">
					<thead>
						<tr className="table-dark">
							<th scope="col">#</th>
							<th scope="col">ชื่อ-นามสกุล</th>
							<th scope="col">เลขทะเบียน</th>
							<th scope="col">อีเมล</th>
							<th scope="col">เบอร์โทร</th>
							<th scope="col">บริษัท/หน่วยงาน</th>
							<th scope="col">สถานะ</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<th scope="row">{index + 1}</th>
								<td>{`${item.displayname_th} `}</td>
								<td>{item.std_id}</td>
								<td>{item.email}</td>
                                {item.tel ? (
                                    <td>{item.tel}</td>
                                ): (
                                    <td>-</td>
                                )}
						
                                {item.applies ? (
                                    <td>{item.applies.employer.company_name}</td>
                                ) : item.confirms ? (
                                    <td>{item.confirms.employer.company_name}</td>
                                ) : (
                                <td>-</td>
                                )}

                                {item.status == "0" ? (
                                    <td>หาที่ฝึกงาน</td>
                                ) : item.status == "1" ? (
                                    <td>รอการตอบรับ</td>
                                ) : item.status == "2" ? (
                                    <td>ระหว่างฝึกงาน</td>
                                ) : (
                                <td>เสร็จสิ้นฝึกงาน</td>
                                )}
                               
							
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default StudentMornitor;
