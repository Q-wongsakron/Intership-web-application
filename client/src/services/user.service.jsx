import axios from "axios";

export const listAllUser = async (authtoken) =>
  await axios.get("http://localhost:5500/api" + "/listAllUser", {
    headers: {
      authtoken,
    },
  });

export const chaneRole = async (authtoken, data) =>
  await axios.post(
    "http://localhost:5500/api" + "/changeRole",
    { data },
    {
      headers: {
        authtoken,
      },
    }
  );
