import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { sendContactMessage } from "../../services/authService.js";
import { getErrorMessage } from "../../api/client.js";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
  Building,
} from "lucide-react";

const faqs = [
  {
    q: "Can complete beginners with no coding background join?",
    a: "Absolutely! Our courses begin from fundamental building blocks: basic algorithms, terminal commands, and programming logic before gradually progressing to advanced frameworks and system architecture.",
  },
  {
    q: "Do you offer offline classes in Bhopal as well as online?",
    a: "Yes! We operate smart AC coding labs in Zone-II MP Nagar, Bhopal with high-speed internet and dual-screen workstations. We also offer fully interactive live online batches for outstation students.",
  },
  {
    q: "How does the CT Coaching placement referral support work?",
    a: "Upon completing your capstone project and scoring 75%+ on our LMS mock tests, our placement cell conducts 1:1 resume optimization, mock technical interview drill rounds, and connects you directly with hiring partners.",
  },
  {
    q: "Can I attend a free demo class before enrolling?",
    a: "Yes! You can book a free demo classroom session or online webinar by submitting the inquiry form below or contacting our admissions helpline at +91 83057 29451.",
  },
  {
    q: "Do students receive an industry-recognized certificate?",
    a: "Yes. Every student who completes the required course modules, assignments, and capstone project receives an ISO 9001:2015 aligned certificate of completion with a unique verification code.",
  },
  {
    q: "Are installment and EMI payment options available?",
    a: "Yes, we support flexible zero-interest 2-to-3 installment payment plans for students so finances never become a bottleneck in your education.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseInterest: "Full Stack MERN",
    message: "",
  });

  const [openFaq, setOpenFaq] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const data = await sendContactMessage({
        name: formData.name,
        email: formData.email,
        message: `[Course: ${formData.courseInterest} | Phone: ${formData.phone || "N/A"}] - ${formData.message}`,
      });
      setSuccess(data.message || "Your inquiry has been submitted! Our admissions counselor will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        courseInterest: "Full Stack MERN",
        message: "",
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Admissions Open &bull; Connect with Senior Mentors
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Contact &amp; Admissions Desk
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Have questions about syllabus tracks, upcoming batch schedules, or placement records?
            We are always here to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Campus Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  Bhopal Campus
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  CT Coaching Center
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Coding Thinker Learning Management System &amp; Training Labs
                </p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">Physical Address:</strong>
                    <span>Plot 42, Zone-II, MP Nagar (Near Sargam Cinema), Bhopal, Madhya Pradesh 462011</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">Admissions Hotline:</strong>
                    <a href="tel:+918305729451" className="text-indigo-600 font-bold hover:underline">
                      +91 83057 29451
                    </a>{" "}
                    / <span>+91 94520 00000</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">Official Email:</strong>
                    <a href="mailto:ct@gmail.com" className="text-indigo-600 font-bold hover:underline">
                      ct@gmail.com
                    </a>{" "}
                    / <span>admissions@ctcoaching.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-bold">Campus Hours:</strong>
                    <span>Monday &ndash; Saturday: 9:00 AM &ndash; 8:00 PM IST<br />Sunday: 10:00 AM &ndash; 4:00 PM (Counseling Only)</span>
                  </div>
                </div>
              </div>

              {/* Quick WhatsApp Button */}
              <div className="pt-2">
                <a
                  href="https://wa.me/918305729451"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-none text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp (+91 83057 29451)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Send an Inquiry / Book Free Demo
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details and an academic mentor will call you back within 2 hours.
                </p>
              </div>

              {success && (
                <div className="alert alert-success bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="alert alert-error bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold rounded-2xl p-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs font-bold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input input-sm sm:input-md input-bordered w-full rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input input-sm sm:input-md input-bordered w-full rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs font-bold text-slate-700">Phone Number (WhatsApp)</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input input-sm sm:input-md input-bordered w-full rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-slate-700">Track of Interest</label>
                    <select
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="select select-sm sm:select-md select-bordered w-full rounded-xl text-xs sm:text-sm"
                    >
                      <option value="Full Stack MERN">Full Stack Web Development (MERN)</option>
                      <option value="Python Data Science">Python for Data Science &amp; AI</option>
                      <option value="DSA Masterclass">Data Structures &amp; Algorithms (DSA)</option>
                      <option value="Bhopal Offline Batch">Offline Bhopal Classroom Batch</option>
                      <option value="General Counseling">General Career Counseling</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700">Your Questions or Message *</label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us about your background (college branch, graduation year) and any specific queries..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="textarea textarea-bordered w-full rounded-xl text-xs sm:text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-sm sm:btn-md w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-xl border-none shadow-lg shadow-indigo-600/30 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <span>Send Inquiry to Admissions Team</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQs Accordion Section */}
        <section className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers to the most common queries from students and parents.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 pr-4">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;