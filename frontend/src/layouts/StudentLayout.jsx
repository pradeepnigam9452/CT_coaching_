import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Bell, User, Search, BookOpen } from "lucide-react";
import StudentSidebar from "../components/student/StudentSidebar";
import { useAuth } from "../context/AuthContext";

export const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-screen sticky top-0">
        <StudentSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <StudentSidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden btn btn-ghost btn-sm p-1.5 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Student Learning Zone
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/browse-courses"
              className="btn btn-sm btn-ghost text-slate-600 hover:text-indigo-600 hidden md:inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Courses</span>
            </Link>

            <Link
              to="/student/notifications"
              className="btn btn-ghost btn-circle btn-sm text-slate-600 hover:text-indigo-600 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-2 right-2" />
            </Link>

            {/* Profile Pill */}
            <Link
              to="/student/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors"
            >
              <img
                src={
                  user?.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Student"}`
                }
                alt={user?.name}
                className="w-7 h-7 rounded-full bg-indigo-200 object-cover"
              />
              <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate hidden sm:inline">
                {user?.name?.split(" ")[0] || "Student"}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
