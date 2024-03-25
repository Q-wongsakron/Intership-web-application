import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Job from "../../components/Job";
import btn from "../../components/btn.module.css";
import employerDefaultImg from "../../assets/employer_default_img.png";
import Loading from "../../components/Loading";

import { getEmployerProfile } from "../../services/user.service";

function EmProfile() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	const { user } = useSelector((state) => ({ ...state }));

	const fetchData = async (authtoken) => {
		try {
			const response = await getEmployerProfile(authtoken);
			setData(response.data);
		} catch (error) {
			console.log(
				"Load data failed: ",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchData(user.user.token);
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<>
			<div className="container p-3 p-md-4 container-card employerProfileDetailCard">
				{/* <div className="d-flex justify-content-between">
						<h3 className="std-profile-title mb-3 fw-bold">ข้อมูลของฉัน</h3>
						<button className="btn btn-secondary d-none">แก้ไขข้อมูล</button>
					</div> */}

				<div className="row">
					<div className="col-12">
						<div className="employerProfileDetail">
							<div className="d-flex justify-content-between">
								<div className="d-flex flex-row employerTitle">
									<div className="employer-card-img">
										<div className="job-card-img mb-3 mb-md-0 me-3">
											<img
												src={
													data.profile.company_pic
														? `http://localhost:5500/uploads/${data.profile.company_pic}`
														: employerDefaultImg
												}
												alt="Company Logo Image"
												className="img-fluid"
											/>
										</div>
									</div>
									<div className="employerTitleText">
										{data ? (
											<h4 className="fw-bold">{data.profile.company_name}</h4>
										) : (
											<p className="text-muted">กำลังโหลดข้อมูล...</p>
										)}
									</div>
								</div>
								<div className="mt-2 mt-sm-0 d-none d-md-block employerAction">
									<Link to={"/employer/profile/edit"}>
										<button className={`${btn.btn_blue_outline}`}>
											แก้ไขข้อมูล
										</button>
									</Link>
								</div>
							</div>
							<div className="row mt-4 d-block d-md-none">
								<div className="col-sm-12 employerAction">
									<Link to={"/employer/profile/edit"}>
										<button className={`${btn.btn_blue_outline} w-100`}>
											แก้ไขข้อมูล
										</button>
									</Link>
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12 employerAbout">
									<p className="fw-bold">เกี่ยวกับเรา</p>
									{data.profile.about ? (
										<h6>{data.profile.about}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>

							<div className="row mt-4">
								<div className="col-sm-12 employerLocation">
									<p className="fw-bold">ที่ตั้งบริษัท/หน่วยงาน</p>
									{data ? (
										<>
											<h6>{data.profile.address} </h6>
											<h6>
												ตำบล/แขวง {data.profile.subdistrict}, อำเภอ/เขต{" "}
												{data.profile.district}, จังหวัด {data.profile.province}
												, รหัสไปรษณีย์ {data.profile.pcode}
											</h6>
										</>
									) : (
										<p className="text-muted">กำลังโหลดข้อมูล...</p>
									)}
								</div>
							</div>

							<div className="row mt-4">
								<div className="col-sm-12">
									<p className="fw-bold">ชื่อผู้ติดต่อ</p>
									{data.profile.contact_name ? (
										<h6>{data.profile.contact_name}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12">
									<p className="fw-bold">อีเมลติดต่อ</p>
									{data.profile.contact_email ? (
										<h6>{data.profile.contact_email}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
							<div className="row mt-4">
								<div className="col-sm-12">
									<p className="fw-bold">เบอร์ติดต่อ</p>
									{data.profile.contact_tel ? (
										<h6>{data.profile.contact_tel}</h6>
									) : (
										<p className="text-muted">-</p>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* <div className="container p-3 p-sm-4 mt-4 container-card">
				<div className="d-flex justify-content-between mb-4">
					<h4 className="fw-bold">ข้อมูลการติดต่อ</h4>
				</div>

				<div className="">
					<p className="fw-bold">ชื่อผู้ติดต่อ</p>
					{data.profile.contact_name ? (
						<h6>{data.profile.contact_name}</h6>
					) : (
						<p className="text-muted">-</p>
					)}
				</div>

				<div className="mt-4">
					<p className="fw-bold">อีเมลติดต่อ</p>
					{data.profile.contact_email ? (
						<h6>{data.profile.contact_email}</h6>
					) : (
						<p className="text-muted">-</p>
					)}
				</div>

				<div className="mt-4">
					<p className="fw-bold">เบอร์ติดต่อ</p>
					{data.profile.contact_tel ? (
						<h6>{data.profile.contact_tel}</h6>
					) : (
						<p className="text-muted">-</p>
					)}
				</div>
			</div> */}
		</>
	);
}

export default EmProfile;
