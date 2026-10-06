import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public Pages
import Home from "./componets/user/Home";
import About from "./componets/user/About";
import Courses from "./componets/user/Courses";
import CourseDetails from "./componets/user/CourseDetails";
import Contact from "./componets/user/Contact";
import Login from "./componets/auth/Login";
import Signup from "./componets/auth/SignUp";
import StudentList from "./componets/student/StudentList";
import Forbidden from "./pages/common/Forbidden";
import NotFound from "./pages/common/NotFound";

// Layouts
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
import AdminLayout from "./layouts/AdminLayout";

// Student Dashboard Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import BrowseCourses from "./pages/student/BrowseCourses";
import StudentLearning from "./pages/student/StudentLearning";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentTests from "./pages/student/StudentTests";
import StudentTakeTest from "./pages/student/StudentTakeTest";
import StudentResults from "./pages/student/StudentResults";
import StudentProfile from "./pages/student/StudentProfile";
import StudentNotifications from "./pages/student/StudentNotifications";

// Teacher Dashboard Pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherMaterials from "./pages/teacher/TeacherMaterials";
import TeacherTests from "./pages/teacher/TeacherTests";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherResults from "./pages/teacher/TeacherResults";
import TeacherProfile from "./pages/teacher/TeacherProfile";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminTests from "./pages/admin/AdminTests";
import AdminResults from "./pages/admin/AdminResults";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* 1. STUDENT DASHBOARD ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="browse-courses" element={<BrowseCourses />} />
          <Route path="learning/:courseId" element={<StudentLearning />} />
          <Route path="materials" element={<StudentMaterials />} />
          <Route path="tests" element={<StudentTests />} />
          <Route path="tests/:id" element={<StudentTakeTest />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* 2. TEACHER DASHBOARD ROUTES */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="lessons" element={<TeacherLessons />} />
          <Route path="materials" element={<TeacherMaterials />} />
          <Route path="tests" element={<TeacherTests />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* 3. ADMIN DASHBOARD ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="tests" element={<AdminTests />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
