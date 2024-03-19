import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import employerDefaultImg from "../../assets/employer_default_img.png";
import Loading from "../../components/Loading";

import { useSelector } from "react-redux";

import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function MyEmployer() {
	const [data, setJobData] = useState([]);
	const [loading, setLoading] = useState(true);

	const { user } = useSelector((state) => ({ ...state }));

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: "AIzaSyDfIRJiUYqfFBRh_p0NOXAbhsHgoVYg3FM",
	});

	const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5500/api/allConfirm", {
				headers: {
					authtoken: user.user.token,
				},
			});
			console.log(response.data);
			setJobData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, []);

	console.log(data);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			{data.length > 0 ? (
				data.map((employer, index) => (
					<div key={index} className="container p-3 p-md-4 container-card">
						<div className="d-flex justify-content-between mb-4">
							<h3 className="fw-bold">ข้อมูลที่ฝึกงาน</h3>
						</div>

						<div className="employerProfileDetail px-2 pt-3">
							<div className="d-flex justify-content-start">
								<div className="row employerTitle">
									<div className="col-5 mb-3 mb-md-0 employer-card-img">
										<div className="job-card-img mb-3 mb-md-0">
											<img
												src={
													employer.employer.company_pic || employerDefaultImg
												}
												alt="Company Logo Image"
												className="img-fluid"
											/>
										</div>
									</div>
									<div className="col-7 employerTitleText">
										<h4 className="fw-bold">
											{employer.employer.company_name}
										</h4>
									</div>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerAbout">
									<p className="fw-bold">เกี่ยวกับเรา</p>
									<h6>{employer.employer.about}</h6>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">ที่ตั้งบริษัท/หน่วยงาน</p>
									<h6>{employer.employer.address}</h6>
									<h6>
										ตำบล/แขวง {employer.employer.subdistrict}, อำเภอ/เขต{" "}
										{employer.employer.district}, จังหวัด{" "}
										{employer.employer.province}, รหัสไปรษณีย์{" "}
										{employer.employer.pcode}
									</h6>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">ตำเเหน่งฝึกงาน</p>
									<h6>{employer.position}</h6>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">รายละเอียดงาน</p>
									<h6>{employer.posts_job.desc}</h6>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">เบี้ยเลี้ยง</p>
									<h6>{employer.posts_job.salary}</h6>
								</div>
							</div>

							<div className="row mt-4">
								{isLoaded ? (
									<GoogleMap
										mapContainerClassName="map-container"
										center={center}
										zoom={10}
									>
										<Marker position={{ lat: 18.52043, lng: 73.856743 }} />
									</GoogleMap>
								) : (
									<div>Loading...</div>
								)}
							</div>

							{/* Add more details as needed */}
						</div>
					</div>
				))
			) : (
				<MyEmployerIsNull />
			)}
		</>
	);

	function MyEmployerIsNull() {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center p-5 min-vh-100 text-muted bg-light container-card">
				<h4>
					ยังไม่มี<span className="fw-bold">ข้อมูลที่ฝึกงาน</span>ของนักศึกษา
				</h4>
				<small>
					- นักศึกษา สามารถยื่นฝึกงานเองได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/student/self-enroll"}>ยื่นที่ฝึกงานเอง</Link>
					</span>
				</small>
				<small>
					- นักศึกษา สามารถสมัครฝึกงานที่เปิดรับภายในระบบได้ที่ :{" "}
					<span className="text-light-blue">
						<Link to={"/alljob"}>ตำแหน่งฝึกงานทั้งหมด</Link>
					</span>
				</small>
			</div>
		);
	}
}

export default MyEmployer;
