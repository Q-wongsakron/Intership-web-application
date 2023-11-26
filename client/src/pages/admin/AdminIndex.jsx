import React from "react";
import { Link } from "react-router-dom";

function AdminIndex() {
  return (
    <>
      <div className="container p-5">
        <h1>Admin Page</h1>

        <br />

        <Link to={"/admin/employer-list"}>employer-list</Link>
        <br />
        <Link to={"/admin/upload-csv"}>upload-csv</Link>
        <br />
        <Link to={"/admin/change-role"}>change-role</Link>
      </div>
    </>
  );
}

export default AdminIndex;
