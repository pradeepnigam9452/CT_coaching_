import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Phone,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses & Tracks" },
  { to: "/about", label: "About Institute" },
  { to: "/studentlist", label: "Community & Alumni" },
  { to: "/contact", label: "Contact & Admissions" },
];

const Navbar = () => {
  const { user, isAuthenticated, logoutUser, getDashboardPath } = useAuth();
  const dashboardPath = user ? getDashboardPath(user.role) : "/login";

  return (
    <>
      {/* Top Admissions Announcement Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-400/30 text-[10px] tracking-wide uppercase">
              <Sparkles className="w-2.5 h-2.5" /> Admissions 2026
            </span>
            <span className="text-slate-300 truncate">
              New batches for Full Stack MERN &amp; Python AI starting this week. Limited seats!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300 shrink-0">
            <a
              href="tel:+918305729451"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>+91 83057 29451</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Bhopal Campus &amp; Online</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="navbar bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 px-4 lg:px-8 transition-all">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle lg:hidden mr-1 text-slate-700"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-2xl z-50 mt-3 w-64 p-3 shadow-2xl border border-slate-200 space-y-1"
            >
              <li className="menu-title text-slate-400 font-bold uppercase text-[10px] px-2 py-1">
                Navigation
              </li>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `font-semibold rounded-xl py-2 px-3 text-xs ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-bold"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <div className="divider my-1"></div>
              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 p-1">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-ghost border border-slate-200 text-xs font-bold rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl border-none"
                  >
                    Register
                  </Link>
                </div>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                  <span className="text-indigo-600">CT</span> Coaching
                </span>
                <span className="badge badge-xs bg-indigo-100 text-indigo-700 font-bold uppercase text-[9px] border-none px-1.5 py-0.5">
                  LMS
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide block leading-none mt-1">
                Think &amp; Code Beyond
              </span>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                      isActive
                        ? "text-indigo-700 bg-indigo-50/80 shadow-xs"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end gap-2.5">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                to={dashboardPath}
                className="btn btn-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20 inline-flex items-center gap-1.5 text-xs px-3.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>My Portal</span>
              </Link>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border border-slate-200"
                >
                  <img
                    src={
                      user.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-full bg-indigo-50 object-cover"
                  />
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-white rounded-2xl z-50 mt-3 w-56 p-3 shadow-2xl border border-slate-200 space-y-1 text-slate-700"
                >
                  <li className="menu-title text-slate-400 font-bold uppercase text-[10px]">
                    Signed in as
                  </li>
                  <li className="font-bold text-slate-900 px-3 py-1">
                    {user.name}
                    <span className="block text-[10px] font-semibold text-indigo-600 capitalize">
                      {user.role} Dashboard
                    </span>
                  </li>
                  <div className="divider my-1" />
                  <li>
                    <Link to={dashboardPath} className="font-medium text-xs">
                      <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                      Dashboard Overview
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutUser}
                      className="text-rose-600 font-medium hover:bg-rose-50 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="btn btn-ghost btn-sm text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl px-3"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="btn btn-sm bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold rounded-xl border-none shadow-md shadow-indigo-600/25 px-4"
              >
                Enroll Free
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;