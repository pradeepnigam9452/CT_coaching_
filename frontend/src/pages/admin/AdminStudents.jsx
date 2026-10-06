import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  Filter,
} from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    batch: "FSD",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [batchFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStudents({ batch: batchFilter, search });
      setStudents(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setForm({ name: "", email: "", password: "", phone: "", batch: "FSD" });
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setForm({
      name: student.name,
      email: student.email,
      password: "",
      phone: student.phone || "",
      batch: student.batch || "FSD",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingStudent) {
        await adminApi.updateStudent(editingStudent._id, form);
      } else {
        await adminApi.createStudent(form);
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleStudentStatus(id);
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this student record?")) return;
    try {
      await adminApi.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.includes(search)
  );

  if (loading) return <LoadingSpinner text="Loading student database..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Directory of enrolled students, account activation, and academic progress oversight.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Batch Filter:</span>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="select select-sm select-bordered rounded-xl text-xs bg-slate-50"
          >
            <option value="all">All Batches</option>
            <option value="FSD">Full Stack Web (FSD)</option>
            <option value="DSA">Data Structures & Algo (DSA)</option>
            <option value="DS">Data Science & AI (DS)</option>
          </select>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No student records found"
          message="Click 'Add New Student' to register learner accounts."
          actionLabel="Add Student"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Batch</th>
                  <th className="py-4 px-6">Courses</th>
                  <th className="py-4 px-6">Avg Score</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            s.profileImage ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}`
                          }
                          alt={s.name}
                          className="w-9 h-9 rounded-full bg-slate-100 object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                        {s.batch}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-700 font-semibold">
                      {s.enrolledCoursesCount} Enrolled
                    </td>
                    <td className="py-4 px-6 text-xs font-bold text-slate-800">
                      {s.avgScore}% ({s.testsCompleted} tests)
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(s._id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          s.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {s.isActive ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="btn btn-xs btn-ghost text-slate-600 hover:text-purple-600"
                        title="Edit Student"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50"
                        title="Delete Student"
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

      {/* Add / Edit Student Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingStudent ? "Edit Student Details" : "Register New Student Account"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Amit Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Email Address</label>
                <input
                  type="email"
                  placeholder="student@coaching.com"
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
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input input-sm input-bordered w-full rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label text-xs font-bold text-slate-600">Batch</label>
                <select
                  value={form.batch}
                  onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  className="select select-sm select-bordered w-full rounded-xl"
                >
                  <option value="FSD">Full Stack Web (FSD)</option>
                  <option value="DSA">Data Structures & Algo (DSA)</option>
                  <option value="DS">Data Science & AI (DS)</option>
                </select>
              </div>

              <div>
                <label className="label text-xs font-bold text-slate-600">
                  {editingStudent ? "Reset Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  placeholder={editingStudent ? "Leave blank to keep" : "••••••••"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingStudent}
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
                {saving ? "Saving..." : editingStudent ? "Update Student" : "Create Student Account"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminStudents;
