import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ScrollToTop from "./components/scrollToTop";

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

// pages (auth)
import InLogin from "./pages/auth/InLogin";
import ExLogin from "./pages/auth/ExLogin";
import ExRegister from "./pages/auth/ExRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// pages (ADMIN protected)
import AdminIndex from "./pages/admin/AdminIndex";
import EmployerList from "./pages/admin/EmployerList";
import ManageRole from "./pages/admin/ManageRole";
import CsvUpload from "./pages/admin/CsvUpload";

// pages (STUDENT protected)
import StdInternship from "./pages/student/StdInternship";
import SelfEnroll from "./pages/student/SelfEnroll";
import StdProfile from "./pages/student/StdProfile";
import MyEmployer from "./pages/student/MyEmployer";
import StdEditProfile from "./pages/student/StdEditProfile";
import UploadDocs from "./pages/student/UploadDocs";
import StdAllDocs from "./pages/student/StdAllDocs";

// pages (TEACHER protected)
import Teacher from "./pages/teacher/Teacher";
import CreateNews from "./pages/teacher/CreateNews";
import StudentMornitor from "./pages/teacher/StudentMornitor";
import UpdateScheduler from "./pages/teacher/UpdateScheduler";

// pages (HEAD protected)
import Head from "./pages/head/Head";
import HeadDocs from "./pages/head/HeadDocs";
import SetupDocs from "./pages/head/SetupDocs";

// pages (EMPLOYER protected)
import EmSeeApply from "./pages/employer/EmSeeApply";
import EmConfirmApply from "./pages/employer/EmConfirmApply";
import EmProfile from "./pages/employer/EmProfile";
import EmAllJob from "./pages/employer/EmAllJob";
import EmCreateJob from "./pages/employer/EmCreateJob";
import EmEditProfile from "./pages/employer/EmEditProfile";

// routes
import AdminRoute from "./routes/AdminRoute";
import StudentRoute from "./routes/StudentRoute";
import EmployerRoute from "./routes/EmployerRoute";
import TeacherRoute from "./routes/TeacherRoute";

// services
import { currentUser } from "./services/auth.service";

// data from store
import { useDispatch } from "react-redux";
import { login as loginRedux } from "./store/userSlice";

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
			dispatch(
				loginRedux({
					username: res.data.username,
					role: res.data.role,
					token: token,
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

				<Routes>
					{/* public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/schedule" element={<Schedule />} />
					<Route path="/news" element={<News />} />
					<Route path="/news/article/:articleId" element={<NewsDetail />} />
					<Route path="/alljob" element={<AllJob />} />
					<Route path="/job/:jobId" element={<JobDetail />} />
					<Route
						path="/employer/:employerId/profile"
						element={<EmployerProfile />}
					/>

					{/* if already auth, then redirect to index page? */}
					<Route path="/external/login" element={<ExLogin />} />
					<Route path="/external/register" element={<ExRegister />} />
					<Route path="/internal/login" element={<InLogin />} />
					<Route path="/admin/login" element={<AdminLogin />} />

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
						path="/admin/approve-docs"
						element={
							<AdminRoute>
								<HeadDocs />
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
						path="/admin/student-mornitor"
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

					{/* Employer Routes */}
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
