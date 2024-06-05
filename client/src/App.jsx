import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/ScrollToTop";

// pages (public)
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import News from "./pages/News";
import JobDetail from "./pages/JobDetail";
import AllJob from "./pages/AllJob";
import PageNotFound from "./pages/PageNotFound";
import Test1 from "./pages/Test1";
import EmployerProfile from "./pages/EmployerProfile";
import NewsDetail from "./pages/NewsDetail";
import SearchJob from "./pages/SearchJob";

// pages (auth)
import InLogin from "./pages/auth/InLogin";
import ExLogin from "./pages/auth/ExLogin";
import ExRegister from "./pages/auth/ExRegister";
import AdminLogin from "./pages/auth/AdminLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import CheckVerifyEmail from "./pages/auth/CheckVerifyEmail";
// pages (ADMIN protected)
import AdminIndex from "./pages/admin/AdminIndex";
import EmployerList from "./pages/admin/EmployerList";
import ManageRole from "./pages/admin/ManageRole";
import CsvUpload from "./pages/admin/CsvUpload";
import ExportEval from "./pages/admin/ExportEval";
import StudentList from "./pages/admin/StudentList";

// pages (STUDENT protected)
import StdInternship from "./pages/student/StdInternship";
import SelfEnroll from "./pages/student/SelfEnroll";
import StdProfile from "./pages/student/StdProfile";
import MyEmployer from "./pages/student/MyEmployer";
import StdEditProfile from "./pages/student/StdEditProfile";
import UploadDocs from "./pages/student/UploadDocs";
import StdAllDocs from "./pages/student/StdAllDocs";
import StdEvaluationForm from "./pages/student/StdEvaluationForm";
import StaticEm from "./pages/student/StaticEm";
import StdViewAllFile from "./pages/student/StdViewAllFile";
import StdEditSelfEnroll from "./pages/student/StdEditSelfEnroll";

// pages (TEACHER protected)
import Teacher from "./pages/teacher/Teacher";
import CreateNews from "./pages/teacher/CreateNews";
import StudentMornitor from "./pages/teacher/StudentMornitor";
import UpdateScheduler from "./pages/teacher/UpdateScheduler";
import EditNews from "./pages/teacher/EditNews";

// pages (HEAD protected)
import HeadDocs from "./pages/head/HeadDocs";
import ApprovedDocs from "./pages/head/ApprovedDocs";
import SetupDocs from "./pages/head/SetupDocs";

// pages (EMPLOYER protected)
import EmSeeApply from "./pages/employer/EmSeeApply";
import EmConfirmApply from "./pages/employer/EmConfirmApply";
import EmProfile from "./pages/employer/EmProfile";
import EmAllJob from "./pages/employer/EmAllJob";
import EmCreateJob from "./pages/employer/EmCreateJob";
import EmEditProfile from "./pages/employer/EmEditProfile";
import EmEvaluationForm from "./pages/employer/EmEvaluationForm"; // protected or not?
import EmQuestionnaire from "./pages/employer/EmQuestionnaire";
import CreateJob from "./pages/employer/CreateJob";
import EmEditPost from "./pages/employer/EmEditPost";

// routes
import AdminRoute from "./routes/AdminRoute";
import StudentRoute from "./routes/StudentRoute";
import EmployerRoute from "./routes/EmployerRoute";
import TeacherRoute from "./routes/TeacherRoute";
import HeadRoute from "./routes/HeadRoute";
import SecretaryRoute from "./routes/SecretaryRoute";
// services
import { currentUser } from "./services/auth.service";

// data from store
import { useDispatch } from "react-redux";
import { login as loginRedux } from "./store/userSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
	// const ROLES = {
	// 	admin: "admin",
	// 	head: "head",
	// 	teacher: "teacher",
	// 	student: "student",
	// 	employer: "employer",
	// };

	const dispatch = useDispatch();

	const token = localStorage.getItem("token");

	currentUser(token)
		.then((res) => {
			let username;
			if (res.data.std_id) {
				username = res.data.std_id;
			} else if (res.data.username) {
				username = res.data.username;
			} else if (res.data.emp_tu_id) {
				username = res.data.emp_tu_id;
			} else {
				console.error("Unable to determine username.");
				return; // Exit function if username cannot be determined
			}

			dispatch(
				loginRedux({
					username: username,
					email: res.data.email,
					role: res.data.role,
					token: token,
					isVerified: res.data.verified,
				})
			);
		})
		.catch((err) =>
			console.error(
				"currentUser failed: ",
				err.response ? err.response.data : err.message
			)
		);

	return (
		<BrowserRouter>
			<div className="app">
				<Header />
				<ToastContainer />
				<Routes>
					{/* public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/schedule" element={<Schedule />} />
					<Route path="/news" element={<News />} />
					<Route path="/news/article/:articleId" element={<NewsDetail />} />
					<Route path="/alljob" element={<AllJob />} />
					<Route path="/search" element={<SearchJob />} />
					<Route path="/job/:jobId/:jobTitle" element={<JobDetail />} />
					<Route
						path="/employer/:employerId/profile"
						element={<EmployerProfile />}
					/>

					{/* if already auth, then redirect to index page? */}
					<Route path="/external/login" element={<ExLogin />} />
					<Route path="/external/register" element={<ExRegister />} />
					<Route path="/internal/login" element={<InLogin />} />
					<Route path="/admin/login" element={<AdminLogin />} />
					<Route path="forgotPassword" element={<ForgotPassword />} />
					<Route path="resetPassword" element={<ResetPassword />} />
					<Route path="verify-email" element={<VerifyEmail />} />
					{/* Student Routes */}
					<Route
						path="/student/internship"
						element={
							<StudentRoute>
								<StdInternship />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/self-enroll"
						element={
							<StudentRoute>
								<SelfEnroll />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/edit-self-enroll"
						element={
							<StudentRoute>
								<StdEditSelfEnroll />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/profile"
						element={
							<StudentRoute>
								<StdProfile />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/profile/edit"
						element={
							<StudentRoute>
								<StdEditProfile />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/my-employer"
						element={
							<StudentRoute>
								<MyEmployer />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/upload"
						element={
							<StudentRoute>
								<UploadDocs />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/documents"
						element={
							<StudentRoute>
								<StdAllDocs />
							</StudentRoute>
						}
					/>
					<Route
						path="/student/evaluation"
						element={
							<StudentRoute>
								<StdEvaluationForm />
							</StudentRoute>
						}
					/>

					<Route
						path="/student/staticEm"
						element={
							<StudentRoute>
								<StaticEm />
							</StudentRoute>
						}
					/>

					<Route
						path="/student/viewAllFile"
						element={
							<StudentRoute>
								<StdViewAllFile />
							</StudentRoute>
						}
					/>
					{/* Admin Routes */}
					<Route
						path="/admin"
						element={
							<AdminRoute>
								<AdminIndex />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/employer-list"
						element={
							<AdminRoute>
								<EmployerList />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/upload-csv"
						element={
							<AdminRoute>
								<CsvUpload />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/change-role"
						element={
							<AdminRoute>
								<ManageRole />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/create-news"
						element={
							<AdminRoute>
								<CreateNews />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/edit-news/:articleId"
						element={
							<AdminRoute>
								<EditNews />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/setup-docs"
						element={
							<AdminRoute>
								<SetupDocs />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/approve-docs"
						element={
							<AdminRoute>
								<HeadDocs />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/approved-docs"
						element={
							<AdminRoute>
								<ApprovedDocs />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/student-monitor"
						element={
							<AdminRoute>
								<StudentMornitor />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/update-scheduler"
						element={
							<AdminRoute>
								<UpdateScheduler />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/export-eval"
						element={
							<AdminRoute>
								<ExportEval />
							</AdminRoute>
						}
					/>
					<Route
						path="/admin/student-list"
						element={
							<AdminRoute>
								<StudentList />
							</AdminRoute>
						}
					/>

					{/* Head Routes */}
					<Route
						path="/head/approve-docs"
						element={
							<HeadRoute>
								<HeadDocs />
							</HeadRoute>
						}
					/>
					<Route
						path="/head/approved-docs"
						element={
							<HeadRoute>
								<ApprovedDocs />
							</HeadRoute>
						}
					/>
					<Route
						path="/head/student-monitor"
						element={
							<HeadRoute>
								<StudentMornitor />
							</HeadRoute>
						}
					/>

					{/* Secretary Routes */}

					<Route
						path="/secretary/setup-docs"
						element={
							<SecretaryRoute>
								<SetupDocs />
							</SecretaryRoute>
						}
					/>

					<Route
						path="/secretary/approve-docs"
						element={
							<SecretaryRoute>
								<HeadDocs />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/approved-docs"
						element={
							<SecretaryRoute>
								<ApprovedDocs />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/create-news"
						element={
							<SecretaryRoute>
								<CreateNews />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/edit-news/:articleId"
						element={
							<SecretaryRoute>
								<EditNews />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/update-scheduler"
						element={
							<SecretaryRoute>
								<UpdateScheduler />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/upload-csv"
						element={
							<SecretaryRoute>
								<CsvUpload />
							</SecretaryRoute>
						}
					/>
					<Route
						path="/secretary/employer-list"
						element={
							<SecretaryRoute>
								<EmployerList />
							</SecretaryRoute>
						}
					/>

					{/* TEACHER Routes */}
					<Route
						path="/teacher/student-monitor"
						element={
							<TeacherRoute>
								<StudentMornitor />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/create-news"
						element={
							<TeacherRoute>
								<CreateNews />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/edit-news/:articleId"
						element={
							<TeacherRoute>
								<EditNews />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/update-scheduler"
						element={
							<TeacherRoute>
								<UpdateScheduler />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/upload-csv"
						element={
							<TeacherRoute>
								<CsvUpload />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/employer-list"
						element={
							<TeacherRoute>
								<EmployerList />
							</TeacherRoute>
						}
					/>
					<Route
						path="/teacher/export-eval"
						element={
							<TeacherRoute>
								<ExportEval />
							</TeacherRoute>
						}
					/>

					{/* EMPLOYER Routes */}

					<Route
						path="/employer/application"
						element={
							<EmployerRoute>
								<EmSeeApply />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/my-students"
						element={
							<EmployerRoute>
								<EmConfirmApply />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/profile"
						element={
							<EmployerRoute>
								<EmProfile />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/profile/edit"
						element={
							<EmployerRoute>
								<EmEditProfile />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/all-job"
						element={
							<EmployerRoute>
								<EmAllJob />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/create-job"
						element={
							<EmployerRoute>
								<EmCreateJob />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/evaluation"
						element={
							<EmployerRoute>
								<EmEvaluationForm />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/questionnaire"
						element={
							<EmployerRoute>
								<EmQuestionnaire />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/CreateJob"
						element={
							<EmployerRoute>
								<CreateJob />
							</EmployerRoute>
						}
					/>
					<Route
						path="/employer/EditPost/:jobId"
						element={
							<EmployerRoute>
								<EmEditPost />
							</EmployerRoute>
						}
					/>
					<Route
						path="/check-verify-email"
						element={
							<EmployerRoute>
								<CheckVerifyEmail />
							</EmployerRoute>
						}
					/>

					{/* <Route path="/test1" element={<Test1 />} /> */}
					<Route path="*" element={<PageNotFound />} />
				</Routes>

				<ScrollToTop />

				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
