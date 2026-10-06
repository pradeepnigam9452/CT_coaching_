import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { getCourses } from "../../services/courseService.js";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  BookOpen,
  Award,
  Laptop,
  Code2,
  TrendingUp,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  PhoneCall,
  Clock,
  Play,
} from "lucide-react";

const stats = [
  { value: "4,500+", label: "Students Trained", icon: Users },
  { value: "94%", label: "Placement Success", icon: TrendingUp },
  { value: "18 LPA", label: "Highest CTC Offered", icon: Award },
  { value: "4.9 / 5", label: "Student Satisfaction", icon: Star },
];

const pillars = [
  {
    icon: Code2,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 text-blue-600",
    title: "100% Project-Based Pedagogy",
    desc: "Build real full-stack web applications, REST APIs, and machine learning models that stand out on GitHub.",
  },
  {
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-emerald-600",
    title: "Live Mentorship & 1:1 Doubts",
    desc: "Direct guidance by senior software architects with daily dedicated doubt clearance sessions.",
  },
  {
    icon: BrainCircuit,
    color: "from-purple-500 to-indigo-600",
    bg: "bg-purple-50 text-purple-600",
    title: "Built-In Online Test Portal",
    desc: "Practice with chapter-wise quizzes, real coding challenges, and mock interview test series on our LMS.",
  },
  {
    icon: Award,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 text-amber-600",
    title: "Placement Assistance Cell",
    desc: "Resume optimization, LinkedIn profile review, and interview referral support with leading tech companies.",
  },
  {
    icon: Laptop,
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50 text-rose-600",
    title: "Online & Offline Bhopal Campus",
    desc: "Study at our modern AC smart lab in Zone-II MP Nagar, Bhopal or join live interactive online sessions.",
  },
  {
    icon: ShieldCheck,
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50 text-sky-600",
    title: "Lifetime Notes & Certificate",
    desc: "Lifetime access to classroom lecture recordings, study PDFs, and an ISO-recognized completion certificate.",
  },
];

const learningSteps = [
  {
    step: "01",
    title: "Choose Track & Enroll",
    desc: "Pick Full Stack, Python Data Science, or DSA according to your college year or career goal.",
  },
  {
    step: "02",
    title: "Live Classes & Coding Labs",
    desc: "Attend instructor-led sessions, practice exercises daily, and push clean code to GitHub.",
  },
  {
    step: "03",
    title: "Weekly Tests & Code Reviews",
    desc: "Take timed assessments on our student portal and receive mentor feedback on code quality.",
  },
  {
    step: "04",
    title: "Capstone Project & Placements",
    desc: "Ship a production-ready application, crack mock interviews, and apply to top hiring drives.",
  },
];

const testimonials = [
  {
    name: "Aditya Verma",
    role: "Full Stack Engineer @ Infosys",
    package: "8.5 LPA",
    text: "CT Coaching completely changed my career path. The MERN stack modules and project code reviews gave me the exact confidence I needed to clear 3 technical interview rounds.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    batch: "MERN Batch 2024",
  },
  {
    name: "Pooja Sharma",
    role: "Data Analyst @ Cognizant",
    package: "7.2 LPA",
    text: "Dr. Anjali Tiwari's Python & Pandas curriculum was exceptionally practical. The LMS tests and downloadable datasets helped me master data wrangling and predictive modeling.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    batch: "Data Science Batch",
  },
  {
    name: "Rohan Patel",
    role: "Software Developer @ Tech Startup",
    package: "12 LPA",
    text: "The DSA Masterclass covered dynamic programming and graphs so thoroughly. The mock coding contests on this portal simulated real hiring assessments.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    batch: "DSA Intensive",
  },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(Array.isArray(data) ? data : data?.courses || []))
      .catch((err) => console.error("Failed to load courses:", err))
      .finally(() => setLoadingCourses(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle dynamic background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/30 blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] rounded-full bg-sky-500/20 blur-[120px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admissions Open 2026 &bull; Online &amp; Bhopal Campus</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Learn Code Today.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300">
                  Build Real Tech.
                </span>{" "}
                Lead Tomorrow.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Join Central India&apos;s most outcome-focused coaching center. Master
                Full Stack Web Development, Data Science, and DSA through live classes,
                hands-on portfolio projects, and structured mentor assessments.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/courses"
                  className="btn btn-md sm:btn-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl border-none shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 group px-7 text-sm sm:text-base"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="btn btn-md sm:btn-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold rounded-2xl backdrop-blur-md inline-flex items-center gap-2 px-6 text-sm sm:text-base"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Free Career Counseling</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Hands-on Coding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>1:1 Weekly Doubt Counters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Placement Referral Drive</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Platform Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Code Editor Mock Window */}
                <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl overflow-hidden backdrop-blur-xl">
                  {/* Window Bar */}
                  <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" /> CT-LMS-LiveClass.jsx
                    </span>
                    <span className="badge badge-xs bg-emerald-500/20 text-emerald-300 border-none font-bold text-[9px] px-2 py-0.5">
                      LIVE
                    </span>
                  </div>

                  {/* Code Body */}
                  <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-2.5">
                    <p className="text-slate-500">// Welcome to CT Coaching Center</p>
                    <p>
                      <span className="text-purple-400">const</span>{" "}
                      <span className="text-sky-300">futureDeveloper</span> = {"{"}
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">institute:</span>{" "}
                      <span className="text-emerald-400">&quot;CT Coaching Bhopal&quot;</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">curriculum:</span>{" "}
                      <span className="text-amber-300">[&quot;React&quot;, &quot;Node.js&quot;, &quot;MongoDB&quot;, &quot;DSA&quot;]</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">readyForHiring:</span>{" "}
                      <span className="text-indigo-400">true</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-slate-400">mentorship:</span>{" "}
                      <span className="text-sky-300">&quot;Daily 1-on-1 Sessions&quot;</span>
                    </p>
                    <p>{"};"}</p>

                    <div className="pt-3 border-t border-slate-800 text-xs">
                      <span className="text-slate-500">&gt; npm run start-career</span>
                      <p className="text-emerald-400 font-bold mt-1">
                        &radic; Compiled successfully! Ready for top tech interviews.
                      </p>
                    </div>
                  </div>

                  {/* Highlight Floating Pill */}
                  <div className="bg-gradient-to-r from-indigo-900/60 to-slate-900 p-3.5 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        CT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-none">New Batch Kickoff</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Every Monday &bull; Online &amp; MP Nagar</p>
                      </div>
                    </div>
                    <Link
                      to="/signup"
                      className="btn btn-xs bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg border-none text-[11px]"
                    >
                      Join Free
                    </Link>
                  </div>
                </div>

                {/* Floating Metrics Badge */}
                <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white text-slate-900 rounded-2xl p-3.5 shadow-2xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">4.9/5 Rating</div>
                    <div className="text-[10px] font-semibold text-slate-500">1,200+ Student Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS TRUST RIBBON */}
      <section className="bg-white border-b border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">
                    {s.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED COURSES (DIRECT FROM DATABASE) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60 inline-block mb-2">
              Structured Learning Tracks
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Programs &amp; Batches
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1 max-w-2xl">
              Choose from our job-ready full-stack and artificial intelligence tracks.
              Designed with practical modules, mock tests, and faculty code reviews.
            </p>
          </div>
          <Link
            to="/courses"
            className="btn btn-outline border-slate-300 hover:border-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-bold rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingCourses ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
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
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">New Batches Being Scheduled</h3>
            <p className="text-xs text-slate-500 mt-1">
              Please check back or contact admissions for custom schedule inquiries.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col overflow-hidden"
              >
                {/* Thumbnail */}
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
                      {course.category || "Development"}
                    </span>
                    <span className="badge badge-sm bg-indigo-600/90 backdrop-blur-md text-white border-none font-bold text-[10px]">
                      {course.mode || "Hybrid"}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-extrabold text-amber-600 shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{course.rating || "4.9"}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{course.duration || "4 Months"}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-bold">
                        {course.modules?.length || 5}+ Modules
                      </span>
                    </div>

                    <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Subjects pills */}
                    {Array.isArray(course.subjects) && course.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.subjects.slice(0, 3).map((sub, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action */}
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
                      className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20 text-xs px-4"
                    >
                      View Syllabus
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE CT COACHING (6 CORE PILLARS) */}
      <section className="bg-slate-100/70 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
              The CT Coaching Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered For Career Outcomes
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              We replace boring passive lectures with real software development,
              mentor code reviews, and structured hiring prep.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${p.bg} flex items-center justify-center mb-5 font-bold`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ROADMAP: 4-STEP PROCESS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
            Your Success Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How You Go From Beginner To Hired
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            A battle-tested 4-step framework followed by thousands of successful alumni.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningSteps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-indigo-300 transition-colors"
            >
              <div className="text-3xl font-extrabold text-indigo-600/25 mb-4">
                {step.step}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ALUMNI PLACEMENT STORIES */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-900/40 px-3 py-1 rounded-full border border-indigo-700/60 inline-block">
              Alumni Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Real Students. Real Tech Placements.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Hear from graduates who secured roles at top product and service firms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-3xl p-7 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    &quot;{t.text}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-white leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-400">
                      {t.role} ({t.package})
                    </p>
                    <span className="text-[10px] text-slate-500">{t.batch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH CONVERSION CTA BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="badge badge-sm bg-white/20 text-white font-bold border-none text-[10px] tracking-wide uppercase px-3 py-1">
              Start Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Break Into Tech in 2026?
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              Book a free 1-on-1 counseling session with our senior instructors or visit
              our campus in Bhopal for a free demo classroom experience.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              to="/signup"
              className="btn btn-md sm:btn-lg bg-white hover:bg-slate-100 text-indigo-700 font-extrabold rounded-2xl border-none shadow-xl px-7 text-xs sm:text-sm"
            >
              Enroll Free Today
            </Link>
            <Link
              to="/contact"
              className="btn btn-md sm:btn-lg bg-indigo-900/40 hover:bg-indigo-900/60 text-white border border-white/30 font-bold rounded-2xl text-xs sm:text-sm px-6"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;