import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import CategoryForm from '../../components/admin/CategoryForm';
import api from '../../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategories, []);

  const handleSaved = (data, mode) => {
    if (mode === 'create') setCategories((prev) => [...prev, data]);
    if (mode === 'edit') setCategories((prev) => prev.map((c) => (c._id === data._id ? data : c)));
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (cat) => { setEditData(cat); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Manage project categories</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-all"
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-600 text-sm">Loading…</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-slate-600">
            <p className="text-sm">No categories yet. Create one to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-slate-600 font-semibold">Name</th>
                <th className="px-5 py-3 text-left text-xs uppercase tracking-wider text-slate-600 font-semibold">Slug</th>
                <th className="px-5 py-3 text-right text-xs uppercase tracking-wider text-slate-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat._id} className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${i === categories.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{cat.name}</td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Category' : 'New Category'}
      >
        <CategoryForm
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
          editData={editData}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete category "${deleteTarget?.name}"? Projects in this category will become uncategorized.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
