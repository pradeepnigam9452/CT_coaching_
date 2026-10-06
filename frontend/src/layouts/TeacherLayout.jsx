import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X, PlusCircle, Bell } from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { useAuth } from "../context/AuthContext";

export const TeacherLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-screen sticky top-0">
        <TeacherSidebar />
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
            <TeacherSidebar onClose={() => setMobileOpen(false)} />
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
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Faculty Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/teacher/lessons"
              className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-sm rounded-lg font-medium hidden sm:inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Lesson</span>
            </Link>

            {/* Profile Pill */}
            <Link
              to="/teacher/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors"
            >
              <img
                src={
                  user?.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Teacher"}`
                }
                alt={user?.name}
                className="w-7 h-7 rounded-full bg-emerald-200 object-cover"
              />
              <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate hidden sm:inline">
                {user?.name || "Faculty"}
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

export default TeacherLayout;
