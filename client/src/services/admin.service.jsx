import axios from "axios";

// Employer List
export const employerList = async (authtoken) =>
  await axios.get("http://localhost:5500/api" + "/listEmployer", {
    headers: {
      authtoken,
    },
  });

export const verifyEmployer = async (authtoken, data) =>
  await axios.post(
    "http://localhost:5500/api" + "/verifyEmployer",
    { data },
    {
      headers: {
        authtoken,
      },
    }
  );

export const uploadCsv = (authtoken, formData) =>
  axios.post("http://localhost:5500/api/uploadcsv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authtoken,
    },
  });
