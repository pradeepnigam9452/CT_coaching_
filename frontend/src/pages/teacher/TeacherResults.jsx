import React, { useState, useEffect } from "react";
import { Award, Filter, Search, Eye } from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const TeacherResults = () => {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [search, setSearch] = useState("");
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    fetchResults();
  }, [selectedCourse]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await teacherApi.getResults({ courseId: selectedCourse, search });
      setResults(res.results || []);
      setCourses(res.courses || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filtered = results.filter((r) =>
    r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    r.testTitle?.toLowerCase().includes(search.toLowerCase()) ||
    r.courseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading gradebook records..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Assessment Gradebook & Results
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review all quiz and test attempts from students enrolled in your coaching courses.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Course Filter:</span>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs bg-slate-50"
          >
            <option value="all">All Assigned Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student or test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Results Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No assessment results recorded"
          message="When students submit quizzes for your courses, their scores will be recorded here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Test Title</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{r.studentName}</div>
                      <div className="text-xs text-slate-400">{r.studentEmail}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{r.testTitle}</td>
                    <td className="py-4 px-6 text-xs text-slate-500 font-medium">{r.courseTitle}</td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {r.score} / {r.totalMarks}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">{r.percentage}%</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          r.passed
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {r.passed ? "PASSED" : "FAILED"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(r.createdAt || r.completedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setDetailModal(r)}
                        className="btn btn-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailModal && (
        <Modal
          isOpen={Boolean(detailModal)}
          onClose={() => setDetailModal(null)}
          title={`Gradebook Entry: ${detailModal.studentName}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500">Test: {detailModal.testTitle}</p>
                <p className="text-xl font-bold text-slate-900">
                  {detailModal.score} / {detailModal.totalMarks} Marks ({detailModal.percentage}%)
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  detailModal.passed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {detailModal.passed ? "PASSED" : "FAILED"}
              </span>
            </div>

            <div className="space-y-3">
              {detailModal.answers?.map((ans, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs ${
                    ans.isCorrect ? "bg-emerald-50/40 border-emerald-200" : "bg-rose-50/40 border-rose-200"
                  }`}
                >
                  <p className="font-bold text-slate-800">
                    Q{i + 1}. {ans.questionText}
                  </p>
                  <p className="mt-1 text-slate-600">
                    Selected: <strong>Option {ans.selectedOption >= 0 ? String.fromCharCode(65 + ans.selectedOption) : "None"}</strong> • Awarded: {ans.marksAwarded} Marks
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TeacherResults;
