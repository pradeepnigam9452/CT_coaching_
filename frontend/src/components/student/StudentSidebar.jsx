import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FileText,
  CheckSquare,
  Award,
  Bell,
  User,
  LogOut,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const studentNavItems = [
  { to: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/courses", label: "My Courses", icon: BookOpen },
  { to: "/student/browse-courses", label: "Browse Courses", icon: Compass },
  { to: "/student/materials", label: "Study Materials", icon: FileText },
  { to: "/student/tests", label: "Tests & Quizzes", icon: CheckSquare },
  { to: "/student/results", label: "Results", icon: Award },
  { to: "/student/notifications", label: "Notifications", icon: Bell },
  { to: "/student/profile", label: "Profile", icon: User },
];

export const StudentSidebar = ({ onClose }) => {
  const { user, logoutUser } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              CT Coaching
            </h1>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
              Student Portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Academic Menu
        </div>
        {studentNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
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

      {/* Student Badge Card */}
      <div className="px-3 pb-3">
        <div className="p-3 bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-900/50 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Student"}</p>
            <p className="text-[11px] text-indigo-300/80 truncate">Batch: {user?.batch || "FSD"}</p>
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

export default StudentSidebar;
