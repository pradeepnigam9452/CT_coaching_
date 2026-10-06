import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getCourseById } from "../../services/courseService.js";
import { getErrorMessage } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { studentApi } from "../../api/studentApi.js";
import {
  Star,
  Clock,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Laptop,
  Check,
  AlertCircle,
} from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModuleIndex, setOpenModuleIndex] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState("");
  const [enrollError, setEnrollError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getCourseById(id)
      .then((data) => {
        if (isMounted) setCourse(data);
      })
      .catch((err) => {
        if (isMounted) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleModule = (index) => {
    setOpenModuleIndex(openModuleIndex === index ? -1 : index);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/course/${id}`);
      return;
    }

    if (user?.role !== "student") {
      setEnrollError(`You are logged in as an ${user?.role}. Please use a Student account to enroll.`);
      return;
    }

    setEnrolling(true);
    setEnrollError("");
    setEnrollSuccess("");

    try {
      await studentApi.enrollInCourse(id);
      setEnrollSuccess("Enrolled successfully! Redirecting to your learning portal...");
      setTimeout(() => {
        navigate(`/student/learning/${id}`);
      }, 1200);
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes("already enrolled")) {
        setEnrollSuccess("You are already enrolled! Opening your classroom...");
        setTimeout(() => {
          navigate(`/student/learning/${id}`);
        }, 1000);
      } else {
        setEnrollError(msg);
      }
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {loading && (
        <div className="flex-1 flex justify-center items-center min-h-[60vh]">
          <span className="loading loading-spinner loading-lg text-indigo-600"></span>
        </div>
      )}

      {!loading && error && (
        <div className="flex-1 flex items-center justify-center py-24 px-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              Course Not Found
            </h2>
            <p className="text-xs text-slate-500 mb-6">{error}</p>
            <Link
              to="/courses"
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
            >
              Back to All Courses
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && course && (
        <div className="flex-1">
          {/* 1. HERO BANNER */}
          <section className="bg-slate-950 text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link to="/courses" className="hover:text-white transition-colors">
                  Courses
                </Link>
                <span>/</span>
                <span className="text-indigo-400 font-semibold truncate max-w-xs sm:max-w-md">
                  {course.title}
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge badge-sm bg-indigo-600/90 text-white border-none font-bold text-[10px]">
                      {course.category || "Development"}
                    </span>
                    <span className="badge badge-sm bg-slate-800 text-slate-200 border-none font-bold text-[10px]">
                      {course.level || "Beginner to Advanced"}
                    </span>
                    <span className="badge badge-sm bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold text-[10px]">
                      {course.mode || "Hybrid Mode"}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                    {course.title}
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
                    {course.description}
                  </p>

                  {/* Highlights Row */}
                  <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 pt-2">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="text-white">{course.rating || "4.9"}</span>
                      <span className="text-slate-400 font-normal">
                        ({course.totalRatings || 64} ratings)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{course.duration || "4 Months"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-sky-400" />
                      <span>
                        Starts:{" "}
                        {course.batchStartDate
                          ? new Date(course.batchStartDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Immediate Access"}
                      </span>
                    </div>
                  </div>

                  {/* Instructor Credit */}
                  {course.instructor && (
                    <div className="flex items-center gap-3 pt-3">
                      <img
                        src={
                          course.instructor.profileImage ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name || "Mentor"}`
                        }
                        alt="Instructor"
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                      />
                      <div>
                        <div className="text-xs text-slate-400 leading-none">Lead Instructor</div>
                        <div className="text-sm font-bold text-white mt-1">
                          {course.instructor.name || course.instructorName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. BODY SECTION (SYLLABUS + CHECKOUT SIDEBAR) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Syllabus & Learning Plan */}
              <div className="lg:col-span-8 space-y-10">
                {/* What You'll Learn Box */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    What You Will Master in This Course
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    {[
                      "Production-ready architecture, clean code standards, and Git workflows.",
                      "End-to-end full project deployment to AWS / Vercel cloud environments.",
                      "Weekly timed mock assessments aligned with real company hiring tests.",
                      "Hands-on database indexing, RESTful APIs, and state management.",
                      "System performance optimization and debugging techniques.",
                      "Preparation for technical interviews and resume portfolio review.",
                    ].map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack & Frameworks */}
                {Array.isArray(course.subjects) && course.subjects.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Technologies &amp; Topics Covered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course.subjects.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Syllabus Modules Accordion */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Curriculum &amp; Module Breakdown
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.modules?.length || 0} Modules &bull; Step-by-step progressive learning
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setOpenModuleIndex(openModuleIndex === -1 ? 0 : -1)
                      }
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      {openModuleIndex === -1 ? "Expand All" : "Collapse"}
                    </button>
                  </div>

                  {Array.isArray(course.modules) && course.modules.length > 0 ? (
                    <div className="space-y-3">
                      {course.modules.map((mod, idx) => {
                        const isOpen = openModuleIndex === idx;
                        return (
                          <div
                            key={mod._id || idx}
                            className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                          >
                            <button
                              onClick={() => toggleModule(idx)}
                              className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/80 text-left transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div>
                                  <h4 className="font-extrabold text-sm text-slate-900">
                                    {mod.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 mt-0.5">
                                    {mod.lessons?.length || 0} Lessons &bull; {mod.description || "Core Concepts"}
                                  </p>
                                </div>
                              </div>
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                            </button>

                            {isOpen && (
                              <div className="p-4 bg-white border-t border-slate-200/80 space-y-2.5">
                                {Array.isArray(mod.lessons) && mod.lessons.length > 0 ? (
                                  mod.lessons.map((lesson, lIdx) => (
                                    <div
                                      key={lesson._id || lIdx}
                                      className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 text-xs"
                                    >
                                      <div className="flex items-center gap-2.5 truncate">
                                        <PlayCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="font-semibold text-slate-800 truncate">
                                          {lesson.title}
                                        </span>
                                      </div>
                                      <span className="text-[11px] font-mono text-slate-500 shrink-0 ml-2">
                                        {lesson.duration || "45 min"}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-slate-400 py-1">
                                    Lessons details available upon enrollment.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                      Detailed syllabus PDF available upon request. Contact our admissions desk.
                    </div>
                  )}
                </div>

                {/* Faculty Spotlight */}
                {course.instructor && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Meet Your Faculty &amp; Mentor
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
                      <img
                        src={
                          course.instructor.profileImage ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor.name || "Mentor"}`
                        }
                        alt="Instructor"
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-md"
                      />
                      <div className="text-center sm:text-left space-y-1">
                        <h4 className="text-lg font-extrabold text-slate-900">
                          {course.instructor.name || course.instructorName}
                        </h4>
                        <p className="text-xs font-semibold text-indigo-600">
                          {course.instructor.specialization || "Senior Engineering Mentor"}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed pt-1 max-w-xl">
                          Ex-Tech Lead with over 8+ years of industry and classroom mentoring
                          experience. Has trained over 2,000+ engineers now working at top tech firms.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Enrollment Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden space-y-5 p-6">
                  {/* Thumbnail Preview */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="badge badge-sm bg-indigo-600 text-white font-bold border-none text-[10px]">
                        {course.mode || "Hybrid Batch"}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-extrabold text-slate-900">
                        &#8377; {Number(course.price || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        &#8377; {Math.round(Number(course.price || 0) * 1.35).toLocaleString("en-IN")}
                      </span>
                      <span className="badge badge-sm bg-emerald-100 text-emerald-700 font-extrabold text-[10px] border-none ml-auto">
                        25% OFF
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Includes all lectures, live doubt clearing, and LMS test engine access.
                    </span>
                  </div>

                  {/* Status & Messages */}
                  {enrollSuccess && (
                    <div className="alert alert-success bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-2xl p-3">
                      {enrollSuccess}
                    </div>
                  )}

                  {enrollError && (
                    <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-2xl p-3">
                      {enrollError}
                    </div>
                  )}

                  {/* Action CTA Button */}
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="btn btn-md sm:btn-lg w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl border-none shadow-xl shadow-indigo-600/30 text-sm flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <span>{isAuthenticated ? "Enroll in Course" : "Sign In to Enroll"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Guarantee & Specs */}
                  <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Instant Access to Student Portal</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Weekly Live Chapter Assessments</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Verified Completion Certificate</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1:1 Mentor Code Review Calls</span>
                    </div>
                  </div>

                  {/* Helpline */}
                  <div className="bg-slate-50 rounded-2xl p-3.5 text-center text-xs text-slate-500 border border-slate-200/60">
                    Have admissions questions? Call{" "}
                    <a href="tel:+918305729451" className="font-bold text-indigo-600 hover:underline">
                      +91 83057 29451
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CourseDetails;