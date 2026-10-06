import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  CheckSquare,
  IndianRupee,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";
import adminApi from "../../api/adminApi";
import StatCard from "../../components/common/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../api/client";

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading platform administration console..." size="lg" />;

  if (error) {
    return (
      <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl p-4">
        {error}
      </div>
    );
  }

  const { metrics, recentRegistrations, recentEnrollments, popularCourses, recentTestResults, monthlyGrowth } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-purple-950 to-indigo-950 text-white p-6 sm:p-8 shadow-xl shadow-purple-950/20 border border-purple-900/30">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-md text-xs font-semibold text-purple-300 border border-purple-500/30 mb-3">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Executive Administration Console
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Coaching Center LMS Overview
          </h1>
          <p className="mt-2 text-purple-100/80 text-sm sm:text-base leading-relaxed">
            Manage your student enrollments, faculty educators, course curriculum, and platform assessments from a single high-performance cockpit.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/admin/courses"
              className="btn btn-sm sm:btn-md bg-purple-600 hover:bg-purple-700 text-white border-none font-bold rounded-xl shadow-md shadow-purple-600/30"
            >
              Manage Courses
            </Link>
            <Link
              to="/admin/students"
              className="btn btn-sm sm:btn-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl"
            >
              View Students Roster
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Students"
          value={metrics?.totalStudents || 0}
          subtitle="Registered learners"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Faculty Teachers"
          value={metrics?.totalTeachers || 0}
          subtitle="Instructors"
          icon={GraduationCap}
          color="emerald"
        />
        <StatCard
          title="Total Courses"
          value={metrics?.totalCourses || 0}
          subtitle="Active curriculum"
          icon={BookOpen}
          color="purple"
        />
        <StatCard
          title="Enrollments"
          value={metrics?.totalEnrollments || 0}
          subtitle="Active registrations"
          icon={UserCheck}
          color="blue"
        />
        <StatCard
          title="Quizzes / Tests"
          value={metrics?.totalTests || 0}
          subtitle="Evaluations"
          icon={CheckSquare}
          color="amber"
        />
        <StatCard
          title="Platform Revenue"
          value={`₹${(metrics?.totalRevenue || 0).toLocaleString("en-IN")}`}
          subtitle="Gross course fees"
          icon={IndianRupee}
          color="rose"
        />
      </div>

      {/* Popular Courses & Monthly Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Courses Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Top Performing Courses by Demand
              </h2>
              <Link to="/admin/courses" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
                View All Courses
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase font-extrabold border-b border-slate-100">
                    <th className="pb-3">Course Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Tuition</th>
                    <th className="pb-3 text-right">Enrollments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {popularCourses?.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-800 truncate max-w-xs">{c.title}</td>
                      <td className="py-3 text-slate-500">{c.category}</td>
                      <td className="py-3 font-bold text-slate-900">
                        {c.price === 0 ? "FREE" : `₹${c.price.toLocaleString("en-IN")}`}
                      </td>
                      <td className="py-3 text-right font-extrabold text-purple-600">
                        {c.enrolledCount} Students
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Growth Trends Widget */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Student & Enrollment Growth
            </h2>

            <div className="space-y-4">
              {monthlyGrowth?.map((g) => (
                <div key={g.month} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{g.month} 2026</span>
                    <span className="text-purple-600">{g.students} Students • {g.enrollments} Registrations</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                    <div
                      className="bg-purple-600 h-full transition-all"
                      style={{ width: `${Math.min(100, g.students * 2)}%` }}
                    />
                    <div
                      className="bg-sky-400 h-full transition-all"
                      style={{ width: `${Math.min(100, g.enrollments * 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" /> Active Students
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" /> Course Registrations
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Registrations & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent User Registrations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Recent Platform Signups
            </h2>
            <Link to="/admin/students" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
              Manage Users
            </Link>
          </div>

          <div className="space-y-3">
            {recentRegistrations?.map((u) => (
              <div
                key={u._id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                    alt={u.name}
                    className="w-8 h-8 rounded-full bg-slate-200 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : u.role === "teacher"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Course Enrollments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Recent Course Enrollments
            </h2>
            <Link to="/admin/enrollments" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
              Manage Enrollments
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnrollments?.map((e) => (
              <div
                key={e._id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{e.student?.name || "Student"}</h4>
                  <p className="text-[11px] text-slate-500">{e.course?.title || "Course"}</p>
                </div>

                <span className="text-xs font-extrabold text-emerald-700">
                  {e.course?.price ? `₹${e.course.price.toLocaleString("en-IN")}` : "FREE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
