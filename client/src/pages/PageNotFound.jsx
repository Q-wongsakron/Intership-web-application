import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0">
				<br />
				<h1>404 Page Not Found</h1>
				<br />
				<Link to={"/"}>กลับหน้าหลัก</Link>
			</div>
		</>
	);
}

export default PageNotFound;
