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
import Student from "./pages/student/Student";
import SelfEnroll from "./pages/student/SelfEnroll";
import StdProfile from "./pages/student/StdProfile";

// pages (TEACHER protected)
import Teacher from "./pages/teacher/Teacher";

// pages (HEAD protected)
import Head from "./pages/head/Head";

// pages (EMPLOYER protected)
import Employer from "./pages/employer/Employer";
import EmProfile from "./pages/employer/EmProfile";
import EmAllJob from "./pages/employer/EmAllJob";
import CreateJob from "./pages/employer/CreateJob";
import PreviewJob from "./pages/employer/Preview";

// routes
import AdminRoute from "./routes/AdminRoute";
import StudentRoute from "./routes/StudentRoute";
import EmployerRoute from "./routes/EmployerRoute";

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
          <Route path="/news/:newsId" element={<News />} />
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
            path="/student"
            element={
              <StudentRoute>
                <Student />
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

          {/* Employer Routes */}
          <Route
            path="/employer"
            element={
              <EmployerRoute>
                <Employer />
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
                <CreateJob />
              </EmployerRoute>
            }
          />
          <Route
            path="/employer/preview"
            element={
              <EmployerRoute>
                <PreviewJob />
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
