import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  Video,
  Plus,
  FolderPlus,
  Layers,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleModalCourse, setModuleModalCourse] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: "", description: "" });
  const [addingModule, setAddingModule] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await teacherApi.getCourses();
      setCourses(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!moduleModalCourse || !moduleForm.title) return;
    try {
      setAddingModule(true);
      await teacherApi.addModule(moduleModalCourse._id, moduleForm);
      setModuleModalCourse(null);
      setModuleForm({ title: "", description: "" });
      fetchCourses();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setAddingModule(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading assigned courses..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assigned Teaching Courses
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage course modules, view enrolled students, and curate syllabus lessons.
          </p>
        </div>

        <Link
          to="/teacher/lessons"
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-none shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Lesson
        </Link>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses assigned yet"
          message="Administrator will assign teaching batches and courses to your profile."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between card-hover"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 text-center border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Students
                      </span>
                      <strong className="text-slate-800 text-sm">
                        {course.enrolledStudentsCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Modules
                      </span>
                      <strong className="text-slate-800 text-sm">
                        {course.modulesCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Lessons
                      </span>
                      <strong className="text-slate-800 text-sm">
                        {course.lessonsCount}
                      </strong>
                    </div>
                  </div>

                  {/* Modules Outline Summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Course Modules ({course.modules?.length || 0}):
                    </p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {course.modules?.map((m, idx) => (
                        <div
                          key={m._id || idx}
                          className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                        >
                          <span className="truncate font-semibold text-slate-700">{m.title}</span>
                          <span className="text-[11px] text-slate-400 flex-shrink-0">
                            {m.lessons?.length || 0} lessons
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setModuleModalCourse(course)}
                  className="btn btn-sm btn-outline border-slate-200 hover:bg-slate-100 hover:text-slate-900 text-slate-700 flex-1 rounded-xl text-xs"
                >
                  <FolderPlus className="w-3.5 h-3.5 mr-1" /> Add Module
                </button>
                <Link
                  to={`/teacher/lessons?courseId=${course._id}`}
                  className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white flex-1 rounded-xl text-xs font-bold"
                >
                  Manage Lessons
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Module Modal */}
      {moduleModalCourse && (
        <Modal
          isOpen={Boolean(moduleModalCourse)}
          onClose={() => setModuleModalCourse(null)}
          title={`Add Module to: ${moduleModalCourse.title}`}
        >
          <form onSubmit={handleAddModule} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Module Title</label>
              <input
                type="text"
                placeholder="e.g. Module 4: Authentication & Security"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Description (Optional)</label>
              <textarea
                placeholder="What topics will be covered in this module..."
                value={moduleForm.description}
                onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                rows={2}
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setModuleModalCourse(null)}
                className="btn btn-sm btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addingModule}
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                {addingModule ? "Adding..." : "Save Module"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherCourses;
