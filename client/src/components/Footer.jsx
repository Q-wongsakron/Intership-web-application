import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<>
			<footer className="footer p-3">
				<div className="container-fluid d-flex justify-content-center align-items-center">
					<p className="col-md-auto mb-0">
						© {new Date().getFullYear()}{" "}
						<Link
							className="a-text"
							to={"https://ece.engr.tu.ac.th/"}
							target="_blank"
						>
							Department of Electrical and Computer Engineering, Thammasat
							University
						</Link>
						{". "}
						All Rights Reserved.
					</p>
				</div>
			</footer>
		</>
	);
}
