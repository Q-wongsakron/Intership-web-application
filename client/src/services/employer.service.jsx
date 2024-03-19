import axios from "axios";

export const addPost = async (authtoken, data) =>
  await axios.post("http://localhost:5500/api" + "/addPost", data, {
    headers: {
      authtoken,
    },
  });

export const listAllApply = async (authtoken) =>
  await axios.get("http://localhost:5500/api" + "/allApply", {
    headers: {
      authtoken,
    },
  });
