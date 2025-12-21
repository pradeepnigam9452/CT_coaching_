import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import '../user/Navbar.jsx'
import '../user/Footer.jsx'
import Navbar from "../user/Navbar.jsx";
import Footer from "../user/Footer.jsx";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("userName", res.data.user.name); // here we can save user name 
      alert("Login successful");
      navigate("/");


    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };




  return (
    <>
    <Navbar />
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>
      </form>

       
    </div>
    <Footer />
    </>
  );
};

export default Login;























// import React, { useState } from 'react'
// import Navbar from '../user/Navbar'
// import Footer from '../user/Footer'
// import './Login.css'

// const Login = () => {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleSubmit = (e) => {
//     e.preventDefault() // prevent page reload

//     console.log(email, password)
//     // here you will send data to backend
//   }

//   return (
//     <>
//       <Navbar />

//       <div className='container'>
//         <form onSubmit={handleSubmit}>
//           <h2>Login here</h2>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <button type="submit">Login</button>
//           <br />
//           <p> <a href="/signup">Don't have account</a> </p>
         
//         </form>
//       </div>

//       <Footer />
//     </>
//   )
// }

// export default Login
