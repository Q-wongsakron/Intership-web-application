import axios from "axios";

// Student Login
export const studentLogin = async (form) =>
	// await axios.post(process.env.REACT_APP_API + "/loginStudent", form);
	await axios.post("http://localhost:5500/api" + "/loginStudent", form);

// Admin Login
export const adminLogin = async (form) =>
	// await axios.post(peocess.env.REACT_APP_API + "/loginAdmin", form);
	await axios.post("http://localhost:5500/api" + "/loginAdmin", form);

// Employer Login
export const employerLogin = async (form) =>
	// await axios.post(peocess.env.REACT_APP_API + "/loginEmployer", form);
	await axios.post("http://localhost:5500/api" + "/loginEmployer", form);

// Employer Register
export const employerRegister = async (form) =>
	// await axios.post(peocess.env.REACT_APP_API + "/registerEmployer", form);
	await axios.post("http://localhost:5500/api" + "/registerEmployer", form);

// Current User
export const currentUser = async (authtoken) =>
	// await axios.post(peocess.env.REACT_APP_API + "/current-user", form);
	await axios.post(
		"http://localhost:5500/api" + "/current-user",
		{},
		{
			headers: {
				authtoken,
			},
		}
	);
