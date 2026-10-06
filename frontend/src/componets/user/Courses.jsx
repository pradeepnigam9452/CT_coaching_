import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getCourses } from "../../services/courseService.js";
import { getErrorMessage } from "../../api/client.js";
import {
  Search,
  Filter,
  Star,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
} from "lucide-react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(Array.isArray(data) ? data : data?.courses || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Compute categories from loaded courses
  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subjects?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || c.category === selectedCategory;

      const matchesMode =
        selectedMode === "All" ||
        c.mode?.toLowerCase() === selectedMode.toLowerCase();

      return matchesSearch && matchesCategory && matchesMode;
    });
  }, [courses, searchQuery, selectedCategory, selectedMode]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Catalog Header */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Curriculum Aligned with 2026 Tech Industry Hiring
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Explore All Programs &amp; Batches
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain production experience with hands-on coding, live faculty mentorship,
            and complete test series built for high-growth tech careers.
          </p>

          {/* Search & Mode Bar */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search courses, frameworks (e.g. React, Python, DSA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
              />
            </div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 shadow-xl"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online Live</option>
              <option value="Offline">Offline Bhopal</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse space-y-4"
              >
                <div className="h-44 bg-slate-200 rounded-2xl w-full"></div>
                <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {!loading && error && (
          <div className="alert alert-error max-w-lg mx-auto bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold rounded-2xl p-4">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No matching courses found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or clearing selected category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedMode("All");
              }}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl mt-4 text-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden"
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={
                      course.thumbnail ||
                      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="badge badge-sm bg-slate-950/80 backdrop-blur-md text-white border-none font-bold text-[10px] px-2.5 py-1">
                      {course.category || "Engineering"}
                    </span>
                    <span className="badge badge-sm bg-indigo-600/90 backdrop-blur-md text-white border-none font-bold text-[10px]">
                      {course.mode || "Hybrid"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-extrabold text-amber-600 shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{course.rating || "4.8"}</span>
                    <span className="text-[10px] text-slate-400">
                      ({course.totalRatings || 45})
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{course.duration || "4 Months"}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-bold">
                        {course.modules?.length || 5}+ Modules
                      </span>
                      {course.seatsAvailable != null && (
                        <>
                          <span>&bull;</span>
                          <span className="text-amber-600 font-semibold text-[11px]">
                            {course.seatsAvailable} seats left
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Subjects pills */}
                    {Array.isArray(course.subjects) && course.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.subjects.slice(0, 4).map((sub, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Instructor Info */}
                    {course.instructor && (
                      <div className="flex items-center gap-2 pt-2 text-xs text-slate-600">
                        <img
                          src={
                            course.instructor.profileImage ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name || "Mentor"}`
                          }
                          alt="Mentor"
                          className="w-5 h-5 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-[11px] font-medium text-slate-500 truncate">
                          Mentor:{" "}
                          <strong className="text-slate-700">
                            {course.instructor.name || course.instructorName || "Senior Faculty"}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action Link */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                        Tuition Fee
                      </span>
                      <span className="text-xl font-extrabold text-slate-900">
                        &#8377; {Number(course.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      to={`/course/${course._id}`}
                      className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20 text-xs px-4 inline-flex items-center gap-1.5"
                    >
                      <span>Syllabus</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
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

export default Courses;