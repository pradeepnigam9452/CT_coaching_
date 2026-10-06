import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Search,
  BookOpen,
} from "lucide-react";
import teacherApi from "../../api/teacherApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const TeacherMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "2.5 MB",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const res = await teacherApi.getMaterials();
      setMaterials(res.materials || []);
      setCourses(res.courses || []);
      if (res.courses?.length > 0 && !form.courseId) {
        setForm((prev) => ({ ...prev, courseId: res.courses[0]._id }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.fileUrl) return;
    try {
      setSaving(true);
      await teacherApi.createMaterial(form);
      setCreateModal(false);
      setForm({
        courseId: courses[0]?._id || "",
        title: "",
        description: "",
        fileUrl: "",
        fileType: "PDF",
        fileSize: "2.5 MB",
      });
      loadMaterials();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?")) return;
    try {
      await teacherApi.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filteredMaterials = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading study materials..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Study Materials & Document Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Distribute handouts, lecture cheat-sheets, assignment templates, and PDF guides.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl border-none shadow-md shadow-emerald-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search uploaded materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No materials uploaded yet"
          message="Upload lecture resources for your enrolled students."
          actionLabel="Upload First Document"
          onAction={() => setCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between card-hover"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {m.fileType} • {m.fileSize}
                  </span>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {m.description || "Course study document."}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 truncate">
                    Course: {m.course?.title || "General"}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold w-full rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open Document
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {createModal && (
        <Modal
          isOpen={createModal}
          onClose={() => setCreateModal(false)}
          title="Upload Course Study Material"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
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

            <div>
              <label className="label text-xs font-bold text-slate-600">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Master React 19 State Patterns Cheat Sheet"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">File Type</label>
                <select
                  value={form.fileType}
                  onChange={(e) => setForm({ ...form, fileType: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="Document">Word / Docs</option>
                  <option value="Code">Source Code / Repo</option>
                  <option value="Link">External Resource Link</option>
                </select>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">File Size</label>
                <input
                  type="text"
                  placeholder="e.g. 3.2 MB"
                  value={form.fileSize}
                  onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Document URL / PDF Link</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Description (Optional)</label>
              <textarea
                placeholder="Key concepts or reading instructions..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="textarea textarea-sm textarea-bordered w-full rounded-xl"
              />
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
                {saving ? "Uploading..." : "Save Material"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TeacherMaterials;
