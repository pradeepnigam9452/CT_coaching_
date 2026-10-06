import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const NotFound = () => {
  const { user, getDashboardPath } = useAuth();
  const homeUrl = user ? getDashboardPath(user.role) : "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-slate-800">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-100">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Page Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">
          The page you are looking for might have been moved, renamed, or does not exist in the LMS.
        </p>
        <Link
          to={homeUrl}
          className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 border-none shadow-md inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Safety
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
