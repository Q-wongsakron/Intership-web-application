import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import btn from "../components/btn.module.css";
import axios from "axios";

export default function JobDetail() {
  const params = useParams();
  const navigate = useNavigate();
  let parsedPositions;
  const [jobData, setJobData] = useState(null);
  const goBack = () => navigate(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/api/post/${params.jobId}`
        );

        if (response.status >= 200 && response.status < 300) {
          const job = response.data;
          const parsedPositions =
            typeof job.cat === "string" ? JSON.parse(job.cat) : job.cat;
          setJobData(job);
        } else {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [params.jobId]);

  return (
    <>
      <div className="container p-5">
        <br />
        <button className={`${btn.btn_grey}`} onClick={goBack}>
          ย้อนกลับ
        </button>

        {jobData ? (
          <>
            <h3>Job ID: {jobData.job_id}</h3>
            <h4>{jobData.job_title}</h4>
            <p>Location: {jobData.location}</p>
            <p>Skill required: {jobData.skill}</p>
            <p>Work Hours: {jobData.work_hours}</p>
            <p>Salary: {jobData.salary}</p>
            <p>Contract: {jobData.contract}</p>
            <p>Qualifications: {jobData.qualifications}</p>
            <p>Description: {jobData.desc}</p>
            {parsedPositions && (
              <p className="card-text">
                ตำแหน่ง :{" "}
                {Array.isArray(parsedPositions)
                  ? parsedPositions.join(", ")
                  : parsedPositions}
              </p>
            )}
            <p>Start Date: {jobData.dateStartPost}</p>
            <p>End Date: {jobData.dateEndPost}</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
