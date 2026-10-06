import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  Clock,
  Layers,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    level: "Beginner",
    instructorId: "",
    price: 19999,
    duration: "3 Months",
    mode: "Online",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    seatsAvailable: 30,
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, teachersData, categoriesData] = await Promise.all([
        adminApi.getCourses(),
        adminApi.getTeachers(),
        adminApi.getCategories(),
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
      setCategories(categoriesData);
      if (teachersData.length > 0 && !form.instructorId) {
        setForm((prev) => ({ ...prev, instructorId: teachersData[0]._id }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setForm({
      title: "",
      description: "",
      category: categories[0]?.name || "Web Development",
      level: "Beginner",
      instructorId: teachers[0]?._id || "",
      price: 19999,
      duration: "3 Months",
      mode: "Online",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
      seatsAvailable: 30,
      isPublished: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      instructorId: course.instructor?._id || "",
      price: course.price,
      duration: course.duration,
      mode: course.mode || "Online",
      thumbnail: course.thumbnail,
      seatsAvailable: course.seatsAvailable || 30,
      isPublished: course.isPublished,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCourse) {
        await adminApi.updateCourse(editingCourse._id, form);
      } else {
        await adminApi.createCourse(form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course and all its lessons?")) return;
    try {
      await adminApi.deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading course catalog..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curriculum & Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create coaching courses, assign faculty instructors, set pricing, and manage syllabus modules.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {filtered.length} Courses Registered
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses found"
          message="Click 'Create New Course' to add your coaching offering."
          actionLabel="Create Course"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between card-hover"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {course.price === 0 ? "FREE" : `₹${course.price.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-slate-50 text-center border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Enrolled
                      </span>
                      <strong className="text-slate-800 font-extrabold">
                        {course.enrolledCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Lessons
                      </span>
                      <strong className="text-slate-800 font-extrabold">
                        {course.lessonsCount}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Level
                      </span>
                      <strong className="text-slate-800 font-extrabold">
                        {course.level}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex justify-between">
                    <span>Instructor: <strong>{course.instructorName}</strong></span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 gap-2">
                <button
                  onClick={() => handleOpenEdit(course)}
                  className="btn btn-xs btn-outline border-slate-200 hover:bg-slate-100 text-slate-700 flex-1 rounded-lg"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit Course
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCourse ? "Edit Course Information" : "Create New Coaching Course"}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Master Full Stack Web Development (MERN)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option value="Web Development">Web Development</option>
                  )}
                </select>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Level</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Tuition Fee (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 6 Months"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Assigned Teacher</label>
                <select
                  value={form.instructorId}
                  onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="">Select Instructor</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Course Thumbnail URL</label>
              <input
                type="url"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                required
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-sm btn-ghost rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
              >
                {saving ? "Saving..." : editingCourse ? "Save Changes" : "Publish Course"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCourses;
