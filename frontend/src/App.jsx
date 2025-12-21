import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./componets/user/Home";
import About from "./componets/user/About";
import Courses from "./componets/user/Courses";
import CourseDetails from "./componets/user/CourseDetails";
import Contact from "./componets/user/Contact";
import Login from "./componets/auth/Login";
import Signup from "./componets/auth/SignUp";
import LoginStaff from "./componets/Staff/LoginStaff";
import StudentList from "./componets/student/StudentList";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/courses" element={<Courses />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/stafflogin" element={<LoginStaff />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/studentlist" element = {<StudentList />} />
      </Routes>
    </>
  );
};

export default App;
