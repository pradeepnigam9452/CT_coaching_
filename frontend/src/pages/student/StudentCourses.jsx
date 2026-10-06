import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, PlayCircle, CheckCircle, Search, Compass } from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, in-progress, completed
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getMyCourses();
      setCourses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "in-progress" && c.progress < 100) ||
      (filter === "completed" && c.progress >= 100);

    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) return <LoadingSpinner text="Loading your enrolled courses..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your course progress, attend lessons, and earn certificates.
          </p>
        </div>
        <Link
          to="/student/browse-courses"
          className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl border-none shadow-md shadow-indigo-600/20 inline-flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Browse More Courses
        </Link>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {["all", "in-progress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          message={
            search
              ? "No courses match your search criteria."
              : "You have not enrolled in any courses in this category yet."
          }
          actionLabel="Explore Available Courses"
          onAction={() => (window.location.href = "/student/browse-courses")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.courseId}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col card-hover"
            >
              {/* Thumbnail Header */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {c.category}
                </span>
                {c.progress >= 100 && (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Instructor: {c.instructorName}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                    <span>Course Progress</span>
                    <span className="text-indigo-600">{c.progress}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.progress >= 100 ? "bg-emerald-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                    <span>
                      {c.completedLessons} / {c.totalLessons} Lessons Completed
                    </span>
                    <span>{c.duration}</span>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/student/learning/${c.courseId}`}
                    className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full mt-4 rounded-xl border-none shadow-md shadow-indigo-600/20 inline-flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-4 h-4" />
                    {c.progress >= 100 ? "Review Course" : "Continue Learning"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
