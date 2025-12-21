import React, { useState } from "react";
import axios from "axios";
import './Login.css'
import Navbar from "../user/Navbar.jsx";
import Footer from "../user/Footer.jsx";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [form, setForm] = useState({
    name: "",
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
        "http://localhost:3000/api/auth/signup",
        form
      );
      alert("Signup successful");
      navigate("/");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <>
    <Navbar />
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

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

        <button type="submit">Signup</button>
      </form>
    </div>
    <Footer />

    </>
  );
};

export default Signup;


// import React, { useState } from "react";
// import Navbar from "../../componets/user/Navbar";
// import Footer from "../../componets/user/Footer";
// import axios from "axios";

// const SignupPage = () => {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // Handle input changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     try {
//       const res = await axios.post("http://localhost:3000/api/signup", form);
//       setMessage(res.data.message);
//       setForm({ name: "", email: "", password: "" });
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
//         <h2>Signup</h2>

//         {message && <p style={{ color: "green" }}>{message}</p>}
//         {error && <p style={{ color: "red" }}>{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "10px" }}>
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>

//           <div style={{ marginBottom: "10px" }}>
//             <label>Email:</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               required
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>

//           <div style={{ marginBottom: "10px" }}>
//             <label>Password:</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               required
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>

//           <button type="submit" style={{ padding: "10px 20px" }}>
//             Signup
//           </button>
//         </form>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default SignupPage;
