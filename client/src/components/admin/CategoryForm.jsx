import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

/**
 * CategoryForm — Modal form for creating and editing categories.
 */
export default function CategoryForm({ onClose, onSaved, editData }) {
  const [form, setForm] = useState({ name: '', slug: '' });
  const [loading, setLoading] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (editData) setForm({ name: editData.name, slug: editData.slug });
  }, [editData]);

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        const { data } = await api.put(`/categories/${editData._id}`, form);
        onSaved(data, 'edit');
      } else {
        const { data } = await api.post('/categories', form);
        onSaved(data, 'create');
      }
      toast.success(editData ? 'Category updated!' : 'Category created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Category Name *</label>
        <input
          className="input"
          value={form.name}
          onChange={handleNameChange}
          placeholder="e.g. Custom Code"
          required
        />
      </div>
      <div>
        <label className="label">Slug *</label>
        <input
          className="input"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          placeholder="e.g. custom-code"
          required
        />
        <p className="text-xs text-slate-600 mt-1">Auto-generated from name. Edit if needed.</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-slate-400 text-sm hover:bg-zinc-800 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium disabled:opacity-50 transition-all"
        >
          {loading ? 'Saving…' : editData ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
