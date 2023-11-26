import React from "react"; // typing rfc
import { Link } from "react-router-dom";

export default function NavDropdown({
	title,
	items,
	buttonClassName,
	logoutItem,
}) {
	return (
		<>
			<li className="nav-item dropdown-center">
				<button
					className={`${buttonClassName} dropdown-toggle`}
					type="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
				>
					{title}
				</button>
				<ul className="dropdown-menu dropdown-menu-end">
					{items.map((item, index) => (
						<li key={index}>
							<Link className="dropdown-item" to={item.href ? item.href : "#"}>
								{item.label}
							</Link>
						</li>
					))}
					{logoutItem ? logoutItem : <></>}
				</ul>
			</li>
		</>
	);
}
