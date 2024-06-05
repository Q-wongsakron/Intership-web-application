import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HtmlParser from "../components/HtmlParser";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import axios from "axios";

function Schedule() {
	const navigate = useNavigate();
	const [scheduleDetail, setscheduleDetail] = useState(null);
	const fetchData = async () => {
		try {
			const response = await axios.get(
				import.meta.env.VITE_APP_API + "/listSchedule"
			);
			// console.log(response.data.detail);

			setscheduleDetail(response.data[0].detail);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);

	// console.log(scheduleDetail);

	return (
		<>
			<div className="container p-3 p-xl-5 mb-3 mb-xl-0">
				<h3 className="my-4 mb-sm-5 fw-bold">กำหนดการ</h3>

				<div className="fw-bold mb-4">
					<Link to={"/"}>หน้าหลัก</Link>
					<span>{` > `}</span>
					<Link to={"/schedule"}>กำหนดการ</Link>
				</div>

				<div className="content">
					<div className="mt-2 mt-sm-0">
						{scheduleDetail ? (
							<>
								{/* <HtmlParser htmlString={scheduleDetail} /> */}
								<SunEditor
									onChange={null}
									setContents={scheduleDetail}
									disable={true}
									disableToolbar={true}
									hideToolbar={true}
								/>
							</>
						) : (
							<p className="text-muted">กำลังโหลดข้อมูล...</p>
						)}
						{/* {jobPostDesc} */}
					</div>
				</div>
			</div>
		</>
	);
}

export default Schedule;
