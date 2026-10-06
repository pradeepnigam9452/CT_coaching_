import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Video,
  FileText,
  CheckSquare,
  Award,
  User,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const teacherNavItems = [
  { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/courses", label: "My Courses", icon: BookOpen },
  { to: "/teacher/students", label: "Enrolled Students", icon: Users },
  { to: "/teacher/lessons", label: "Lessons Manager", icon: Video },
  { to: "/teacher/materials", label: "Study Materials", icon: FileText },
  { to: "/teacher/tests", label: "Tests & Quizzes", icon: CheckSquare },
  { to: "/teacher/results", label: "Gradebook / Results", icon: Award },
  { to: "/teacher/profile", label: "Profile", icon: User },
];

export const TeacherSidebar = ({ onClose }) => {
  const { user, logoutUser } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              CT Coaching
            </h1>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400">
              Instructor Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Teaching Workspace
        </div>
        {teacherNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Teacher Profile Card */}
      <div className="px-3 pb-3">
        <div className="p-3 bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-900/50 rounded-xl flex items-center gap-3">
          <img
            src={
              user?.profileImage ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Teacher"}`
            }
            alt={user?.name}
            className="w-9 h-9 rounded-lg bg-emerald-700/40 object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Faculty"}</p>
            <p className="text-[11px] text-emerald-300/80 truncate">Verified Educator</p>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logoutUser}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 text-sm font-medium transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TeacherSidebar;
