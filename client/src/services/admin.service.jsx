import axios from "axios";

// Employer List
export const employerList = async (authtoken) =>
  await axios.get(import.meta.env.VITE_APP_API+"" + "/listEmployer", {
    headers: {
      authtoken,
    },
  });

export const verifyEmployer = async (authtoken, data) =>
  await axios.post(
    import.meta.env.VITE_APP_API+"" + "/verifyEmployer",
    { data },
    {
      headers: {
        authtoken,
      },
    }
  );

export const uploadCsv = (authtoken, formData) =>
  axios.post(import.meta.env.VITE_APP_API+"/uploadcsv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authtoken,
    },
  });
