import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import employerDefaultImg from "../../assets/employer_default_img.png";
import Loading from "../../components/Loading";
import HtmlParser from "../../components/HtmlParser";

import { useSelector } from "react-redux";

import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function MyEmployer() {
	const [data, setJobData] = useState([]);
	const [selfEnrollData, setSelfEnrollData] = useState([]);
	const [loading, setLoading] = useState(true);

	const user = useSelector((state) => state.user);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: "AIzaSyDfIRJiUYqfFBRh_p0NOXAbhsHgoVYg3FM",
	});

	const center = useMemo(() => ({ lat: 18.52043, lng: 73.856743 }), []);

	const fetchData = async () => {
		try {
			let response = await axios.get(
				import.meta.env.VITE_APP_API + "/allConfirm",
				{
					headers: {
						authtoken: user.user.token,
					},
				}
			);
			// console.log(response.data);
			setJobData(response.data);

			if (response.data.length === 0) {
				response = await axios.get(
					import.meta.env.VITE_APP_API + "/allSelfEnroll",
					{
						headers: {
							authtoken: user.user.token,
						},
					}
				);
			}
			// console.log(response.data);
			setSelfEnrollData(response.data);
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

	// console.log(data);

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

						<hr />

						<div className="employerProfileDetail px-2 pt-3">
							<div className="d-flex justify-content-start">
								<div className="row employerTitle">
									<div className="col-5 mb-3 mb-md-0 employer-card-img">
										<div className="job-card-img mb-3 mb-md-0">
											<img
												src={
													employer.employer.company_pic
														? import.meta.env.VITE_FILE_API +
														  `/uploads/${employer.employer.company_pic}`
														: employerDefaultImg
												}
												// src={
												// 	import.meta.env.VITE_FILE_API +
												// 		`/uploads/${employer.employer.company_pic}` ||
												// 	employerDefaultImg
												// }
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

							<hr />

							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">ตำเเหน่งฝึกงาน</p>
									<h6>{employer.position}</h6>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 jobDetail">
									<p className="fw-bold">รายละเอียดงาน</p>
									{/* <h6>{employer.posts_job.desc}</h6> */}
									<div>
										<HtmlParser htmlString={employer.posts_job.desc} />
									</div>
								</div>
							</div>

							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">สถานที่ปฏิบัติงาน</p>
									<div>
										{employer.posts_job.location
											.split("\n")
											.map((line, index) => (
												<p key={index} className="mb-1">
													{line}
												</p>
											))}
									</div>
									<span>
										{employer.posts_job.subdistrict},{" "}
										{employer.posts_job.district}, {employer.posts_job.province}
										, {employer.posts_job.pcode}
									</span>
								</div>
							</div>

							<hr />

							<div className="row mt-4">
								<div className="col-sm-12 jobWelfare">
									<p className="fw-bold">เบี้ยเลี้ยง</p>
									<h6>{employer.posts_job.salary}</h6>
								</div>
								<div className="col-sm-12 mt-4 jobWelfare">
									<p className="fw-bold">สวัสดิการ</p>
									<h6>
										{employer.posts_job.welfare
											.split("\n")
											.map((line, index) => (
												<p key={index} className="mb-1">
													{line}
												</p>
											))}
									</h6>
								</div>
							</div>

							<hr />

							<div className="row mt-4">
								<div className="col-12 col-lg-6">
									<p className="fw-bold">อีเมลติดต่อ</p>
									<h6>{employer.posts_job.contact_email}</h6>
								</div>
								<div className="col-12 col-lg-6 mt-4 mt-lg-0">
									<p className="fw-bold">เบอร์ติดต่อ</p>
									<h6>{employer.posts_job.contact_tel}</h6>
								</div>
							</div>
							{/* <div className="row mt-4">
								<div className="col-12">
									<p className="fw-bold">เบอร์ติดต่อ</p>
									<h6>{employer.posts_job.contact_tel}</h6>
								</div>
							</div> */}

							<hr />

							{/* <div className="row mt-4">
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
							</div> */}

							{/* Add more details as needed */}
						</div>
					</div>
				))
			) : selfEnrollData.length > 0 ? (
				<SelfEnroll />
			) : (
				<MyEmployerIsNull />
			)}
		</>
	);

	function SelfEnroll() {
		return selfEnrollData.map((employer, index) => (
			<div key={index} className="container p-3 p-md-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h3 className="fw-bold">ข้อมูลที่ฝึกงาน</h3>
				</div>

				<hr />

				<div className="employerProfileDetail px-2 pt-3">
					<div className="row mt-4">
						<div className="col-sm-12 employerAbout">
							<p className="fw-bold">ชื่อบริษัท/หน่วยงาน</p>
							<h6>{employer.company_name}</h6>
						</div>
					</div>
					<div className="row mt-4">
						<div className="col-sm-12 employerLocation">
							<p className="fw-bold">ที่ตั้งบริษัท/หน่วยงาน</p>
							<h6>{employer.company_address}</h6>
						</div>
					</div>

					{/* <div className="row mt-4">
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
					</div> */}

					{/* Add more details as needed */}
				</div>
			</div>
		));
	}

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
