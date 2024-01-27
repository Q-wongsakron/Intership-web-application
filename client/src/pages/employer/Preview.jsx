// Preview.jsx
import React from "react";
import BackButton from "./BackButton";
import { useLocation } from "react-router-dom";

const Preview = () => {
  const location = useLocation();
  const {
    job_title,
    location: locationValue,
    skill,
    work_hours,
    salary,
    contract,
    qualifications,
    dateStartPost,
    dateEndPost,
    desc: content,
    cats: categories,
  } = location.state;

  return (
    <div className="container mt-5">
      <BackButton to="/employer/create-job" state={location.state}>
        Back
      </BackButton>

      <div className="row mt-3">
        <div className="col-md-8">
          <h2>{job_title}</h2>
          <p>
            <strong>Location:</strong> {locationValue}
          </p>
          <p>
            <strong>Skill:</strong> {skill}
          </p>
          <p>
            <strong>Work Hours:</strong> {work_hours}
          </p>
          <p>
            <strong>Salary:</strong> {salary}
          </p>
          <p>
            <strong>Contract:</strong> {contract}
          </p>
          <p>
            <strong>Qualifications:</strong> {qualifications}
          </p>
          <p>
            <strong>Start Date:</strong> {dateStartPost.toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong> {dateEndPost.toLocaleDateString()}
          </p>
          <div>
            <strong>Content:</strong>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              {categories.map((cat) => (
                <p key={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
