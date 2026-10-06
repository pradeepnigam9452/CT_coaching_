import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  FileCheck,
  TrendingUp,
  PlayCircle,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
  Megaphone,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import StatCard from "../../components/common/StatCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../api/client";

export const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getDashboard();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your learning workspace..." size="lg" />;

  if (error) {
    return (
      <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl p-4">
        {error}
      </div>
    );
  }

  const { student, metrics, continueLearning, recentResults, upcomingTests, announcements, upcomingClasses } = data;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Batch: {student?.batch || "Full Stack"}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Welcome back, {student?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-indigo-100/90 text-sm sm:text-base leading-relaxed">
            Ready to continue your tech career journey? Track your lessons, attempt weekly quizzes, and excel in your coaching milestones.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/student/courses"
              className="btn btn-sm sm:btn-md bg-white text-indigo-900 hover:bg-slate-100 border-none font-bold rounded-xl shadow-md"
            >
              Resume Learning
            </Link>
            <Link
              to="/student/tests"
              className="btn btn-sm sm:btn-md bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-500/40 rounded-xl"
            >
              Take Assessment
            </Link>
          </div>
        </div>

        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Enrolled Courses"
          value={metrics?.totalEnrolled || 0}
          subtitle={`${metrics?.inProgressCourses || 0} in progress`}
          icon={BookOpen}
          color="indigo"
        />
        <StatCard
          title="Completed Courses"
          value={metrics?.completedCourses || 0}
          subtitle="Full curriculum done"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Tests Completed"
          value={metrics?.testsCompleted || 0}
          subtitle="Evaluated quizzes"
          icon={FileCheck}
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${metrics?.averageScore || 0}%`}
          subtitle="Across all assessments"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Continue Learning Section */}
      {continueLearning ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-indigo-600" />
              Continue Learning
            </h2>
            <Link
              to={`/student/learning/${continueLearning.courseId}`}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Open Classroom <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={continueLearning.thumbnail}
                alt={continueLearning.title}
                className="w-20 h-16 sm:w-28 sm:h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
              />
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {continueLearning.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {continueLearning.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instructor: {continueLearning.instructorName}
                </p>
              </div>
            </div>

            <div className="w-full md:w-64 flex-shrink-0">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Progress</span>
                <span className="text-indigo-600 font-bold">{continueLearning.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${continueLearning.progress}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 text-right">
                {continueLearning.completedLessonsCount} / {continueLearning.totalLessonsCount} Lessons
              </p>
            </div>

            <Link
              to={`/student/learning/${continueLearning.courseId}`}
              className="btn btn-primary btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl border-none shadow-md shadow-indigo-600/20 w-full md:w-auto"
            >
              Continue Lesson
            </Link>
          </div>
        </div>
      ) : null}

      {/* Two Column Section: Upcoming Tests & Recent Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assessments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600" />
              Upcoming Tests & Quizzes
            </h2>
            <Link
              to="/student/tests"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingTests && upcomingTests.length > 0 ? (
              upcomingTests.map((t) => (
                <div
                  key={t._id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{t.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{t.course?.title}</span>
                      <span>•</span>
                      <span>{t.durationMinutes} Mins</span>
                    </p>
                  </div>
                  <Link
                    to={`/student/tests/${t._id}`}
                    className="btn btn-xs btn-outline border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg flex-shrink-0"
                  >
                    Start Test
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                No pending upcoming tests for your enrolled courses.
              </p>
            )}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Recent Test Results
            </h2>
            <Link
              to="/student/results"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
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
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{r.testTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Score: {r.score} / {r.totalMarks} ({r.percentage}%)
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      r.passed
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {r.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">
                You haven't attempted any tests yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Live Sessions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Live Classes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-purple-600" />
            Upcoming Live Classes & Workshops
          </h2>

          <div className="space-y-3">
            {upcomingClasses?.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/20 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-indigo-600">{c.date}</span>
                    <span>•</span>
                    <span>{c.instructor}</span>
                  </p>
                </div>
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg flex items-center gap-1 flex-shrink-0"
                >
                  Join <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-amber-500" />
            Platform Announcements
          </h2>

          <div className="space-y-3">
            {announcements && announcements.length > 0 ? (
              announcements.map((a) => (
                <div
                  key={a._id}
                  className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/80"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800">{a.title}</h4>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      {a.authorName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 py-6 text-center">No announcements.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
