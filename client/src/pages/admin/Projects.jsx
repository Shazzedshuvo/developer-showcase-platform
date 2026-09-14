import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProjectForm from '../../components/admin/ProjectForm';
import api from '../../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects')
      .then(({ data }) => setProjects(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, []);

  const handleSaved = (data, mode) => {
    if (mode === 'create') setProjects((prev) => [data, ...prev]);
    if (mode === 'edit') setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteTarget._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openCreate = () => { setEditData(null); setModalOpen(true); };
  const openEdit = (p) => { setEditData(p); setModalOpen(true); };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">{projects.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-all"
        >
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Project cards grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[16/10] bg-zinc-800 rounded-t-xl" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          <p className="text-sm">No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="card overflow-hidden group">
              {/* Cover image */}
              <div className="relative aspect-[16/10] bg-zinc-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
                  {project.isRecentActive && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                      🔥 Recent
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                      <Star size={9} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>
                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-indigo-500/80 text-white transition-all"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-sm font-medium text-slate-200 truncate">{project.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {project.category && <span className="badge">{project.category.name}</span>}
                  {project.review && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-400">
                      <Star size={10} fill="currentColor" /> Review
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editData ? 'Edit Project' : 'New Project'}
        maxWidth="max-w-2xl"
      >
        <ProjectForm
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
          editData={editData}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        message={`Delete "${deleteTarget?.title}"? This will also remove its Cloudinary images.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
