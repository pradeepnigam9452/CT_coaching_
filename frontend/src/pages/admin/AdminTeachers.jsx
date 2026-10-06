import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "Full Stack Development",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getTeachers();
      setTeachers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingTeacher(null);
    setForm({ name: "", email: "", password: "", phone: "", specialization: "Full Stack Development" });
    setModalOpen(true);
  };

  const handleOpenEdit = (teacher) => {
    setEditingTeacher(teacher);
    setForm({
      name: teacher.name,
      email: teacher.email,
      password: "",
      phone: teacher.phone || "",
      specialization: teacher.specialization || "Computer Science",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingTeacher) {
        await adminApi.updateTeacher(editingTeacher._id, form);
      } else {
        await adminApi.createTeacher(form);
      }
      setModalOpen(false);
      fetchTeachers();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleTeacherStatus(id);
      setTeachers((prev) =>
        prev.map((t) => (t._id === id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this educator record?")) return;
    try {
      await adminApi.deleteTeacher(id);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading instructor directory..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Faculty & Teacher Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory of coaching educators, course workload allocations, and instructor permissions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Teacher
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teacher by name, email, or expertise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {filtered.length} Teachers Listed
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No faculty records found"
          message="Click 'Add New Teacher' to onboard instructors."
          actionLabel="Add Teacher"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Faculty Member</th>
                  <th className="py-4 px-6">Specialization</th>
                  <th className="py-4 px-6">Assigned Courses</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            t.profileImage ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`
                          }
                          alt={t.name}
                          className="w-9 h-9 rounded-full bg-emerald-100 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{t.name}</div>
                          <div className="text-xs text-slate-400">{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                        {t.specialization}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-800 text-xs">
                          {t.assignedCoursesCount} Courses
                        </span>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {t.courses?.map((c, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md truncate max-w-[140px]"
                            >
                              {c.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(t._id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          t.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {t.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="btn btn-xs btn-ghost text-slate-600 hover:text-purple-600"
                        title="Edit Teacher"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50"
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingTeacher ? "Edit Faculty Details" : "Onboard New Faculty Teacher"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Prof. Suresh Rana"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Email</label>
                <input
                  type="email"
                  placeholder="teacher@coaching.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">Phone</label>
                <input
                  type="text"
                  placeholder="+91 91234 56780"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. DSA & System Design"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">
                  {editingTeacher ? "Reset Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  placeholder={editingTeacher ? "Leave blank to keep" : "••••••••"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingTeacher}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
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
                {saving ? "Saving..." : editingTeacher ? "Update Faculty" : "Add Faculty Member"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminTeachers;
