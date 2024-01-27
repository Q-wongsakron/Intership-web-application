import React from "react";

function StdProfile() {
	return (
		<>
			<div className="container p-3 p-sm-4 container-card stdProfileCard">
				<div className="d-flex justify-content-between">
					<h3 className="stdProfileTitle mb-3 fw-bold">ข้อมูลของฉัน</h3>
					<button className="btn btn-secondary d-none">แก้ไขข้อมูล</button>
				</div>

				<div className="row">
					<div className="col-12">
						<div className="stdProfileDetail px-2 pt-3">
							<div className="row">
								{/* <div className="col-sm-6 std-name">
									<p className="fw-bold">ชื่อ</p>
									<h6 className="border rounded p-2 bg-light">ภูชิชย์</h6>
								</div> */}
								<div className="col-sm-6 stdName">
									<p className="fw-bold">ชื่อ</p>
									<h6>ภูชิชย์</h6>
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdSurname">
									<p className="fw-bold">นามสกุล</p>
									<h6>กลีบมาลัย</h6>
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdId">
									<p className="fw-bold">รหัสนักศึกษา</p>
									<h6>6210612716</h6>
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdDepartment">
									<p className="fw-bold">ภาควิชา</p>
									<h6>ไฟฟ้าและคอมพิวเตอร์</h6>
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdFaculty">
									<p className="fw-bold">คณะ</p>
									<h6>วิศวกรรมศาสตร์</h6>
								</div>
								<div className="col-sm-6 mt-2 mt-sm-0 stdPhone">
									<p className="fw-bold">โทรศัพท์</p>
									<h6>0812345678</h6>
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-sm-6 stdMail">
									<p className="fw-bold">อีเมล</p>
									<h6>asdad@ex.com</h6>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="container p-3 p-sm-4 mt-4 container-card std-resume-card">
				<div className="d-flex justify-content-between">
					<h3 className="std-resume-title mb-3 fw-bold">Resume</h3>
				</div>
				<div className="std-resume">
					<div className="stdResumeFile">
						<label for="stdResumeFile" className="form-label">
							อัปโหลดไฟล์ Resume เป็น .pdf
						</label>
						<input
							className="form-control"
							type="file"
							id="stdResumeFile"
							accept=".pdf"
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default StdProfile;
