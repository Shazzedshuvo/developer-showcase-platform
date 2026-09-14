import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Save,
  Sparkles,
  Upload,
  CheckCircle2,
  X,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Mail,
  Sliders,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function TeamManager() {
  const [teamInfo, setTeamInfo] = useState({
    teamName: 'Dont Worry',
    teamTagline: '',
    teamDescription: '',
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    bio: '',
    skills: '',
    experience: '3+ Years',
    email: '',
    github: '',
    linkedin: '',
    portfolio: '',
    twitter: '',
    order: 0,
    isActive: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/team/admin/all');
      setTeamInfo({
        teamName: data.teamName || 'Dont Worry',
        teamTagline: data.teamTagline || '',
        teamDescription: data.teamDescription || '',
      });
      setMembers(data.members || []);
    } catch (err) {
      toast.error('Failed to load team data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Team Info (Name, Tagline, Description)
  const handleSaveTeamInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);
    try {
      await api.put('/team/info', teamInfo);
      toast.success('Team profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update team profile');
      console.error(err);
    } finally {
      setSavingInfo(false);
    }
  };

  // Open Modal for Add / Edit
  const openModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        role: member.role || '',
        avatar: member.avatar || '',
        bio: member.bio || '',
        skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
        experience: member.experience || '3+ Years',
        email: member.email || '',
        github: member.socialLinks?.github || '',
        linkedin: member.socialLinks?.linkedin || '',
        portfolio: member.socialLinks?.portfolio || '',
        twitter: member.socialLinks?.twitter || '',
        order: member.order || 0,
        isActive: member.isActive !== undefined ? member.isActive : true,
      });
      setAvatarPreview(member.avatar || '');
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        role: '',
        avatar: '',
        bio: '',
        skills: '',
        experience: '3+ Years',
        email: '',
        github: '',
        linkedin: '',
        portfolio: '',
        twitter: '',
        order: members.length + 1,
        isActive: true,
      });
      setAvatarPreview('');
    }
    setAvatarFile(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMember(null);
    setAvatarFile(null);
    setAvatarPreview('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save Team Member Submit
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Please provide member name and role');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('role', formData.role);
      data.append('bio', formData.bio);
      data.append('skills', formData.skills);
      data.append('experience', formData.experience);
      data.append('email', formData.email);
      data.append('github', formData.github);
      data.append('linkedin', formData.linkedin);
      data.append('portfolio', formData.portfolio);
      data.append('twitter', formData.twitter);
      data.append('order', formData.order);
      data.append('isActive', formData.isActive);

      if (avatarFile) {
        data.append('avatar', avatarFile);
      } else if (formData.avatar) {
        data.append('avatar', formData.avatar);
      }

      if (editingMember) {
        await api.put(`/team/members/${editingMember._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Team member updated successfully!');
      } else {
        await api.post('/team/members', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('New team member added successfully!');
      }

      closeModal();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save member');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the team?`)) return;
    try {
      await api.delete(`/team/members/${id}`);
      toast.success('Member removed successfully');
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      toast.error('Failed to delete member');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-950 border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Team &amp; Agency Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Team: <span className="text-gradient-primary">{teamInfo.teamName || 'Dont Worry'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
              Manage your team branding, name, bio, and showcase individual specialists on your public{' '}
              <a href="/team" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                /team page
              </a>
              .
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/team"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 hover:text-white font-semibold text-xs transition-all"
            >
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              <span>View Live /team</span>
            </a>
            <button
              onClick={() => openModal()}
              className="btn-primary !px-4 !py-2.5 !text-xs !rounded-xl inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Team Profile Settings Form */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-5 border-b border-zinc-800 mb-6">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Team Identity &amp; Profile</h2>
            <p className="text-xs text-slate-400">
              Customize how your team name and mission appear across the website.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveTeamInfo} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Team Name *</label>
              <input
                type="text"
                required
                className="input"
                value={teamInfo.teamName}
                onChange={(e) => setTeamInfo({ ...teamInfo, teamName: e.target.value })}
                placeholder="e.g. Dont Worry"
              />
            </div>

            <div>
              <label className="label">Team Tagline</label>
              <input
                type="text"
                className="input"
                value={teamInfo.teamTagline}
                onChange={(e) => setTeamInfo({ ...teamInfo, teamTagline: e.target.value })}
                placeholder="e.g. Collaborative Excellence in Web Development & CMS"
              />
            </div>
          </div>

          <div>
            <label className="label">About Team / Mission Description</label>
            <textarea
              rows={3}
              className="input resize-none"
              value={teamInfo.teamDescription}
              onChange={(e) => setTeamInfo({ ...teamInfo, teamDescription: e.target.value })}
              placeholder="Describe what your team specializes in..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingInfo}
              className="btn-primary !px-6 !py-2.5 !text-xs inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingInfo ? 'Saving Profile...' : 'Save Team Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Team Members Roster */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Team Members ({members.length})</h2>
            <p className="text-xs text-slate-400">
              Add creators, developers, and designers to showcase on your public portfolio.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="btn-primary !px-4 !py-2 !text-xs !rounded-xl inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading team members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No team members added yet. Click "Add Team Member" above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-lg text-indigo-400 bg-indigo-500/10">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{member.name}</h3>
                        <p className="text-xs text-indigo-400 font-medium">{member.role}</p>
                        <span className="text-[10px] text-slate-500">{member.experience}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        member.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-800 text-slate-500'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-slate-300 border border-zinc-700/60"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Order: #{member.order || 0}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(member)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Member"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member._id, member.name)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-[#0c0f17] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</span>
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-zinc-900 border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="label mb-1">Profile Photo / Avatar</label>
                  <div className="flex items-center gap-3">
                    <label className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 text-xs font-semibold cursor-pointer border border-indigo-500/30 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-500">or enter image URL below</span>
                  </div>
                  <input
                    type="url"
                    className="input !py-1 !text-xs mt-2"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => {
                      setFormData({ ...formData, avatar: e.target.value });
                      setAvatarPreview(e.target.value);
                    }}
                  />
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Shazzed Shuvo"
                  />
                </div>
                <div>
                  <label className="label">Role / Designation *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Lead CMS & Wix Studio Developer"
                  />
                </div>
              </div>

              {/* Experience & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Years of Experience</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 5+ Years"
                  />
                </div>
                <div>
                  <label className="label">Contact Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. name@domain.com"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="label">Skills &amp; Technologies (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="e.g. Wix Studio, Squarespace, Webflow, React.js, Tailwind"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="label">Short Bio / Summary</label>
                <textarea
                  rows={2}
                  className="input resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief background about expertise and experience..."
                />
              </div>

              {/* Social Links */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="label">GitHub URL</label>
                  <input
                    type="url"
                    className="input !text-xs"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="label">LinkedIn URL</label>
                  <input
                    type="url"
                    className="input !text-xs"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="label">Portfolio URL</label>
                  <input
                    type="url"
                    className="input !text-xs"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://portfolio.com"
                  />
                </div>
              </div>

              {/* Order & Active Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Display Order:</label>
                  <input
                    type="number"
                    min="0"
                    className="input !w-20 !py-1 text-center"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActiveMember"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="isActiveMember" className="text-xs font-semibold text-slate-300 cursor-pointer">
                    Display on Public /team Page
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary !px-6 !py-2 !text-xs"
                >
                  {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
