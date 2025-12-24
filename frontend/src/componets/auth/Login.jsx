import React, { useState } from "react";
import axios from "axios";
import Navbar from "../user/Navbar.jsx";
import Footer from "../user/Footer.jsx";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      alert("Login successful! Welcome " + res.data.user.name);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-xl animate-slideUp">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Login</h2>
          {error && <div className="alert alert-error mt-2">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-9">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p> <a href="/signup"> Don't have an account? Sign up</a></p>
            <br />
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
