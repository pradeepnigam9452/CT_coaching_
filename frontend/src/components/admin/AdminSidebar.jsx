import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderTree,
  CheckSquare,
  Award,
  UserCheck,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const adminNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/teachers", label: "Teachers", icon: GraduationCap },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/tests", label: "Tests & Quizzes", icon: CheckSquare },
  { to: "/admin/results", label: "Results & Gradebook", icon: Award },
  { to: "/admin/enrollments", label: "Enrollments", icon: UserCheck },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Platform Settings", icon: Settings },
];

export const AdminSidebar = ({ onClose }) => {
  const { user, logoutUser } = useAuth();

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col h-full border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
              CT Coaching
            </h1>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-400">
              Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
          Platform Administration
        </div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Admin Profile Card */}
      <div className="px-3 pb-3">
        <div className="p-3 bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-900/40 rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-purple-300 truncate">Super Administrator</p>
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

export default AdminSidebar;
