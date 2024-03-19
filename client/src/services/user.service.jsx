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

// export const getProfile = async (authtoken) =>
// 	await axios.get("http://localhost:5500/api" + "/profile", {
// 		headers: {
// 			authtoken,
// 		},
// 	});

export const getPost = async (postId) =>
	await axios.get("http://localhost:5500/api" + `/post/${postId}`, {});

export const getEmployerProfileId = async (employerId) =>
	await axios.get(
		"http://localhost:5500/api" + `/profileEmployerId/${employerId}`,
		{}
	);

export const getStudentProfile = async (authtoken) =>
	await axios.get("http://localhost:5500/api" + `/profileStudent`, {
		headers: {
			authtoken,
		},
	});

export const putStudentProfile = async (authtoken, formData) =>
	await axios.put(
		"http://localhost:5500/api" + `/updateProfileStudent`,
		{ formData },
		{
			headers: {
				authtoken,
			},
		}
	);

export const getEmployerProfile = async (authtoken) =>
	await axios.get("http://localhost:5500/api" + `/profileEmployer`, {
		headers: {
			authtoken,
		},
	});

export const putEmployerProfile = async (authtoken, formData) =>
	await axios.put(
		"http://localhost:5500/api" + `/updateProfileEmployer`,
		{ formData },
		{
			headers: {
				authtoken,
			},
		}
	);
