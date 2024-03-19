import React from "react";

import btn from "../../components/btn.module.css";
import employerDefaultImg from "../../assets/employer_default_img.png";
import HtmlParser from "../../components/HtmlParser";

function JobPreview({ formData }) {
	const parsedPositions =
		typeof positions === "string" ? JSON.parse(formData.cats) : formData.cats;

	return (
		<>
			<div className="container p-2 p-lg-3 p-xl-5 mb-3 mb-xl-0 bg-white rounded">
				{/* <div className="container p-1 p-sm-2 px-sm-4 bg-light container-card jobNavigationCard">
					<div className="d-flex justify-content-between">
						<a className={`a-text`} onClick={goBack}>
							ย้อนกลับ
						</a>
						<></>
					</div>
				</div> */}

				<div className="container p-2 p-sm-4 mt-3 container-card jobDetailCard">
					<div className="row justify-content-center">
						<div className="col-12">
							<div className="px-2 jobDetail">
								<div className="row">
									<div className="col-12 col-md-3 col-lg-2 d-flex">
										<div className="job-card-img mb-3 mb-md-0">
											<img
												src={employerDefaultImg}
												alt="Company Logo Image"
												className="img-fluid"
											/>
										</div>
										<div className="job-header-hidden d-block d-md-none px-3">
											{formData.job_title ? (
												<h5 className="job-card-title">{formData.job_title}</h5>
											) : (
												<h5 className="job-card-title text-muted">
													ยังไม่ได้กรอกข้อมูล
												</h5>
											)}

											<small className="text-muted">
												รับสมัคร :{" "}
												{formData.dateStartPost ? (
													<>
														{formData.dateStartPost.toLocaleDateString("en-GB")}{" "}
														ถึง{" "}
														{formData.dateEndPost.toLocaleDateString("en-GB")}
													</>
												) : (
													<>ยังไม่ได้กรอกข้อมูล</>
												)}
											</small>
										</div>
									</div>

									<div className="col-12 col-md-6 col-lg-7">
										<div className="job-card-details">
											{formData.job_title ? (
												<h5 className="job-card-title d-none d-md-block fw-bold">
													{formData.job_title}
												</h5>
											) : (
												<h5 className="job-card-title d-none d-md-block fw-bold text-muted">
													"หัวข้อประกาศรับฝึกงาน"
												</h5>
											)}

											<p className="card-text mb-1">
												บริษัท/หน่วยงาน : "ชื่อบริษัท/หน่วยงานของท่าน"
											</p>

											<button
												className={`d-none d-md-block w-25 text-center a-btn`}
												disabled
											>
												ดูโปรไฟล์
											</button>
											<button
												className={`d-block d-md-none my-2 w-100 text-center a-btn`}
												disabled
											>
												ดูโปรไฟล์
											</button>
										</div>
									</div>

									<div className="col-12 col-md-3 col-lg-3">
										<div className="job-actions">
											<p className="card-text">
												<small className="text-muted d-none d-md-block">
													รับสมัคร :{" "}
													{formData.dateStartPost ? (
														<>
															{formData.dateStartPost.toLocaleDateString(
																"en-GB"
															)}{" "}
															ถึง{" "}
															{formData.dateEndPost.toLocaleDateString("en-GB")}
														</>
													) : (
														<>ยังไม่ได้กรอกข้อมูล</>
													)}
												</small>
											</p>

											<button className={`w-100`} disabled>
												สมัครฝึกงาน
											</button>
										</div>
									</div>
								</div>

								<div className="row mt-4">
									{/* <div className="col-sm-12 jobAbout">
										<p className="fw-bold">เกี่ยวกับเรา</p>
										<h6>
											Lorem ipsum dolor sit amet, consectetur adipisicing elit.
											Corrupti natus distinctio amet vitae, ab culpa corporis at
											incidunt suscipit. Laboriosam culpa dolores voluptas velit
											officia unde, inventore expedita iusto dolorem.
										</h6>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="container px-2 px-sm-4 mt-4 container-card jobInfoCard1">
					<div className="d-flex flex-column flex-md-row justify-content-sm-between text-md-center p-2">
						<>
							<div className="mt-2 mt-sm-0">
								<p className="fw-bold">สถานที่ปฏิบัติงาน</p>
								{formData.location ? (
									<h6>{formData.location}</h6>
								) : (
									<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
								)}
							</div>
							<div className="mt-2 mt-sm-0">
								<p className="fw-bold">จำนวนรับ</p>
								{formData.position_num ? (
									<h6>{formData.position_num}</h6>
								) : (
									<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
								)}
							</div>
							<div className="mt-2 mt-sm-0">
								<p className="fw-bold">เบี้ยเลี้ยง</p>
								{formData.salary ? (
									<h6>{formData.salary}</h6>
								) : (
									<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
								)}
							</div>
							<div className="mt-2 mt-sm-0">
								<p className="fw-bold">เวลาทำงาน</p>
								{formData.work_hours ? (
									<h6>{formData.work_hours}</h6>
								) : (
									<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
								)}
							</div>
						</>
					</div>
				</div>

				<div className="container p-2 p-sm-4 mt-4 container-card jobInfoCard2">
					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">ตำแหน่งฝึกงานที่เปิดรับ</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{parsedPositions.length !== 0 ? (
								<>
									{Array.isArray(parsedPositions) &&
										parsedPositions.map((position, index) => (
											<h6 key={index}>- {position}</h6>
										))}
								</>
							) : (
								<h6 className="text-muted">ยังไม่ได้เลือกตำแหน่งที่เปิดรับ</h6>
							)}
						</div>
					</div>

					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">รายละเอียดงาน</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{formData.desc ? (
								// <h6>{formData.desc}</h6>
								<>
									<HtmlParser htmlString={formData.desc} />
								</>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</div>

					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">คุณสมบัติผู้สมัคร</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{formData.qualifications ? (
								<h6>{formData.qualifications}</h6>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</div>

					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">สวัสดิการ</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{formData.welfare ? (
								<h6>{formData.welfare}</h6>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</div>

					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">สถานที่ปฏิบัติงาน</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{formData.location ? (
								<>
									<span>{formData.location}</span>
									<br />
									{formData.subdistrict &&
										formData.district &&
										formData.province && (
											<span>
												{formData.subdistrict}, {formData.district},{" "}
												{formData.province}, {formData.pcode}
											</span>
										)}
								</>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</div>
					<div className="mb-5">
						<div className="d-flex justify-content-between mb-2">
							<h5 className="fw-bold">รายละเอียดเพิ่มเติม</h5>
						</div>
						<div className="mt-2 mt-sm-0">
							{formData.other ? (
								<h6>{formData.other}</h6>
							) : (
								<h6 className="text-muted">ยังไม่ได้กรอกข้อมูล</h6>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default JobPreview;
