import axios from "axios";

export const addPost = async (authtoken, data) =>
  await axios.post(import.meta.env.VITE_APP_API+"" + "/addPost", data, {
    headers: {
      authtoken,
    },
  });

export const editPost = async (authtoken, data, jobId) =>
  await axios.put(import.meta.env.VITE_APP_API+"" + "/editPost" + `/${jobId}`, data, {
    headers: {
      authtoken,
    },
  });

export const listAllApply = async (authtoken) =>
  await axios.get(import.meta.env.VITE_APP_API+"" + "/allApply", {
    headers: {
      authtoken,
    },
  });
