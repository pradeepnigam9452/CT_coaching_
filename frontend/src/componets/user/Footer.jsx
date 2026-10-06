import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Newsletter & Counseling strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Get Free Career Counseling &amp; Syllabus
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Subscribe to get curated roadmap roadmaps, weekly coding challenges, and batch alerts.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex items-center w-full max-w-md gap-2"
          >
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-1.5 transition-colors shadow-lg shadow-indigo-600/30"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
        {subscribed && (
          <div className="max-w-7xl mx-auto mt-3 text-center md:text-right">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Thank you! Check your inbox for our 2026 syllabus catalog.
            </span>
          </div>
        )}
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">
                <span className="text-indigo-400">CT</span> Coaching Center
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Empowering aspirational engineers and college students with practical coding skills,
              system architecture, and real software projects. Founded in Bhopal, delivering nationwide.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Zone-II, MP Nagar, Bhopal, Madhya Pradesh 462011</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+918305729451" className="hover:text-white transition-colors">
                  +91 83057 29451 / +91 94520 00000
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:admissions@ctcoaching.com" className="hover:text-white transition-colors">
                  admissions@ctcoaching.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  All Courses &amp; Batches
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition-colors">
                  About Our Institute
                </Link>
              </li>
              <li>
                <Link to="/studentlist" className="hover:text-indigo-400 transition-colors">
                  Student &amp; Alumni Directory
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact &amp; Admissions
                </Link>
              </li>
            </ul>
          </div>

          {/* Flagship Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Programs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Full Stack MERN Bootcamp
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Python for Data Science &amp; AI
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  DSA &amp; Competitive Coding
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  System Design &amp; Backend Masterclass
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  Campus Placement Prep
                </Link>
              </li>
            </ul>
          </div>

          {/* LMS Portals & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">LMS Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">
                  Student Learning Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">
                  Teacher &amp; Faculty Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition-colors">
                  Admin Management Portal
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-indigo-400 transition-colors">
                  New Student Registration
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/918305729451"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  WhatsApp Admissions Help <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-black/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CT Coaching Center (Coding Thinker LMS). All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span>ISO 9001:2015 Certified Curriculum</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>Bhopal, Madhya Pradesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;