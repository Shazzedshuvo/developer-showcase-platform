import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Star, Pin } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pinned'
  const [pinningId, setPinningId] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    api.get('/projects')
      .then(({ data }) => setProjects(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchProjects, []);

  const pinnedProjects = projects.filter((p) => p.isPinned);
  const pinnedCount = pinnedProjects.length;

  const handleSaved = (data, mode) => {
    if (mode === 'create') setProjects((prev) => [data, ...prev]);
    if (mode === 'edit') setProjects((prev) => prev.map((p) => (p._id === data._id ? data : p)));
  };

  const handleTogglePin = async (e, project) => {
    e.stopPropagation();
    if (!project.isPinned && pinnedCount >= 15) {
      toast.error('Maximum 15 projects can be pinned! Please unpin one first.');
      return;
    }

    setPinningId(project._id);
    try {
      const { data } = await api.patch(`/projects/${project._id}/pin`);
      setProjects((prev) =>
        prev.map((p) => (p._id === project._id ? { ...p, ...data.project } : p))
      );
      if (data.project.isPinned) {
        toast.success(`Pinned! (${pinnedCount + 1}/15)`);
      } else {
        toast.success(`Unpinned! (${pinnedCount - 1}/15)`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update pin status');
    } finally {
      setPinningId(null);
    }
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

  const displayedProjects = activeTab === 'pinned' ? pinnedProjects : projects;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
            {/* Pinned counter badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                pinnedCount >= 15
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : pinnedCount > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'bg-zinc-800 text-slate-400 border-zinc-700'
              }`}
            >
              <Pin size={12} className={pinnedCount > 0 ? 'fill-amber-400 text-amber-400' : ''} />
              <span>
                {pinnedCount} / 15 Pinned {pinnedCount >= 15 && '(Max Limit Reached)'}
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Pin up to 15 standout projects to guarantee they appear first in the public portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Plus size={15} /> New Project
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-800/60'
          }`}
        >
          All Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('pinned')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'pinned'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-zinc-800/60'
          }`}
        >
          <Pin size={12} className={activeTab === 'pinned' ? 'fill-zinc-950' : 'text-amber-400'} />
          <span>Pinned Projects ({pinnedCount}/15)</span>
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
      ) : displayedProjects.length === 0 ? (
        <div className="card p-12 text-center text-slate-500">
          {activeTab === 'pinned' ? (
            <div>
              <Pin size={32} className="mx-auto mb-2 text-zinc-600" />
              <p className="text-sm font-medium text-slate-300">No pinned projects yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click the pin icon on any project card below or switch to "All Projects" to pin up to 15 projects.
              </p>
            </div>
          ) : (
            <p className="text-sm">No projects yet. Create your first one!</p>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.map((project) => (
            <div
              key={project._id}
              className={`card overflow-hidden group transition-all duration-200 ${
                project.isPinned ? 'ring-1 ring-amber-500/40 bg-zinc-900/90 shadow-lg shadow-amber-500/5' : ''
              }`}
            >
              {/* Cover image */}
              <div className="relative aspect-[16/10] bg-zinc-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {/* Left Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap z-10">
                  {project.isPinned && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/90 text-zinc-950 text-[10px] font-bold shadow-md">
                      <Pin size={10} className="fill-zinc-950" /> Pinned
                    </div>
                  )}
                  {project.isRecentActive && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/25 border border-rose-500/40 text-rose-300 text-[10px] font-bold">
                      🔥 Recent
                    </div>
                  )}
                  {project.isFeatured && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">
                      <Star size={9} fill="currentColor" /> Featured
                    </div>
                  )}
                </div>

                {/* Top Right Quick Pin Button (Always Accessible) */}
                <button
                  onClick={(e) => handleTogglePin(e, project)}
                  disabled={pinningId === project._id}
                  title={project.isPinned ? 'Click to unpin' : 'Click to pin (max 15)'}
                  className={`absolute top-2 right-2 z-20 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                    project.isPinned
                      ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-black/50 text-slate-300 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <Pin
                    size={14}
                    className={`transition-transform duration-200 ${
                      project.isPinned ? 'fill-zinc-950 scale-110' : 'group-hover:rotate-12'
                    }`}
                  />
                </button>

                {/* Action overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2.5">
                  <button
                    onClick={(e) => handleTogglePin(e, project)}
                    disabled={pinningId === project._id}
                    title={project.isPinned ? 'Unpin project' : 'Pin project'}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${
                      project.isPinned
                        ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                        : 'bg-white/10 hover:bg-amber-500/90 text-white'
                    }`}
                  >
                    <Pin size={15} className={project.isPinned ? 'fill-zinc-950' : ''} />
                  </button>
                  <button
                    onClick={() => openEdit(project)}
                    title="Edit project"
                    className="p-2 rounded-lg bg-white/10 hover:bg-indigo-500/80 text-white transition-all cursor-pointer"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    title="Delete project"
                    className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View live site"
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200 truncate">{project.title}</p>
                  {project.isPinned && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0">
                      PINNED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
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
