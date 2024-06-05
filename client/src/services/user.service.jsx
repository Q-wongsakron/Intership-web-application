import axios from "axios";

export const listAllUser = async (authtoken) =>
	await axios.get(import.meta.env.VITE_APP_API+"" + "/listAllUser", {
		headers: {
			authtoken,
		},
	});

export const chaneRole = async (authtoken, data) =>
	await axios.post(
		import.meta.env.VITE_APP_API+"" + "/changeRole",
		{ data },
		{
			headers: {
				authtoken,
			},
		}
	);

// export const getProfile = async (authtoken) =>
// 	await axios.get(import.meta.env.VITE_APP_API+"" + "/profile", {
// 		headers: {
// 			authtoken,
// 		},
// 	});

export const getPost = async (postId) =>
	await axios.get(import.meta.env.VITE_APP_API+"" + `/post/${postId}`, {});

export const getEmployerProfileId = async (employerId) =>
	await axios.get(
		import.meta.env.VITE_APP_API+"" + `/profileEmployerId/${employerId}`,
		{}
	);

export const getStudentProfile = async (authtoken) =>
	await axios.get(import.meta.env.VITE_APP_API+"" + `/profileStudent`, {
		headers: {
			authtoken,
		},
	});

export const putStudentProfile = async (authtoken, formData) =>
	await axios.put(
		import.meta.env.VITE_APP_API+"" + `/updateProfileStudent`,
		{ formData },
		{
			headers: {
				authtoken,
			},
		}
	);

export const getEmployerProfile = async (authtoken) =>
	await axios.get(import.meta.env.VITE_APP_API+"" + `/profileEmployer`, {
		headers: {
			authtoken,
		},
	});

export const putEmployerProfile = async (authtoken, formData) =>
	await axios.put(
		import.meta.env.VITE_APP_API+"" + `/updateProfileEmployer`,
		{ formData },
		{
			headers: {
				authtoken,
			},
		}
	);
