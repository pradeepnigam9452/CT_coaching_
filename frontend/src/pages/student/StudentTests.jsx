import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  Award,
  AlertCircle,
  PlayCircle,
  FileCheck2,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const StudentTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("available"); // available, completed, all

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getTests();
      setTests(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter((t) => {
    if (tab === "available") return !t.isAttempted;
    if (tab === "completed") return t.isAttempted;
    return true;
  });

  if (loading) return <LoadingSpinner text="Loading tests and assessments..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tests & Assessments
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Evaluate your understanding with timed multiple-choice quizzes and track your test scores.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        {[
          { id: "available", label: `Available Tests (${tests.filter((t) => !t.isAttempted).length})` },
          { id: "completed", label: `Completed Tests (${tests.filter((t) => t.isAttempted).length})` },
          { id: "all", label: `All Tests (${tests.length})` },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              tab === item.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tests found"
          message={
            tab === "available"
              ? "Great job! You have completed all assigned assessments."
              : "No test records found in this category."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between card-hover relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {test.courseTitle}
                  </span>
                  {test.isAttempted && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        test.passed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {test.passed ? "PASSED" : "FAILED"}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {test.description || "Course test covering fundamental and advanced concepts."}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-slate-50 text-center border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Duration
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      {test.durationMinutes}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Questions
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <HelpCircle className="w-3 h-3 text-sky-500" />
                      {test.totalQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Pass Mark
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                      <Award className="w-3 h-3 text-amber-500" />
                      {test.passingMarks}%
                    </span>
                  </div>
                </div>

                {test.isAttempted && (
                  <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Your Last Score:</span>
                    <span className="font-extrabold text-indigo-700">
                      {test.lastScore} / {test.totalMarks} ({test.lastPercentage}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-3">
                <Link
                  to={`/student/tests/${test._id}`}
                  className={`btn btn-sm w-full rounded-xl font-bold border-none shadow-md inline-flex items-center justify-center gap-2 ${
                    test.isAttempted
                      ? "bg-slate-800 hover:bg-slate-900 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  {test.isAttempted ? "Retake Assessment" : "Start Test Now"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTests;
