import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Image as ImageIcon,
  Save,
  Globe,
  Sparkles,
  Trash2,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useSettings } from '../../context/SettingsContext';

export default function Settings() {
  const { settings: globalSettings, updateSettingsState } = useSettings();

  const [settings, setSettings] = useState({
    siteName: 'Shazzed Shuvo',
    logoName: 'SS',
    siteTitle: '',
    tagline: 'Web Specialist & Web Developer',
    teamName: 'Dont Worry',
    email: 'shazzedshuvo@gmail.com',
    availableForHire: true,
    logo: '',
    favicon: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [removeLogo, setRemoveLogo] = useState(false);

  const [faviconFile, setFaviconFile] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [removeFavicon, setRemoveFavicon] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        if (data) {
          setSettings(data);
          if (data.logo) setLogoPreview(data.logo);
          if (data.favicon) setFaviconPreview(data.favicon);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err))
      .finally(() => setLoading(false));
  }, []);

  // Dropzone for logo
  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
    isDragActive: isLogoDragActive,
  } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setLogoFile(acceptedFiles[0]);
        setLogoPreview(URL.createObjectURL(acceptedFiles[0]));
        setRemoveLogo(false);
      }
    },
  });

  // Dropzone for favicon
  const {
    getRootProps: getFaviconRootProps,
    getInputProps: getFaviconInputProps,
    isDragActive: isFaviconDragActive,
  } = useDropzone({
    accept: {
      'image/*': ['.ico', '.png', '.svg', '.webp', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFaviconFile(acceptedFiles[0]);
        setFaviconPreview(URL.createObjectURL(acceptedFiles[0]));
        setRemoveFavicon(false);
      }
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('siteName', settings.siteName || '');
    formData.append('logoName', settings.logoName || 'SS');
    formData.append('siteTitle', settings.siteTitle || '');
    formData.append('tagline', settings.tagline || '');
    formData.append('teamName', settings.teamName || '');
    formData.append('email', settings.email || '');
    formData.append('availableForHire', settings.availableForHire);

    if (removeLogo) {
      formData.append('removeLogo', 'true');
    } else if (logoFile) {
      formData.append('logo', logoFile);
    }

    if (removeFavicon) {
      formData.append('removeFavicon', 'true');
    } else if (faviconFile) {
      formData.append('favicon', faviconFile);
    }

    try {
      const { data } = await api.put('/settings', formData);
      setSettings(data);
      updateSettingsState(data);
      if (data.logo) setLogoPreview(data.logo);
      else setLogoPreview(null);
      if (data.favicon) setFaviconPreview(data.favicon);
      else setFaviconPreview(null);

      setLogoFile(null);
      setFaviconFile(null);
      setRemoveLogo(false);
      setRemoveFavicon(false);
      toast.success('🎉 Brand & Identity Settings Saved Successfully!');
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
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <p className="text-xs">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Brand &amp; Website Identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your browser favicon, website logo, brand abbreviation, site name, and public metadata dynamically.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Favicon Management Section */}
        <div className="card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Browser Favicon</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The small icon that appears on browser tabs, bookmarks, and mobile shortcuts. Recommended: 32x32px or 64x64px (ICO, PNG, or SVG).
              </p>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Browser Tab
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center">
            {/* Favicon Dropzone */}
            <div
              {...getFaviconRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isFaviconDragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-300 dark:border-zinc-700 hover:border-indigo-500/60 bg-slate-50/70 dark:bg-zinc-900/40'
              }`}
            >
              <input {...getFaviconInputProps()} />
              <Upload className="w-7 h-7 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {faviconFile ? faviconFile.name : 'Upload custom Favicon'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Drag &amp; drop .ico, .png, or .svg file, or click to browse
              </p>
            </div>

            {/* Simulated Browser Tab Mockup */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Live Tab Preview
              </span>

              {/* Realistic Browser Tab Mockup */}
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0c0f17] border border-slate-200 dark:border-zinc-800 shadow-sm max-w-full">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                  {faviconPreview ? (
                    <img
                      src={faviconPreview}
                      alt="Favicon"
                      className="w-4 h-4 object-contain"
                    />
                  ) : (
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                      {settings.logoName ? settings.logoName.slice(0, 2) : 'SS'}
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {settings.siteTitle || `${settings.siteName || 'Shazzed Shuvo'} — ${settings.tagline || 'Portfolio'}`}
                </span>
              </div>

              {faviconPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFaviconFile(null);
                    setFaviconPreview(null);
                    setRemoveFavicon(true);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium pt-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Favicon</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Website Logo Upload Section */}
        <div className="card p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                <span>Website Logo Image</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload your main branding logo displayed in the top navbar and admin header. Recommended: PNG or SVG with transparent background.
              </p>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Navbar &amp; Header
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center">
            {/* Logo Dropzone */}
            <div
              {...getLogoRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isLogoDragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-300 dark:border-zinc-700 hover:border-indigo-500/60 bg-slate-50/70 dark:bg-zinc-900/40'
              }`}
            >
              <input {...getLogoInputProps()} />
              <Upload className="w-7 h-7 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {logoFile ? logoFile.name : 'Upload custom logo'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Drag &amp; drop PNG, SVG, WebP, or click to browse
              </p>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Current Logo Preview
              </span>

              {logoPreview ? (
                <div className="p-4 rounded-xl bg-white dark:bg-[#07090e] border border-slate-200 dark:border-zinc-800 flex items-center justify-center min-h-[70px] max-h-[85px] w-full">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-12 max-w-[170px] object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full bg-white dark:bg-[#07090e] rounded-[14px] flex items-center justify-center font-bold text-slate-900 dark:text-white text-lg">
                    {settings.logoName || 'SS'}
                  </div>
                </div>
              )}

              {logoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoFile(null);
                    setLogoPreview(null);
                    setRemoveLogo(true);
                  }}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default Monogram</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Site Identity & Texts */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-500" />
            <span>Site Identity &amp; Typography</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Site / Brand Name *
              </label>
              <input
                type="text"
                required
                className="input"
                value={settings.siteName || ''}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="e.g. Shazzed Shuvo"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Displayed in the main Navbar, Footer, and Admin header.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Logo Monogram / Short Text
              </label>
              <input
                type="text"
                maxLength={4}
                className="input"
                value={settings.logoName || ''}
                onChange={(e) => setSettings({ ...settings, logoName: e.target.value.toUpperCase() })}
                placeholder="e.g. SS or DEV"
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                Short 2-4 letter initials displayed when no logo image is uploaded.
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Role / Tagline
              </label>
              <input
                type="text"
                className="input"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="e.g. Web Specialist & Web Developer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Contact Email *
              </label>
              <input
                type="email"
                required
                className="input"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="e.g. shazzedshuvo@gmail.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Custom Browser Title (Optional)
              </label>
              <input
                type="text"
                className="input"
                value={settings.siteTitle || ''}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="Leave blank to use default (Name — Tagline)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Team / Agency Name (Optional)
              </label>
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
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
            <input
              type="checkbox"
              id="availableForHire"
              checked={Boolean(settings.availableForHire)}
              onChange={(e) => setSettings({ ...settings, availableForHire: e.target.checked })}
              className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
            />
            <label htmlFor="availableForHire" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              🟢 "Available for New Projects" badge displayed next to brand name in Navbar
            </label>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All changes apply instantly across your live website and admin panel.
          </p>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary !px-8 !py-3 font-semibold text-sm group flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
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
