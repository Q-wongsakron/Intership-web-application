// BackButton.js
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BackButton = ({ to, state, children }) => (
  <Link to={{ pathname: to, state }}>
    {children || <button className="btn btn-secondary btn-sm">Back</button>}
  </Link>
);

export default BackButton;
