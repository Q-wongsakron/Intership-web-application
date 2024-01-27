import React, { useState, useEffect } from "react";

export default function AlertBox({ message, duration = 3000 }) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, duration);

		return () => {
			clearTimeout(timer);
		};
	}, [duration]);

	return (
		<div className={`alert-box ${isVisible ? "" : "hidden"}`}>
			<p>{message}</p>
		</div>
	);
}
