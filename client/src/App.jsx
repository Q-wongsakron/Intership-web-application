import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// pages and components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import News from "./pages/News";
import JobDetail from "./pages/JobDetail";
import AllJob from "./pages/AllJob";
import PageNotFound from "./pages/PageNotFound";

// pages (auth)
import InLogin from "./pages/auth/InLogin";
import ExLogin from "./pages/auth/ExLogin";
import ExRegister from "./pages/auth/ExRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// pages (protected)
import AdminIndex from "./pages/admin/AdminIndex";
import EmployerList from "./pages/admin/EmployerList";
import Head from "./pages/Head";
import Teacher from "./pages/Teacher";
import Student from "./pages/Student";
import SelfEnroll from "./pages/SelfEnroll";
import Employer from "./pages/Employer";

// routes
import AdminRoute from "./routes/AdminRoute";
import StudentRoute from "./routes/StudentRoute";

// services
import { currentUser } from "./services/auth.service";

// data from store
import { useDispatch } from "react-redux";
import { login as loginRedux } from "./store/userSlice";
import CsvUploader from "./pages/admin/CsvUpload";
import ManageUser from "./pages/admin/ManageRole";

function App() {
  const ROLES = {
    admin: "admin",
    head: "head",
    teacher: "teacher",
    student: "student",
    employer: "employer",
  };

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
                <CsvUploader />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/change-role"
            element={
              <AdminRoute>
                <ManageUser />
              </AdminRoute>
            }
          />

          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
