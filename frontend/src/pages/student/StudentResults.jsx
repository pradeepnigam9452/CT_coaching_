import React, { useState, useEffect } from "react";
import { Award, Calendar, CheckCircle2, XCircle, Eye, Clock, Check, X } from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingResult, setViewingResult] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getResults();
      setResults(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your assessment results..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Test Results & Gradebook
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your quiz scores, answer breakdowns, and track performance improvements.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {results.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No results recorded yet"
          message="Once you complete tests and quizzes, your performance reports will appear here."
          actionLabel="Attempt a Quiz"
          onAction={() => (window.location.href = "/student/tests")}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Test & Course</th>
                  <th className="py-4 px-6">Date Attempted</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {results.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{r.testTitle}</div>
                      <div className="text-xs text-slate-400 font-medium">
                        {r.courseTitle || r.course?.title || "General"}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {new Date(r.createdAt || r.completedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {r.score} / {r.totalMarks}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{r.percentage}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              r.passed ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(100, r.percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          r.passed
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {r.passed ? "PASS" : "FAIL"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setViewingResult(r)}
                        className="btn btn-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Breakdown
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Answer Breakdown Modal */}
      {viewingResult && (
        <Modal
          isOpen={Boolean(viewingResult)}
          onClose={() => setViewingResult(null)}
          title={`Result: ${viewingResult.testTitle}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Score</p>
                <p className="text-2xl font-extrabold text-slate-900">
                  {viewingResult.score} / {viewingResult.totalMarks} ({viewingResult.percentage}%)
                </p>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                  viewingResult.passed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {viewingResult.passed ? "PASSED" : "FAILED"}
              </span>
            </div>

            {/* Answer List */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Question Details & Explanations
              </h4>
              {viewingResult.answers?.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    ans.isCorrect
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      Q{idx + 1}. {ans.questionText}
                    </p>
                    {ans.isCorrect ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 flex-shrink-0">
                        <Check className="w-4 h-4" /> Correct (+{ans.marksAwarded}m)
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-600 flex items-center gap-1 flex-shrink-0">
                        <X className="w-4 h-4" /> Incorrect (0m)
                      </span>
                    )}
                  </div>

                  <div className="mt-2 text-xs space-y-1 text-slate-600">
                    <p>
                      Your Option:{" "}
                      <strong>
                        {ans.selectedOption >= 0
                          ? `Option ${String.fromCharCode(65 + ans.selectedOption)}`
                          : "Skipped"}
                      </strong>
                    </p>
                    {!ans.isCorrect && ans.correctAnswer !== undefined && (
                      <p className="text-emerald-700 font-semibold">
                        Correct Option: Option {String.fromCharCode(65 + ans.correctAnswer)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentResults;
