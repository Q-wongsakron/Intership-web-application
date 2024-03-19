import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import $ from "jquery";
// import DataTable from "datatables.net-dt";
import DataTables from "datatables.net-dt";
// import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

export default function DataTable({ data, columns }) {
	const mockData = [
		{
			id: 1,
			company_name: "ttt",
			address: "ttt",
			contact_name: "ttt",
			contact_email: "ttt",
			contact_tel: "ttt",
			username: "ttt",
			employer_id: 1,
		},
		{
			id: 2,
			company_name: "ttt",
			address: "ttt",
			contact_name: "ttt",
			contact_email: "ttt",
			contact_tel: "ttt",
			username: "ttt",
			employer_id: 2,
		},
		{
			id: 3,
			company_name: "ttt",
			address: "ttt",
			contact_name: "ttt",
			contact_email: "ttt",
			contact_tel: "ttt",
			username: "ttt",
			employer_id: 3,
		},
	];

	const mockColumns = [
		{ data: "id", title: "ID" },
		{ data: "company_name", title: "Company Name" },
		{ data: "address", title: "Address" },
		{ data: "contact_name", title: "Contact Name" },
		{ data: "contact_email", title: "Contact Email" },
		{ data: "contact_tel", title: "Contact Tel" },
		{ data: "username", title: "Username" },
		{ data: "employer_id", title: "Employer ID" },
		{
			title: "Actions",
			render: function (data, type, row) {
				return <button onClick={() => handleAction(row)}>Action</button>;
			},
		},
	];

	const handleAction = (row) => {
		// Handle action here, you can access the row data
		console.log("Action clicked for row:", row);
	};

	const tableRef = useRef(null);

	useEffect(() => {
		// let table = new DataTable("#myTable", {
		// 	responsive: true,
		// });

		const dt = new DataTables(tableRef.current, {
			data: data,
			columns: columns,
		});
		return () => {
			dt.destroy();
		};

		// if (!tableRef.current) return;

		// $(tableRef.current).DataTable({
		// 	data: mockData,
		// 	columns: [
		// 		{ data: "id", title: "ID" },
		// 		{ data: "company_name", title: "Company Name" },
		// 		{ data: "address", title: "Address" },
		// 		{ data: "contact_name", title: "Contact Name" },
		// 		{ data: "contact_email", title: "Contact Email" },
		// 		{ data: "contact_tel", title: "Contact Tel" },
		// 		{ data: "username", title: "Username" },
		// 		{ data: "employer_id", title: "Employer ID" },
		// 	],
		// 	responsive: true,
		// });

		// return () => {
		// 	// Destroy the DataTable instance when the component unmounts
		// 	$(tableRef.current).DataTable().destroy(true);
		// };
	}, []);

	return (
		<table ref={tableRef} className="display table table-striped">
			<thead>
				<tr className="table-dark">
					{/* <th scope="col">ชื่อบริษัท/หน่วยงาน</th>
					<th scope="col">ที่อยู่</th>
					<th scope="col">ชื่อผู้ติดต่อ</th>
					<th scope="col">อีเมลติดต่อ</th>
					<th scope="col">เบอร์ติดต่อ</th>
					<th scope="col">ชื่อผู้ใช้</th>
					<th scope="col">สถานะ</th>
					<th scope="col">ACTIONS</th> */}
				</tr>
			</thead>
			{/* <tbody>
				{columns.map((item, index) => (
					<tr key={index}>
						<td>{item.company_name}</td>
						<td>{item.address}</td>
						<td>{item.contact_name}</td>
						<td>{item.contact_email}</td>
						<td>{item.contact_tel}</td>
						<td>{item.username}</td>
						<td className="badge text-bg-success">{item.status}</td>
						<td>ACTIONS</td>
					</tr>
				))}
			</tbody> */}
		</table>
	);

	function ItemNotFound() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-50 text-muted bg-light container-card">
				<h5>ค้นหาไม่พบ</h5>
			</div>
		);
	}
}
