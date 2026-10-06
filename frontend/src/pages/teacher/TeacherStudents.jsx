import React, { useState, useEffect } from "react";
import { Users, Search, Award, BookOpen, Clock, CheckCircle } from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const TeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getStudents();
      setStudents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.courses?.some((c) => c.courseTitle?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <LoadingSpinner text="Loading enrolled student roster..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Enrolled Students Roster
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor individual learners enrolled in your assigned teaching courses.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search students by name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {filtered.length} Learners Found
        </span>
      </div>

      {/* Students Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No enrolled students found"
          message="When students register for your courses, their progress tracking will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Student Info</th>
                  <th className="py-4 px-6">Enrolled Course</th>
                  <th className="py-4 px-6">Curriculum Progress</th>
                  <th className="py-4 px-6">Tests Completed</th>
                  <th className="py-4 px-6">Avg Score</th>
                  <th className="py-4 px-6">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.profileImage ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
                          }
                          alt={s.name}
                          className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {s.courses?.map((c, i) => (
                        <span
                          key={i}
                          className="block text-xs font-semibold text-slate-700 truncate max-w-xs"
                        >
                          {c.courseTitle}
                        </span>
                      ))}
                    </td>
                    <td className="py-4 px-6">
                      {s.courses?.map((c, i) => (
                        <div key={i} className="space-y-1 mb-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-emerald-700">{c.progress}%</span>
                          </div>
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${c.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700 text-xs">
                      {s.testsCompleted} Quizzes
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-slate-900 text-xs">
                        {s.avgScore}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {s.lastActivity
                        ? new Date(s.lastActivity).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Recent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;
