import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  CheckSquare,
  Award,
  Video,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import teacherApi from "../../api/teacherApi";
import StatCard from "../../components/common/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../api/client";

export const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await teacherApi.getDashboard();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading instructor workspace..." size="lg" />;

  if (error) {
    return (
      <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl p-4">
        {error}
      </div>
    );
  }

  const { metrics, recentActivity, recentResults, coursePerformance, upcomingClasses } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-emerald-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Educator Hub
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Faculty Instructor Dashboard
          </h1>
          <p className="mt-2 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Manage your assigned courses, create video lessons, publish practice quizzes, and track real-time student batch performance.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/teacher/lessons"
              className="btn btn-sm sm:btn-md bg-white text-emerald-950 hover:bg-slate-100 border-none font-bold rounded-xl shadow-md"
            >
              Add New Lesson
            </Link>
            <Link
              to="/teacher/tests"
              className="btn btn-sm sm:btn-md bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/40 rounded-xl"
            >
              Create Assessment
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Assigned Courses"
          value={metrics?.assignedCourses || 0}
          subtitle="Courses in your care"
          icon={BookOpen}
          color="emerald"
        />
        <StatCard
          title="Total Students"
          value={metrics?.totalStudents || 0}
          subtitle="Enrolled active learners"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Courses"
          value={metrics?.activeCourses || 0}
          subtitle="Published & live"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Tests Created"
          value={metrics?.testsCreated || 0}
          subtitle="Evaluated quizzes"
          icon={CheckSquare}
          color="amber"
        />
      </div>

      {/* Course Performance & Progress */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Batch Performance & Completion Progress
          </h2>
          <Link to="/teacher/courses" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800">
            Manage Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coursePerformance?.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  {c.category}
                </span>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mt-0.5">
                  {c.title}
                </h4>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Average Progress</span>
                  <span className="text-emerald-600 font-bold">{c.avgProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${c.avgProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                <span>{c.studentsCount} Students Enrolled</span>
                <Link
                  to="/teacher/students"
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  View Batch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Recent Student Activity & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Student Activity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              Recent Student Activity
            </h2>
            <Link
              to="/teacher/students"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              All Students
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{a.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {a.courseTitle} • {a.progress}% Completed
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Active
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No student activity recorded yet.</p>
            )}
          </div>
        </div>

        {/* Recent Assessment Submissions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Recent Assessment Submissions
            </h2>
            <Link
              to="/teacher/results"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              Gradebook
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {recentResults && recentResults.length > 0 ? (
              recentResults.map((r) => (
                <div
                  key={r._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{r.studentName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.testTitle} • Score: {r.score}/{r.totalMarks} ({r.percentage}%)
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      r.passed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {r.passed ? "PASS" : "FAIL"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No quiz submissions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
