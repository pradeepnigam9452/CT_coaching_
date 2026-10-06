import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import adminApi from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import { getErrorMessage } from "../../api/client";

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [form, setForm] = useState({ name: "", description: "", icon: "Code" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", icon: "Code" });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description || "", icon: cat.icon || "Code" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id, form);
      } else {
        await adminApi.createCategory(form);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await adminApi.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner text="Loading course categories..." size="lg" />;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize curricula and course navigation across coaching domains.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl border-none shadow-md shadow-purple-600/20 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {error && <div className="alert alert-error text-sm">{error}</div>}

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories found"
          message="Create domain categories like Web Development, DSA, AI, etc."
          actionLabel="Add Category"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-start justify-between gap-3 card-hover"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {cat.courseCount || 0} Courses
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {cat.description || "Course domain classification."}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="btn btn-xs btn-ghost text-slate-500 hover:text-purple-600"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="btn btn-xs btn-ghost text-rose-500 hover:bg-rose-50"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? "Edit Category" : "Add Course Category"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label text-xs font-bold text-slate-600">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Competitive Programming"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input input-sm input-bordered w-full rounded-xl"
              />
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-600">Description</label>
              <textarea
                placeholder="Overview of courses in this topic..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
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
                {saving ? "Saving..." : "Save Category"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminCategories;
