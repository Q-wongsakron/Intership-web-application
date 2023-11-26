import React, { useState } from "react";
import axios from "axios";
import { uploadCsv } from "../../services/admin.service";
import { useSelector } from "react-redux";

const CsvUploader = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setMessage("Please select a CSV file.");
        return;
      }

      const formData = new FormData();
      formData.append("csvFile", file);

      const response = await uploadCsv(user.user.token, formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setMessage("Error uploading CSV. Please try again.");
    }
  };

  return (
    <div>
      <h2>CSV Uploader</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CsvUploader;
