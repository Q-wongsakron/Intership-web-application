import React from "react";
import { Link } from "react-router-dom";

function AdminIndex() {
	return (
		<>
			<h1>Admin Page</h1>

			<br />

			<Link to={"/admin/employer-list"}>employer-list</Link>
			<br />
			<Link to={"/admin/upload-csv"}>upload-csv</Link>
			<br />
			<Link to={"/admin/change-role"}>change-role</Link>
		</>
	);
}

export default AdminIndex;
