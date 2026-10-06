import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Bell, AlertTriangle } from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    targetRole: "all",
    courseId: "",
    isImportant: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [annData, crsData] = await Promise.all([
        adminApi.getAnnouncements(),
        adminApi.getCourses(),
      ]);
      setAnnouncements(annData);
      setCourses(crsData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    try {
      setSaving(true);
      await adminApi.createAnnouncement(form);
      setModalOpen(false);
      setForm({
        title: "",
        content: "",
        targetRole: "all",
        courseId: "",
        isImportant: false,
      });
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this broadcast announcement?")) return;
    try {
      await adminApi.deleteAnnouncement(id);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner text="Loading broadcast bulletins..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Announcements & Broadcasts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Broadcast emergency alerts, upcoming live events, and academic updates to students and teachers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Announcement
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No active announcements"
          message="Create a platform broadcast bulletin to notify students and faculty."
          actionLabel="Post Announcement"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a._id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                a.isImportant
                  ? "bg-amber-50/70 border-amber-200"
                  : "bg-white border-slate-200/80 shadow-sm"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      a.targetRole === "student"
                        ? "bg-indigo-100 text-indigo-800"
                        : a.targetRole === "teacher"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    Target: {a.targetRole}
                  </span>
                  {a.isImportant && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Priority Notice
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(a.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{a.title}</h3>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {a.content}
                </p>

                <p className="text-xs text-slate-400">
                  Published by: <strong>{a.authorName || "Administration"}</strong> • {a.courseTitle || "All Courses"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(a._id)}
                className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Publish Platform Announcement"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Announcement Title</label>
              <input
                type="text"
                placeholder="e.g. Schedule for Upcoming Technical Mock Interviews"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Target Audience</label>
                <select
                  value={form.targetRole}
                  onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="all">Everyone (All Roles)</option>
                  <option value="student">Students Only</option>
                  <option value="teacher">Faculty Teachers Only</option>
                </select>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Course (Optional)</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="">All Courses</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="important"
                checked={form.isImportant}
                onChange={(e) => setForm({ ...form, isImportant: e.target.checked })}
                className="checkbox checkbox-sm checkbox-primary"
              />
              <label htmlFor="important" className="text-xs font-bold text-slate-700 cursor-pointer">
                Mark as High Priority / Urgent Notice
              </label>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Message Content</label>
              <textarea
                placeholder="Write full announcement text..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
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
                {saving ? "Publishing..." : "Broadcast Announcement"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminAnnouncements;
