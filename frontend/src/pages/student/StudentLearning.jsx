import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Download,
  ExternalLink,
  Award,
  BookOpen,
  Check,
  Sparkles,
} from "lucide-react";
import studentApi from "../../api/studentApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getErrorMessage } from "../../api/client";

export const StudentLearning = () => {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchLearningRoom();
  }, [courseId]);

  const fetchLearningRoom = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getLearningRoom(courseId);
      setData(res);

      // Set initial active lesson
      if (res.course?.modules?.length > 0) {
        const firstModule = res.course.modules[0];
        if (firstModule.lessons?.length > 0) {
          // Find first uncompleted lesson or default to first lesson
          let target = firstModule.lessons[0];
          for (const m of res.course.modules) {
            const uncompleted = m.lessons?.find(
              (l) => !res.enrollment.completedLessons?.includes(l._id.toString())
            );
            if (uncompleted) {
              target = uncompleted;
              break;
            }
          }
          setActiveLesson(target);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!activeLesson) return;
    try {
      setCompleting(true);
      const res = await studentApi.completeLesson(courseId, activeLesson._id);
      setData((prev) => ({
        ...prev,
        enrollment: {
          ...prev.enrollment,
          progress: res.progress,
          completedLessons: res.completedLessons,
          status: res.status,
        },
      }));
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setCompleting(false);
    }
  };

  // Flatten all lessons in order for Next/Prev navigation
  const allLessons = [];
  data?.course?.modules?.forEach((m) => {
    m.lessons?.forEach((l) => {
      allLessons.push({ ...l, moduleTitle: m.title });
    });
  });

  const currentIndex = allLessons.findIndex(
    (l) => l._id?.toString() === activeLesson?._id?.toString()
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) return <LoadingSpinner text="Opening LMS Classroom..." size="lg" />;

  if (error || !data) {
    return (
      <div className="alert alert-error max-w-lg mx-auto my-12 text-center p-6 rounded-2xl">
        <p className="font-bold">{error || "Could not load course"}</p>
        <Link to="/student/courses" className="btn btn-sm btn-outline mt-3">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const { course, enrollment, tests } = data;
  const isLessonCompleted = enrollment.completedLessons?.includes(
    activeLesson?._id?.toString()
  );

  return (
    <div className="space-y-6 animate-fade-in -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 bg-slate-900 text-slate-100 min-h-screen">
      {/* Top Classroom Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/student/courses"
            className="btn btn-ghost btn-sm text-slate-400 hover:text-white px-2 rounded-xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            My Courses
          </Link>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <h2 className="text-sm font-bold text-white truncate max-w-md">
            {course.title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Progress:</span>
            <span className="text-xs font-bold text-indigo-400">
              {enrollment.progress}%
            </span>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Classroom Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Main Content (Video & Lesson Material) */}
        <div className="lg:col-span-8 p-4 sm:p-6 lg:p-8 space-y-6">
          {activeLesson ? (
            <>
              {/* Video Player Box */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 relative">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={
                      activeLesson.videoUrl.includes("watch?v=")
                        ? activeLesson.videoUrl.replace("watch?v=", "embed/")
                        : activeLesson.videoUrl
                    }
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <Play className="w-12 h-12 mb-2 text-indigo-500" />
                    <p className="font-bold text-white">Lecture Video</p>
                    <p className="text-xs text-slate-400">
                      High definition stream and interactive coding walkthrough.
                    </p>
                  </div>
                )}
              </div>

              {/* Lesson Title & Completion Controls */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    {course.category} • {activeLesson.duration || "15 min"}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    {activeLesson.title}
                  </h1>
                </div>

                <button
                  onClick={handleToggleComplete}
                  disabled={completing}
                  className={`btn btn-sm sm:btn-md rounded-xl font-bold border-none transition-all ${
                    isLessonCompleted
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  {isLessonCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1 text-white" />
                      Completed ✓
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-1" />
                      Mark as Completed
                    </>
                  )}
                </button>
              </div>

              {/* Lesson Description */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  Lesson Overview & Key Concepts
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeLesson.description ||
                    "In this lecture, you will master the core architectural patterns, write testable code, and follow industry best practices."}
                </p>

                {/* Lesson Resources */}
                {activeLesson.resources && activeLesson.resources.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Downloadable Resources & Notes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeLesson.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs font-medium text-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                            <span className="truncate text-white">{res.title}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next Lesson Navigation Bar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  disabled={!prevLesson}
                  className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border-slate-700 disabled:opacity-40 rounded-xl inline-flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Lesson
                </button>

                <button
                  onClick={() => nextLesson && setActiveLesson(nextLesson)}
                  disabled={!nextLesson}
                  className="btn btn-sm bg-slate-800 hover:bg-slate-700 text-white border-slate-700 disabled:opacity-40 rounded-xl inline-flex items-center gap-1.5"
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>Please select a lesson from the course outline on the right.</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Course Modules & Lesson Outline */}
        <div className="lg:col-span-4 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-screen sticky top-0">
          <div>
            <h3 className="text-base font-bold text-white">Course Curriculum</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {allLessons.length} Total Lessons • {tests.length} Assessments
            </p>
          </div>

          {/* Module list accordion */}
          <div className="space-y-4">
            {course.modules?.map((mod, modIdx) => (
              <div
                key={mod._id || modIdx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
              >
                <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 font-bold text-xs text-indigo-300 uppercase tracking-wider">
                  {mod.title}
                </div>

                <div className="divide-y divide-slate-800/60">
                  {mod.lessons?.map((les) => {
                    const isCurrent = activeLesson?._id?.toString() === les._id?.toString();
                    const isDone = enrollment.completedLessons?.includes(
                      les._id?.toString()
                    );

                    return (
                      <button
                        key={les._id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                          isCurrent
                            ? "bg-indigo-950/60 text-white border-l-4 border-indigo-500"
                            : "hover:bg-slate-800/50 text-slate-300"
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-semibold leading-snug truncate ${
                              isCurrent ? "text-indigo-200" : "text-slate-300"
                            }`}
                          >
                            {les.title}
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {les.duration || "15 min"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Course Tests / Final Assessment */}
            {tests && tests.length > 0 && (
              <div className="rounded-2xl bg-indigo-950/40 border border-indigo-900/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Course Quiz / Assessment
                  </h4>
                </div>
                {tests.map((t) => (
                  <div key={t._id} className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-xs text-slate-200 truncate">{t.title}</span>
                    <Link
                      to={`/student/tests/${t._id}`}
                      className="btn btn-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-shrink-0"
                    >
                      Start Quiz
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLearning;
