import React, { useState, useEffect } from "react";
import { CheckSquare, Trash2, Clock, Award, HelpCircle, Eye } from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { getErrorMessage } from "../../api/client";

export const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTests();
      setTests(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await adminApi.deleteTest(id);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner text="Loading platform assessment inventory..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Assessments & Tests
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete inventory of quizzes created by coaching instructors across all courses.
        </p>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {tests.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tests found"
          message="Tests created by instructors will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {test.course?.title || "General Subject"}
                  </span>
                  <button
                    onClick={() => handleDelete(test._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {test.description || "Course test."}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 text-center border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Duration</span>
                    <strong className="text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-bold">
                      <Clock className="w-3 h-3 text-purple-600" />
                      {test.durationMinutes}m
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Questions</span>
                    <strong className="text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-bold">
                      <HelpCircle className="w-3 h-3 text-sky-600" />
                      {test.questions?.length || 0}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pass %</span>
                    <strong className="text-slate-800 flex items-center justify-center gap-1 mt-0.5 font-bold">
                      <Award className="w-3 h-3 text-amber-600" />
                      {test.passingMarks}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Created by: <strong>{test.createdBy?.name || "Faculty"}</strong></span>
                <span className="text-purple-600 font-bold">{test.totalMarks} Marks</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTests;
