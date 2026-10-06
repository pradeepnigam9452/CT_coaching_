import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../user/Navbar.jsx";
import Footer from "../user/Footer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getErrorMessage } from "../../api/client.js";
import { GraduationCap, Lock, Mail, ArrowRight, Shield, Sparkles } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginUser(form);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, password) => {
    setForm({ email, password });
    setLoading(true);
    setError("");
    try {
      await loginUser({ email, password });
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
          {/* Header */}
          <div className="p-8 pb-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/20 mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your role-specific coaching center portal.
            </p>
          </div>

          <div className="p-8 pt-2">
            {error && (
              <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl mb-4 p-3">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="label text-xs font-bold text-slate-600">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@coaching.com"
                    className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
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
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4">
              Don't have an account yet?{" "}
              <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
                Create Student Account
              </Link>
            </p>

            {/* Quick 1-Click Demo Login Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-2.5">
                Quick 1-Click Demo Credentials:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student@coaching.com", "student123")}
                  className="btn btn-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold truncate"
                >
                  Student Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("suresh.rana@gmail.com", "teacher123")}
                  className="btn btn-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold truncate"
                >
                  Teacher Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin@coaching.com", "admin123")}
                  className="btn btn-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold truncate"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;