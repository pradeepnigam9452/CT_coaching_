import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const StudentTakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [submitting, setSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState(null);

  useEffect(() => {
    fetchTest();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || !test || resultModal) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, test, resultModal]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const data = await studentApi.getTestById(id);
      setTest(data);
      setTimeLeft((data.durationMinutes || 20) * 60);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const totalDuration = (test.durationMinutes || 20) * 60;
      const timeSpent = totalDuration - timeLeft;

      const res = await studentApi.submitTest(id, {
        answers,
        timeSpentSeconds: Math.max(1, timeSpent),
      });

      setResultModal(res.result);
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Preparing quiz questions..." size="lg" />;

  if (error || !test) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-12 text-center p-6 rounded-2xl">
        <p className="font-bold">{error || "Could not load test"}</p>
        <Link to="/student/tests" className="btn btn-sm btn-outline mt-3">
          Back to Tests
        </Link>
      </div>
    );
  }

  const questions = test.questions || [];
  const currentQuestion = questions[currentQIndex];
  const qId = currentQuestion?._id?.toString();
  const selectedOption = answers[qId] !== undefined ? answers[qId] : null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 120; // less than 2 mins

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Top Test Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            {test.courseTitle}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {test.title}
          </h1>
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-mono text-base font-extrabold border shadow-sm ${
            isTimeCritical
              ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
              : "bg-indigo-50 text-indigo-900 border-indigo-100"
          }`}
        >
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Question Interface */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[480px]">
          {currentQuestion ? (
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  +{currentQuestion.marks || 10} Marks
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 leading-relaxed">
                {currentQuestion.questionText}
              </h2>

              {/* Options List */}
              <div className="space-y-3 mt-6">
                {currentQuestion.options?.map((option, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(qId, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-950 font-bold shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm flex-1 leading-snug">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Navigation and Submit Buttons */}
          <div className="pt-6 mt-8 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="btn btn-sm btn-outline border-slate-300 disabled:opacity-30 rounded-xl"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))
                }
                className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20"
              >
                {submitting ? "Grading..." : "Submit Test"}
                <Send className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Right Palette: Question Navigator */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
              <span className="text-xs font-semibold text-slate-500">
                {answeredCount} / {questions.length} Answered
              </span>
            </div>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = answers[q._id?.toString()] !== undefined;
                const isCurrent = idx === currentQIndex;

                return (
                  <button
                    key={q._id || idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center ${
                      isCurrent
                        ? "ring-2 ring-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : isAnswered
                        ? "bg-emerald-100 text-emerald-800 font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Unanswered
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-sm w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl mt-4"
            >
              {submitting ? "Submitting..." : "Finish & Submit Test"}
            </button>
          </div>
        </div>
      </div>

      {/* Result Evaluation Modal */}
      {resultModal && (
        <Modal isOpen={Boolean(resultModal)} onClose={() => navigate("/student/results")} title="Test Evaluation Result">
          <div className="text-center py-4 space-y-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ${
                resultModal.passed
                  ? "bg-emerald-100 text-emerald-600 shadow-emerald-500/10"
                  : "bg-rose-100 text-rose-600 shadow-rose-500/10"
              }`}
            >
              {resultModal.passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  resultModal.passed
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {resultModal.passed ? "CONGRATULATIONS — PASSED" : "NEEDS IMPROVEMENT"}
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-2">
                {resultModal.score} / {resultModal.totalMarks} Marks
              </h3>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                Overall Percentage: {resultModal.percentage}%
              </p>
            </div>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your test has been recorded in the platform gradebook. You can review full question explanations in your results area.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                to="/student/results"
                className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                View Detailed Gradebook
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentTakeTest;
