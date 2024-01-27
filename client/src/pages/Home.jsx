import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Job from "../components/Job";
import btn from "../components/btn.module.css";
import axios from "axios";

function Home() {
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5500/api/listPosts");
        console.log(response.data);
        setJobData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div className="container p-5">
        <br />
        <h2>Home Page</h2>
        <br />

        <div className="row justify-content-center gx-5">
          <div className="col-md-3 bg-light">
            <p className="p-2">Search Filter or News</p>
          </div>
          <div className="col-md-9">
            {jobData.map((item) => (
              <Job
                key={item.job_id}
                id={item.job_id}
                title={item.job_title}
                company={item.location}
                place={item.location}
                allowance={item.salary}
                positions={
                  Array.isArray(item.cat)
                    ? item.cat
                    : typeof item.cat === "string"
                    ? JSON.parse(item.cat)
                    : []
                }
                created={item.dateStartPost}
              />
            ))}

            <Link to={"/alljob"}>
              <button className={`${btn.btn_blue} w-100`}>
                ดูที่ฝึกงานทั้งหมด
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
