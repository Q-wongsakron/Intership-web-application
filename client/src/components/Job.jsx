import React from "react";
import { Link } from "react-router-dom";
import btn from "./btn.module.css";
import { useSelector } from "react-redux";

export default function Job({
  id,
  title,
  company,
  place,
  allowance,
  positions,
  created,
}) {
  const parsedPositions =
    typeof positions === "string" ? JSON.parse(positions) : positions;
  //   console.log("positions type:", typeof positions);
  //   console.log("positions value:", positions);
  const { user } = useSelector((state) => ({ ...state }));

  console.log("positions:", positions);

  return (
    <Link to={`/job/${id}`}>
      <div className="job-card" key={id}>
        <div className="job-img">
          <img src="https://picsum.photos/150" alt="Company Logo Image" />
        </div>
        <div className="job-card-details">
          <h5>บริษัท {company} รับนักศึกษาฝึกงาน</h5>
          {parsedPositions && (
            <p className="card-text">
              ตำแหน่ง :{" "}
              {Array.isArray(parsedPositions)
                ? parsedPositions.join(", ")
                : parsedPositions}
            </p>
          )}
          <p className="card-text">สถานที่ : {place}</p>
          <p className="card-text">เบี้ยเลี้ยง : {allowance}</p>
        </div>
        <div className="job-actions">
          <p className="card-text">
            <small className="text-muted">วันที่ลงประกาศ : {created}</small>
          </p>
          {user &&
          (user.user.role === "admin" ||
            user.user.role === "head" ||
            user.user.role === "teacher" ||
            user.user.role === "employer") ? (
            ""
          ) : (
            <button className={`${btn.btn_blue_outline} w-100`}>
              สมัครฝึกงาน
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
