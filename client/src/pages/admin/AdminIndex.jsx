import React from "react";
import { Link } from "react-router-dom";
import btn from "../../components/btn.module.css";

function AdminIndex() {
	return (
		<div className="container p-3 p-md-4 container-card">
			<div className="d-flex justify-content-between mb-4">
				<h3 className="fw-bold">ผู้ดูแลระบบ</h3>
			</div>

			<div>
				<div className="mb-2">
					จัดการสิทธิ์ผู้ใช้ที่เป็นบุคลากร{" "}
					<Link
						to={"/admin/change-role"}
						className={`btn btn-sm ${btn.btn_blue_outline}`}
					>
						จัดการสิทธิ์ (บุคลากร)
					</Link>
				</div>
				<div className="mb-2">
					อนุมัติบริษัท/หน่วยงานที่สมัครเข้ามาในระบบ{" "}
					<Link
						to={"/admin/employer-list"}
						className={`btn btn-sm ${btn.btn_blue_outline}`}
					>
						อนุมัติผู้ใช้ (บริษัท/หน่วยงาน)
					</Link>
				</div>
				<div className="mb-2">
					อัปโหลดรายชื่อนักศึกษาที่ลงทะเบียนเรียนวิชาฝึกงาน{" "}
					<Link
						to={"/admin/upload-csv"}
						className={`btn btn-sm ${btn.btn_blue_outline}`}
					>
						อัปโหลดรายชื่อนักศึกษา
					</Link>
				</div>
				<div className="mb-2">
					ส่งออกข้อมูลจากแบบประเมินต่าง ๆ{" "}
					<Link
						to={"/admin/export-eval"}
						className={`btn btn-sm ${btn.btn_blue_outline}`}
					>
						ส่งออกข้อมูลแบบประเมิน
					</Link>
				</div>

				{/* <Link to={"/admin/employer-list"}>employer-list</Link>
				<br />
				<Link to={"/admin/upload-csv"}>upload-csv</Link>
				<br />
				<Link to={"/admin/change-role"}>change-role</Link> */}
			</div>
		</div>
	);
}

export default AdminIndex;
