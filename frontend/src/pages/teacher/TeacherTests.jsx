import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  Award,
  HelpCircle,
  CheckCircle,
  Edit2,
} from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const TeacherTests = () => {
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModal, setCreateModal] = useState(false);

  // Test creation state
  const [testForm, setTestForm] = useState({
    courseId: "",
    title: "",
    description: "",
    durationMinutes: 20,
    passingMarks: 40,
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        marks: 10,
        explanation: "",
      },
    ],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await teacherApi.getTests();
      setTests(res.tests || []);
      setCourses(res.courses || []);
      if (res.courses?.length > 0 && !testForm.courseId) {
        setTestForm((prev) => ({ ...prev, courseId: res.courses[0]._id }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setTestForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          marks: 10,
          explanation: "",
        },
      ],
    }));
  };

  const handleRemoveQuestion = (idx) => {
    if (testForm.questions.length <= 1) return;
    setTestForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setTestForm((prev) => {
      const updated = [...prev.questions];
      updated[qIndex][field] = value;
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    setTestForm((prev) => {
      const updated = [...prev.questions];
      updated[qIndex].options[optIndex] = value;
      return { ...prev, questions: updated };
    });
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    if (!testForm.courseId || !testForm.title) return;

    // Validate questions
    for (let i = 0; i < testForm.questions.length; i++) {
      const q = testForm.questions[i];
      if (!q.questionText.trim()) {
        alert(`Question #${i + 1} text cannot be empty`);
        return;
      }
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Option ${String.fromCharCode(65 + j)} for Question #${i + 1} cannot be empty`);
          return;
        }
      }
    }

    try {
      setSaving(true);
      const totalMarks = testForm.questions.reduce((acc, q) => acc + (Number(q.marks) || 10), 0);

      await teacherApi.createTest({
        ...testForm,
        totalMarks,
      });

      setCreateModal(false);
      setTestForm({
        courseId: courses[0]?._id || "",
        title: "",
        description: "",
        durationMinutes: 20,
        passingMarks: 40,
        questions: [
          {
            questionText: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            marks: 10,
            explanation: "",
          },
        ],
      });
      loadTests();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await teacherApi.deleteTest(id);
      setTests((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner text="Loading tests and quizzes..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessments & Test Builder
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create timed MCQ assessments, define passing percentages, and formulate questions.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-none shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Assessment
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tests created yet"
          message="Create your first multiple-choice assessment for students."
          actionLabel="Create Test"
          onAction={() => setCreateModal(true)}
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
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {test.course?.title || "General"}
                  </span>
                  <button
                    onClick={() => handleDeleteTest(test._id)}
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
                  {test.description || "Course assessment."}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 text-center border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Duration
                    </span>
                    <strong className="text-slate-800 font-extrabold flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {test.durationMinutes}m
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Questions
                    </span>
                    <strong className="text-slate-800 font-extrabold flex items-center justify-center gap-1 mt-0.5">
                      <HelpCircle className="w-3 h-3 text-sky-600" />
                      {test.questions?.length || 0}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      Passing
                    </span>
                    <strong className="text-slate-800 font-extrabold flex items-center justify-center gap-1 mt-0.5">
                      <Award className="w-3 h-3 text-amber-600" />
                      {test.passingMarks}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total Marks: <strong>{test.totalMarks || 50}</strong></span>
                <span className="text-emerald-600 font-bold">Live Published</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive MCQ Builder Modal */}
      {createModal && (
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="MCQ Assessment Builder"
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleCreateTest} className="space-y-6">
            {/* Header Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="label text-xs font-bold text-slate-600">Course</label>
                <select
                  value={testForm.courseId}
                  onChange={(e) => setTestForm({ ...testForm, courseId: e.target.value })}
                  required
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="label text-xs font-bold text-slate-600">Assessment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Test: State Architecture & Redux"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  required
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={testForm.durationMinutes}
                  onChange={(e) => setTestForm({ ...testForm, durationMinutes: Number(e.target.value) })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Passing Score (%)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={testForm.passingMarks}
                  onChange={(e) => setTestForm({ ...testForm, passingMarks: Number(e.target.value) })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Total Questions</label>
                <input
                  type="text"
                  disabled
                  value={`${testForm.questions.length} Questions`}
                  className="input input-sm input-bordered w-full rounded-xl bg-slate-100 font-bold"
                />
              </div>
            </div>

            {/* Questions Builder */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Questions & Answers ({testForm.questions.length})
                </h4>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="btn btn-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Question
                </button>
              </div>

              {testForm.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Question #{qIdx + 1}
                    </span>
                    {testForm.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIdx)}
                        className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Enter question statement here..."
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)}
                    required
                    className="input input-sm input-bordered w-full rounded-xl font-medium"
                  />

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">
                      Options (Select the correct answer radio button):
                    </p>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctAnswer === optIdx}
                          onChange={() => handleQuestionChange(qIdx, "correctAnswer", optIdx)}
                          className="radio radio-xs radio-primary text-emerald-600"
                        />
                        <span className="text-xs font-bold text-slate-500 w-4">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <input
                          type="text"
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          required
                          className="input input-xs input-bordered flex-1 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCreateModal(false)}
                className="btn btn-sm btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                {saving ? "Publishing Assessment..." : "Publish Test to Course"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherTests;
