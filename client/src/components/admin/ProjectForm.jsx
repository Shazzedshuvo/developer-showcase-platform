import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

/**
 * ProjectForm
 * Full create/edit form for projects.
 * Handles cover image + gallery uploads via drag-and-drop.
 */
export default function ProjectForm({ onClose, onSaved, editData }) {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    demoUrl: '',
    category: '',
    review: '',
    isFeatured: false,
    isRecent: true,
    isPinned: false,
  });
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load categories and reviews for dropdowns
    Promise.all([api.get('/categories'), api.get('/reviews')])
      .then(([catRes, revRes]) => {
        setCategories(catRes.data);
        setReviews(revRes.data);
      })
      .catch(console.error);

    if (editData) {
      setForm({
        title: editData.title || '',
        slug: editData.slug || '',
        description: editData.description || '',
        demoUrl: editData.demoUrl || '',
        category: editData.category?._id || editData.category || '',
        review: editData.review?._id || editData.review || '',
        isFeatured: editData.isFeatured || false,
        isRecent: editData.isRecent !== undefined ? editData.isRecent : true,
        isPinned: editData.isPinned || false,
      });
    }
  }, [editData]);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm((f) => ({ ...f, title, slug }));
  };

  // Dropzone for cover image
  const { getRootProps: getCoverProps, getInputProps: getCoverInputProps, isDragActive: isCoverActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => setCoverFile(files[0]),
  });

  // Dropzone for gallery
  const { getRootProps: getGalleryProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (files) => setGalleryFiles((prev) => [...prev, ...files]),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editData && !coverFile) {
      toast.error('Cover image is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Append text fields
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val.toString());
    });

    // Append image files
    if (coverFile) formData.append('coverImage', coverFile);
    galleryFiles.forEach((f) => formData.append('gallery', f));

    try {
      if (editData) {
        const { data } = await api.put(`/projects/${editData._id}`, formData);
        onSaved(data, 'edit');
      } else {
        const { data } = await api.post('/projects', formData);
        onSaved(data, 'create');
      }
      toast.success(editData ? 'Project updated!' : 'Project created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      {/* Title & Slug */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Title *</label>
          <input className="input" value={form.title} onChange={handleTitleChange} placeholder="Project title" required />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input className="input" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="project-slug" required />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description *</label>
        <textarea
          className="input resize-none"
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Describe this project…"
          required
        />
      </div>

      {/* Category & Review */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Category *</label>
          <select className="input" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
            <option value="">Select category…</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Link Review (optional)</label>
          <select className="input" value={form.review} onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}>
            <option value="">No review</option>
            {reviews.map((r) => <option key={r._id} value={r._id}>{r.clientName || r.platform} — {r.rating}★</option>)}
          </select>
        </div>
      </div>

      {/* Demo URL */}
      <div>
        <label className="label">Live Demo URL</label>
        <input className="input" type="url" value={form.demoUrl} onChange={(e) => setForm((f) => ({ ...f, demoUrl: e.target.value }))} placeholder="https://…" />
      </div>

      {/* Pin, Featured & Recent Badges Toggle */}
      <div className="grid sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="isPinned"
            checked={form.isPinned}
            onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
          />
          <label htmlFor="isPinned" className="text-xs font-semibold text-amber-400 cursor-pointer">
            📌 Pin to Top (Max 15)
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="isRecent"
            checked={form.isRecent}
            onChange={(e) => setForm((f) => ({ ...f, isRecent: e.target.checked }))}
            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
          />
          <label htmlFor="isRecent" className="text-xs font-semibold text-slate-300 cursor-pointer">
            🔥 Recent Project
          </label>
        </div>

        <div className="flex items-center gap-2.5">
          <input
            type="checkbox"
            id="isFeatured"
            checked={form.isFeatured}
            onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
          />
          <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-300 cursor-pointer">
            ⭐ Mark as Featured
          </label>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="label">Cover Image {!editData && '*'}</label>
        <div
          {...getCoverProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isCoverActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500'
          }`}
        >
          <input {...getCoverInputProps()} />
          {coverFile ? (
            <div className="flex items-center gap-3 justify-center">
              <Image size={16} className="text-indigo-400" />
              <span className="text-sm text-slate-300 truncate max-w-[200px]">{coverFile.name}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); setCoverFile(null); }}>
                <X size={14} className="text-slate-500 hover:text-red-400" />
              </button>
            </div>
          ) : (
            <div className="text-slate-500 text-sm">
              <Upload size={20} className="mx-auto mb-2 opacity-50" />
              {editData ? 'Drop new cover to replace' : 'Drop cover image here'}
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="label">Gallery Images (optional)</label>
        <div
          {...getGalleryProps()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isGalleryActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500'
          }`}
        >
          <input {...getGalleryInputProps()} />
          <Upload size={16} className="mx-auto mb-1.5 text-slate-600" />
          <p className="text-sm text-slate-500">Drop multiple screenshots here</p>
        </div>
        {galleryFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {galleryFiles.map((f, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(f)} alt="" className="w-16 h-11 rounded-lg object-cover border border-zinc-700" />
                <button
                  type="button"
                  onClick={() => setGalleryFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs
                             hidden group-hover:flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-slate-400 text-sm hover:bg-zinc-800 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium disabled:opacity-50 transition-all">
          {loading ? 'Uploading…' : editData ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}
