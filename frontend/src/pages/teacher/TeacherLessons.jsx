import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Video,
  Plus,
  Trash2,
  ExternalLink,
  BookOpen,
  Search,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const TeacherLessons = () => {
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get("courseId") || "all";

  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(initialCourseId);
  const [search, setSearch] = useState("");
  const [createModal, setCreateModal] = useState(false);

  const [lessonForm, setLessonForm] = useState({
    courseId: "",
    moduleId: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: "20 min",
    resourceTitle: "",
    resourceUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lessonsData, coursesData] = await Promise.all([
        teacherApi.getLessons(),
        teacherApi.getCourses(),
      ]);
      setLessons(lessonsData);
      setCourses(coursesData);
      if (coursesData.length > 0 && !lessonForm.courseId) {
        setLessonForm((prev) => ({ ...prev, courseId: coursesData[0]._id }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.courseId || !lessonForm.title) return;
    try {
      setSaving(true);
      const resources = [];
      if (lessonForm.resourceTitle && lessonForm.resourceUrl) {
        resources.push({
          title: lessonForm.resourceTitle,
          url: lessonForm.resourceUrl,
          type: "PDF",
        });
      }

      await teacherApi.createLesson({
        courseId: lessonForm.courseId,
        moduleId: lessonForm.moduleId || undefined,
        title: lessonForm.title,
        description: lessonForm.description,
        videoUrl: lessonForm.videoUrl,
        duration: lessonForm.duration,
        resources,
      });

      setCreateModal(false);
      setLessonForm({
        courseId: courses[0]?._id || "",
        moduleId: "",
        title: "",
        description: "",
        videoUrl: "",
        duration: "20 min",
        resourceTitle: "",
        resourceUrl: "",
      });
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId, courseId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await teacherApi.deleteLesson(lessonId, courseId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filteredLessons = lessons.filter((l) => {
    const matchesCourse =
      selectedCourse === "all" || l.courseId?.toString() === selectedCourse;
    const matchesSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
      l.moduleTitle?.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const selectedCourseObj = courses.find((c) => c._id === lessonForm.courseId);

  if (loading) return <LoadingSpinner text="Loading lesson management database..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curriculum & Lesson Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload video lectures, attach source code repositories, and organize modules.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-none shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Lesson
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600">Filter Course:</span>
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
            placeholder="Search lesson titles or modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Lesson List */}
      {filteredLessons.length === 0 ? (
        <EmptyState
          icon={Video}
          title="No lessons found"
          message="Click 'Add New Lesson' to publish your first video lecture."
          actionLabel="Add Lesson"
          onAction={() => setCreateModal(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Lesson Title</th>
                  <th className="py-4 px-6">Course & Module</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Video Stream</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLessons.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{l.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {l.description || "No description provided."}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 text-xs block truncate max-w-xs">
                        {l.courseTitle}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-medium">
                        {l.moduleTitle || "General Module"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-semibold">
                      {l.duration || "15 min"}
                    </td>
                    <td className="py-4 px-6">
                      {l.videoUrl ? (
                        <a
                          href={l.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Video Link
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No URL</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteLesson(l._id, l.courseId)}
                        className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Lesson Modal */}
      {createModal && (
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="Create & Publish Course Lesson"
        >
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Select Target Course</label>
              <select
                value={lessonForm.courseId}
                onChange={(e) => setLessonForm({ ...lessonForm, courseId: e.target.value, moduleId: "" })}
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

            {selectedCourseObj && selectedCourseObj.modules?.length > 0 && (
              <div>
                <label className="label text-xs font-bold text-slate-600">Target Module</label>
                <select
                  value={lessonForm.moduleId}
                  onChange={(e) => setLessonForm({ ...lessonForm, moduleId: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="">Default (First Module)</option>
                  {selectedCourseObj.modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="label text-xs font-bold text-slate-600">Lesson Title</label>
              <input
                type="text"
                placeholder="e.g. 2.3 Deep Dive into React Hooks"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Video Embed / URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/embed/..."
                  value={lessonForm.videoUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 25 min"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Lesson Description</label>
              <textarea
                placeholder="Overview of concepts taught in this lecture..."
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                rows={3}
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="label text-xs font-bold text-slate-700 p-0">Attach Study Notes / Resource</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Resource Title (e.g. Starter Code)"
                  value={lessonForm.resourceTitle}
                  onChange={(e) => setLessonForm({ ...lessonForm, resourceTitle: e.target.value })}
                  className="input input-xs input-bordered rounded-lg"
                />
                <input
                  type="url"
                  placeholder="URL (e.g. https://github.com/...)"
                  value={lessonForm.resourceUrl}
                  onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                  className="input input-xs input-bordered rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
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
                {saving ? "Publishing..." : "Publish Lesson"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherLessons;
