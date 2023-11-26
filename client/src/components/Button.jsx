import React from "react";
import btn from "./btn.module.css";

export default function Button(props) {
	const { inputClass, text, onChange, onClick } = props;

	let outputClass;

	switch (inputClass) {
		case "btn_grey":
			outputClass = btn.btn_grey;
			break;
		case "btn_grey_outline":
			outputClass = btn.btn_grey_outline;
			break;
		case "btn_blue":
			outputClass = btn.btn_blue;
			break;
		case "btn_blue_outline":
			outputClass = btn.btn_blue_outline;
			break;
		default:
			outputClass = btn.btn_grey;
			break;
	}

	return (
		<>
			{/* {outputButton} */}
			<button
				className={outputClass}
				onChange={onChange ? onChange : null}
				onClick={onClick ? onClick : null}
			>
				{text}
			</button>
		</>
	);
}
