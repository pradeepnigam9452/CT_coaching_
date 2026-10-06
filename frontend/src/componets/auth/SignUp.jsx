import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../user/Navbar.jsx";
import Footer from "../user/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getErrorMessage } from "../../api/client.js";
import { GraduationCap, Mail, Lock, User, Phone, Sparkles } from "lucide-react";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    batch: "FSD",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signupUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signupUser(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-200/80 overflow-hidden">
          <div className="p-8 pb-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Join CT Coaching Center and start your learning program.
            </p>
          </div>

          <div className="p-8 pt-2">
            {error && (
              <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl mb-4 p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="label text-xs font-bold text-slate-600">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Amit Sharma"
                    className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@gmail.com"
                    className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label text-xs font-bold text-slate-600">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 98765..."
                    className="input input-sm input-bordered w-full rounded-xl text-xs"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-600">Batch Goal</label>
                  <select
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                    className="select select-sm select-bordered w-full rounded-xl text-xs"
                  >
                    <option value="FSD">Full Stack (FSD)</option>
                    <option value="DSA">Data Structures (DSA)</option>
                    <option value="DS">Data Science & AI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 6 characters"
                    className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-sm sm:btn-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20 mt-2"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Complete Registration"}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;