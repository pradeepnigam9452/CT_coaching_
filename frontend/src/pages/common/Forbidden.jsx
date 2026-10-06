import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Forbidden = () => {
  const { user, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const dashboardUrl = user ? getDashboardPath(user.role) : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 text-white">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">403 — Access Denied</h1>
        <p className="text-slate-400 text-sm mb-6">
          You do not have the required permissions or role ({user?.role || "guest"}) to access this page. Please return to your designated dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </button>
          <Link
            to={dashboardUrl}
            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-600/30"
          >
            <Home className="w-4 h-4 mr-1" />
            Go to My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
