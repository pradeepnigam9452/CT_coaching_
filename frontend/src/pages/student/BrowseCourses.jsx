import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Clock,
  BarChart,
  CheckCircle,
  PlayCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState("default");
  const [enrollingId, setEnrollingId] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const navigate = useNavigate();

  const categories = [
    "All",
    "Web Development",
    "Programming & DSA",
    "Data Science & AI",
    "Mobile App Development",
    "Cloud & DevOps",
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];

  useEffect(() => {
    fetchCourses();
  }, [category, level, sort]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await studentApi.browseCourses({
        search,
        category,
        level,
        sort,
      });
      setCourses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleEnroll = async (course) => {
    try {
      setEnrollingId(course._id);
      await studentApi.enrollInCourse(course._id);
      setSuccessModal(course);
      // Update local state to show enrolled
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? { ...c, isEnrolled: true } : c))
      );
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Course Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Master industry-ready tech skills taught by top coaching faculty and engineers.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course title, keywords, or topics (e.g. React, DSA, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-sm input-bordered w-full pl-10 rounded-xl text-xs bg-slate-50 focus:bg-white h-10"
            />
          </div>
          <button
            type="submit"
            className="btn btn-sm h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
          >
            Search
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level and Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Level:</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="select select-sm select-bordered rounded-xl text-xs bg-slate-50"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select select-sm select-bordered rounded-xl text-xs bg-slate-50"
            >
              <option value="default">Most Recent</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Courses Grid */}
      {loading ? (
        <LoadingSpinner text="Searching course catalog..." size="lg" />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching courses found"
          message="Try adjusting your filters or search keywords to find other learning programs."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch("");
            setCategory("All");
            setLevel("All");
            setSort("default");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between card-hover"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-amber-600 text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {course.rating} ({course.totalRatings})
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BarChart className="w-3.5 h-3.5" />
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">
                      Instructor: <strong className="text-slate-800">{course.instructorName}</strong>
                    </span>
                    <span className="text-xs text-slate-400">{course.totalLessons} Lessons</span>
                  </div>
                </div>
              </div>

              {/* Pricing and Action footer */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Tuition Fee
                  </span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                  </span>
                </div>

                {course.isEnrolled ? (
                  <Link
                    to={`/student/learning/${course._id}`}
                    className="btn btn-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold rounded-xl inline-flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Go to Classroom
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(course)}
                    disabled={enrollingId === course._id}
                    className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20"
                  >
                    {enrollingId === course._id ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <Modal
          isOpen={Boolean(successModal)}
          onClose={() => setSuccessModal(null)}
          title="Enrollment Successful!"
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                You're enrolled in {successModal.title}!
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Your learning journey starts now. Access video lectures, source codes, and interactive quizzes anytime.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setSuccessModal(null)}
                className="btn btn-sm btn-outline border-slate-300"
              >
                Browse More
              </button>
              <button
                onClick={() => {
                  setSuccessModal(null);
                  navigate(`/student/learning/${successModal._id}`);
                }}
                className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Start Learning Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BrowseCourses;
