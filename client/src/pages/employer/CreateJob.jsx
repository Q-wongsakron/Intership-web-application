import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles for the DatePicker
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";

const CreateJob = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const [jobTitle, setJobTitle] = useState(location.state?.job_title || "");
  const [locationValue, setLocationValue] = useState(
    location.state?.location || ""
  );
  const [skill, setSkill] = useState(location.state?.skill || "");
  const [workHours, setWorkHours] = useState(location.state?.work_hours || "");
  const [salary, setSalary] = useState(location.state?.salary || "");
  const [contract, setContract] = useState(location.state?.contract || "");
  const [qualifications, setQualifications] = useState(
    location.state?.qualifications || ""
  );
  const [desc, setDesc] = useState(location.state?.desc || "");
  const [categories, setCategories] = useState(location.state?.cat || []);
  const [dateStartPost, setDateStartPost] = useState(
    location.state?.dateStartPost || new Date()
  );
  const [dateEndPost, setDateEndPost] = useState(
    location.state?.dateEndPost || new Date()
  );
  const [content, setContent] = useState(location.state?.desc || "");
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryValue, setNewCategoryValue] = useState("");
  const [categoryValues, setCategoryValues] = useState({});

  useEffect(() => {
    setContent(location.state?.desc || "");
  }, [location.state?.desc]);

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        job_title: jobTitle,
        location: locationValue,
        skill,
        work_hours: workHours,
        salary,
        contract,
        qualifications,
        desc: content,
        cats: categories,
        dateStartPost,
        dateEndPost,
        categoryValues,
      };
      console.log(postData);
      if (location.state) {
        await axios.put(`/posts/${location.state.id}`, postData);
      } else {
        await axios.post(import.meta.env.VITE_APP_API+"/addPost", postData, {
          headers: {
            authtoken: user.user.token,
          },
        });
      }

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = (category) => {
    if (categories.includes(category)) {
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat !== category)
      );
      setCategoryValues((prevValues) => {
        const updatedValues = { ...prevValues };
        delete updatedValues[category];
        return updatedValues;
      });
    } else {
      setCategories((prevCategories) => [...prevCategories, category]);
      setCategoryValues((prevValues) => ({
        ...prevValues,
        [category]: parseInt(newCategoryValue),
      }));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const newCategoryName = newCategory.trim();
      const newCategoryVal = parseInt(newCategoryValue);
      setCategories((prevCategories) => [...prevCategories, newCategoryName]);
      setCategoryValues((prevValues) => ({
        ...prevValues,
        [newCategoryName]: newCategoryVal,
      }));
      setNewCategory("");
      setNewCategoryValue("");
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();

    // Create a postData object
    const postData = {
      job_title: jobTitle,
      location: locationValue,
      skill,
      work_hours: workHours,
      salary,
      contract,
      qualifications,
      desc: content,
      cats: categories,
      dateStartPost,
      dateEndPost,
      categoryValues,
    };

    // Navigate to the preview page
    navigate("/employer/preview", { state: postData });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8">
          <div className="content">
            <div className="form-group">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                className="form-control mb-3"
                placeholder="Enter Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                className="form-control mb-3"
                placeholder="Enter Location"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="skill">Skill</label>
              <input
                type="text"
                id="skill"
                className="form-control mb-3"
                placeholder="Enter Skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="workHours">Work Hours</label>
              <input
                type="text"
                id="workHours"
                className="form-control mb-3"
                placeholder="Enter Work Hours"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">Salary</label>
              <input
                type="text"
                id="salary"
                className="form-control mb-3"
                placeholder="Enter Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contract">Contract</label>
              <input
                type="text"
                id="contract"
                className="form-control mb-3"
                placeholder="Contract"
                value={contract}
                onChange={(e) => setContract(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="qualifications">Qualifications</label>
              <input
                type="text"
                id="qualifications"
                className="form-control mb-3"
                placeholder="Qualifications"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="startdate">StartDate</label>
              <DatePicker
                selected={dateStartPost}
                onChange={(date) => setDateStartPost(date)}
                placeholderText="Start Date"
                className="form-control mb-3"
              />
              <label htmlFor="enddate">EndDate</label>
              <DatePicker
                selected={dateEndPost}
                onChange={(date) => setDateEndPost(date)}
                placeholderText="End Date"
                className="form-control mb-3"
              />
            </div>

            <div className="editorContainer">
              <label htmlFor="content">Content</label>
              <ReactQuill
                id="content"
                className="editor"
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Publish</h5>
              <p className="card-text">
                <b>Status:</b> Draft
              </p>
              <p className="card-text">
                <b>Visibility:</b> Public
              </p>

              <div className="buttons">
                <button className="btn btn-light btn-sm">
                  Save as a draft
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePublish}
                >
                  Publish
                </button>
                <button
                  className="btn btn-success btn-sm"
                  onClick={handlePreview}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>

              <div className="form-group">
                <input
                  list="categoriesList"
                  type="text"
                  className="form-control mb-2"
                  placeholder="Add New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Value"
                  value={newCategoryValue}
                  onChange={(e) => setNewCategoryValue(e.target.value)}
                />
                <datalist id="categoriesList">
                  {[
                    "Frontend",
                    "Backend",
                    "Datasci",
                    "Depops",
                    "ITsupport",
                    "ITsecurity",
                  ].map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <button
                  className="btn btn-primary btn-sm mb-2"
                  onClick={handleAddCategory}
                >
                  เพิ่มตำแหน่งงาน
                </button>
              </div>

              {categories.map((cat, index) => (
                <div key={index} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={categories.includes(cat)}
                    id={cat}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <label className="form-check-label" htmlFor={cat}>
                    {cat} - {categoryValues[cat]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
