import React, { useState, useEffect } from "react";
import { UserCheck, Plus, Trash2, Search, BookOpen, User } from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ studentId: "", courseId: "" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [enrData, stuData, crsData] = await Promise.all([
        adminApi.getEnrollments(),
        adminApi.getStudents(),
        adminApi.getCourses(),
      ]);
      setEnrollments(enrData);
      setStudents(stuData);
      setCourses(crsData);
      if (stuData.length > 0 && crsData.length > 0) {
        setForm({ studentId: stuData[0]._id, courseId: crsData[0]._id });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) return;
    try {
      setSaving(true);
      await adminApi.createEnrollment(form);
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this student's enrollment?")) return;
    try {
      await adminApi.deleteEnrollment(id);
      setEnrollments((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filtered = enrollments.filter(
    (e) =>
      e.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.student?.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner text="Loading student enrollment registry..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Enrollments Registry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manual registration controls, enrollment records, and learning progress tracking.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Enroll Student Manually
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or course enrollment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input input-sm input-bordered w-full pl-9 rounded-xl text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No enrollments recorded"
          message="Enroll students into courses to get started."
          actionLabel="Enroll Student"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase font-extrabold border-b border-slate-200">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Course</th>
                  <th className="py-4 px-6">Curriculum Progress</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Enrolled Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((enr) => (
                  <tr key={enr._id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{enr.student?.name || "Student"}</div>
                      <div className="text-xs text-slate-400">{enr.student?.email}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800 text-xs truncate max-w-xs">
                      {enr.course?.title || "Course"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-purple-700">{enr.progress}%</span>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full"
                            style={{ width: `${enr.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          enr.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        {enr.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(enr.enrolledAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(enr._id)}
                        className="btn btn-xs btn-ghost text-rose-600 hover:bg-rose-50"
                        title="Remove Enrollment"
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

      {/* Manual Enroll Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Manually Enroll Student into Course"
        >
          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Select Student</label>
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                required
                className="select select-sm select-bordered w-full rounded-xl"
              >
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email}) - {s.batch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Select Course</label>
              <select
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                required
                className="select select-sm select-bordered w-full rounded-xl"
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({c.price === 0 ? "FREE" : `₹${c.price}`})
                  </option>
                ))}
              </select>
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
                {saving ? "Enrolling..." : "Complete Enrollment"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminEnrollments;
