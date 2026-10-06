import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../user/Navbar";
import Footer from "../user/Footer";
import { getStudents } from "../../services/studentService.js";
import { getErrorMessage } from "../../api/client.js";
import {
  Users,
  Search,
  GraduationCap,
  Sparkles,
  Shield,
  BookOpen,
  Mail,
  UserCheck,
} from "lucide-react";

const badgeForRole = (role) => {
  if (role === "admin") return "bg-purple-100 text-purple-700 border-purple-200";
  if (role === "teacher") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-indigo-100 text-indigo-700 border-indigo-200";
};

const StudentList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    getStudents()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = useMemo(() => {
    return data.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.batch?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || u.role?.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [data, searchQuery, roleFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            CT Coaching Community Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Students &amp; Faculty Directory
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Meet the active learners, alumni engineers, and faculty mentors shaping the
            CT Coaching learning ecosystem.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or batch (e.g. FSD, DSA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Role Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All Members" },
              { id: "student", label: "Students" },
              { id: "teacher", label: "Teachers & Mentors" },
              { id: "admin", label: "Administrators" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  roleFilter === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Showing <strong>{filteredUsers.length}</strong> members
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="alert alert-error max-w-md mx-auto bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No members found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another keyword or resetting role filters.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredUsers.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <img
                      src={
                        u.profileImage ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || "User"}`
                      }
                      alt={u.name}
                      className="w-12 h-12 rounded-2xl object-cover bg-indigo-50 border border-slate-200"
                    />
                    <div className="truncate">
                      <h3 className="font-extrabold text-base text-slate-900 truncate">
                        {u.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`badge badge-sm uppercase font-bold text-[10px] border px-2 py-0.5 ${badgeForRole(
                        u.role
                      )}`}
                    >
                      {u.role}
                    </span>
                    {u.batch && (
                      <span className="badge badge-sm bg-slate-100 text-slate-600 font-semibold text-[10px] border-none">
                        Batch: {u.batch}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Member
                  </span>
                  <span>Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StudentList;