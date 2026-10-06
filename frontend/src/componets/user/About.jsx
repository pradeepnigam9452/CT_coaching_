import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  GraduationCap,
  Sparkles,
  Target,
  Eye,
  Award,
  Users,
  Building2,
  CheckCircle2,
  MapPin,
  Laptop,
  Terminal,
  BookOpen,
  ArrowRight,
} from "lucide-react";

const milestones = [
  {
    year: "2024",
    title: "Foundation in Bhopal",
    desc: "Started with an intimate batch of 25 passionate software aspirants in MP Nagar Zone-II.",
  },
  {
    year: "2025",
    title: "Full-Stack LMS Rollout",
    desc: "Introduced our proprietary online test portal, automated code evaluations, and hybrid learning tracks.",
  },
  {
    year: "2026",
    title: "4,500+ Mentored Engineers",
    desc: "Achieved over 94% placement rate with alumni at Infosys, TCS, Cognizant, and high-growth VC startups.",
  },
];

const faculty = [
  {
    name: "Dr. Anjali Tiwari",
    role: "Head of Data Science & Machine Learning",
    experience: "10+ Years in Applied AI & Algorithms",
    bio: "Former research scholar and tech lead specializing in Python, predictive modeling, and data pipelines.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Suresh Rana",
    role: "Principal Full Stack Architect",
    experience: "8+ Years in Cloud & Web Engineering",
    bio: "Full stack expert specialized in React, Node.js microservices, distributed caching, and DevOps pipelines.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Vikram Malhotra",
    role: "DSA & System Design Mentor",
    experience: "7+ Years in Competitive Programming",
    bio: "Candidate Master on Codeforces, coached 500+ candidates through tough product-based company rounds.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-0 right-1/3 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ISO 9001:2015 Certified Coaching Institute
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Engineering Real Developers.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
              Not Just Certificate Collectors.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            CT Coaching Center (Coding Thinker) was founded in Bhopal with a single
            uncompromising mission: to bridge the gap between outdated college syllabus
            and actual high-paying software engineering jobs.
          </p>
        </div>
      </section>

      {/* 2. MISSION & VISION DUAL CARDS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Our Core Mission
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To empower young engineering students and career-switchers with production-ready
              skills through intensive hands-on coding, genuine mentor reviews, and an end-to-end
              learning management system designed for mastery.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Industry-relevant tech curriculum reviewed every quarter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero fluff: 80% practical projects, 20% theory</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Comprehensive placement referral network</span>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Our Vision
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be India&apos;s most trusted hybrid coaching network, empowering tier-2 and tier-3
              college engineers to compete with and exceed students from premier national institutes
              on merit and problem-solving prowess.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Democratizing top-tier tech mentorship for all backgrounds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Building cutting-edge LMS evaluation &amp; automated test engines</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>Cultivating a lifelong alumni community of software leaders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR PEDAGOGY: THE 80/20 RULE */}
      <section className="bg-slate-100/70 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
              Teaching Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 80/20 Engineering Pedagogy
            </h2>
            <p className="text-slate-500 text-sm">
              Why our students crack technical interviews in weeks instead of years.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Live Coding Labs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every theoretical concept is backed up by live terminal demonstration and student hands-on typing. No passive video watching.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">Chapter-Wise Tests</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take timed quizzes and coding tests directly on our portal after every module, with instant analytics and rank tracking.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 font-extrabold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="font-extrabold text-lg text-slate-900">1:1 Code Reviews</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instructors review your GitHub pull requests, giving line-by-line feedback on readability, performance, and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FACULTY LEADERSHIP */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
            Our Mentors
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet the Senior Faculty
          </h2>
          <p className="text-slate-500 text-sm">
            Learn from engineers who have shipped software at scale and trained thousands of candidates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faculty.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="h-60 overflow-hidden bg-slate-100 relative">
                <img
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-bold text-white">
                  {f.experience}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {f.name}
                  </h3>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">
                    {f.role}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {f.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BHOPAL CAMPUS & SMART LAB HIGHLIGHTS */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
                Modern Infrastructure
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Zone-II MP Nagar Bhopal Campus
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Whether you choose offline classroom learning or our online interactive portal,
                CT Coaching Center offers a world-class environment built for concentration and coding.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span>High-speed optical fiber labs with ergonomic dual-screen workstations.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Daily 2-hour offline doubt clearing counters with resident mentors.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span>Smart projector classrooms equipped with live streaming cameras.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="btn btn-sm sm:btn-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl border-none shadow-md shadow-indigo-600/20 text-xs px-5 inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Visit Our Campus / Schedule Walk-In</span>
                </Link>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop"
                alt="Coaching classroom"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-8 sm:p-12 text-center space-y-4 shadow-xl border border-indigo-800/40">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Want to Experience Our Teaching Firsthand?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Attend a free live demo lecture this week or speak with our senior academic counselor.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/courses"
              className="btn btn-sm sm:btn-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl border-none text-xs px-6"
            >
              Browse Syllabus &amp; Batches
            </Link>
            <Link
              to="/contact"
              className="btn btn-sm sm:btn-md bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold rounded-xl text-xs px-6"
            >
              Talk to Counselor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
