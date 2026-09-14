import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Save, CheckCircle2, Globe, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Shazzed Shuvo',
    tagline: 'Web Specialist & Web Developer',
    teamName: 'Dont Worry',
    email: 'shazzedshuvo@gmail.com',
    availableForHire: true,
    logo: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        setSettings(data);
        if (data.logo) setLogoPreview(data.logo);
      })
      .catch((err) => console.error('Error fetching settings:', err))
      .finally(() => setLoading(false));
  }, []);

  // Dropzone for logo image
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setLogoFile(acceptedFiles[0]);
        setLogoPreview(URL.createObjectURL(acceptedFiles[0]));
      }
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('siteName', settings.siteName);
    formData.append('tagline', settings.tagline);
    formData.append('teamName', settings.teamName || '');
    formData.append('email', settings.email);
    formData.append('availableForHire', settings.availableForHire);

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    try {
      const { data } = await api.put('/settings', formData);
      setSettings(data);
      if (data.logo) setLogoPreview(data.logo);
      setLogoFile(null);
      toast.success('🎉 Brand & Logo Settings Updated Successfully!');
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Brand &amp; Logo Settings</h1>
        <p className="text-sm text-slate-500">
          Customize your website logo, site name, tagline, and availability status dynamically.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Logo Upload Section */}
        <div className="card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-200 mb-1 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              <span>Website Logo</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload your custom logo (PNG, SVG, JPG, or WebP). Recommended size: 200x60px or square icon.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-zinc-700 hover:border-indigo-400/60 bg-zinc-900/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-200 mb-1">
                {logoFile ? logoFile.name : 'Drag & drop your logo here'}
              </p>
              <p className="text-[11px] text-slate-500">or click to browse from your computer</p>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Logo Preview
              </span>

              {logoPreview ? (
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center min-h-[80px] max-h-[100px] w-full">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-16 max-w-[180px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-[#07090e] rounded-[14px] flex items-center justify-center font-bold text-white text-xl">
                    SS
                  </div>
                </div>
              )}

              {logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default Monogram</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Site Identity & Contact */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-200 mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-400" />
            <span>Site Identity &amp; Information</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Site / Brand Name *</label>
              <input
                type="text"
                required
                className="input"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="e.g. Shazzed Shuvo"
              />
            </div>

            <div>
              <label className="label">Contact Email *</label>
              <input
                type="email"
                required
                className="input"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="e.g. shazzedshuvo@gmail.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Tagline / Role Title</label>
              <input
                type="text"
                className="input"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="e.g. Web Specialist & Web Developer"
              />
            </div>

            <div>
              <label className="label">Team / Agency Name (optional)</label>
              <input
                type="text"
                className="input"
                value={settings.teamName || ''}
                onChange={(e) => setSettings({ ...settings, teamName: e.target.value })}
                placeholder="e.g. Dont Worry"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <input
              type="checkbox"
              id="availableForHire"
              checked={settings.availableForHire}
              onChange={(e) => setSettings({ ...settings, availableForHire: e.target.checked })}
              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="availableForHire" className="text-xs font-semibold text-slate-300 cursor-pointer">
              🟢 "Available for New Projects" status badge displayed in Navbar
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !px-8 !py-3 font-semibold text-sm group"
          >
            {saving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
