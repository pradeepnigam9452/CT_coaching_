import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu, X, PlusCircle, Shield } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 h-screen sticky top-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 z-10">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 text-slate-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <AdminSidebar onClose={() => setMobileOpen(false)} />
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Root Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/courses"
              className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-none shadow-sm rounded-lg font-medium hidden sm:inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Course</span>
            </Link>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate hidden sm:inline">
                {user?.name || "Administrator"}
              </span>
            </div>
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

export default AdminLayout;
