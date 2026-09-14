import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

/**
 * ReviewForm — Upload a Fiverr review screenshot to Cloudinary.
 */
export default function ReviewForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ clientName: '', platform: 'Direct Client', rating: 5 });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (files) => {
      setFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a review screenshot'); return; }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('clientName', form.clientName);
    formData.append('platform', form.platform);
    formData.append('rating', form.rating);

    try {
      const { data } = await api.post('/reviews', formData);
      onSaved(data);
      toast.success('Review uploaded!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Screenshot upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${
          isDragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Review preview" className="w-full max-h-64 object-contain bg-zinc-900" />
        ) : (
          <div className="p-8 text-center text-slate-500">
            <Upload size={24} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Drop the client review screenshot here</p>
            <p className="text-xs text-slate-600 mt-1">JPEG, PNG, WebP — max 10MB</p>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Client Name (optional)</label>
          <input
            className="input"
            value={form.clientName}
            onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
            placeholder="e.g. john_doe"
          />
        </div>
        <div>
          <label className="label">Rating</label>
          <select
            className="input"
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
          >
            {[5, 4, 3].map((r) => <option key={r} value={r}>{r} Stars</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-slate-400 text-sm hover:bg-zinc-800 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading || !file}
          className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium disabled:opacity-50 transition-all">
          {loading ? 'Uploading…' : 'Upload Review'}
        </button>
      </div>
    </form>
  );
}
