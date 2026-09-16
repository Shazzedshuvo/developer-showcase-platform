import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Share2,
  Check,
  Globe,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ProjectModal({
  project,
  projects = [],
  onSelectProject,
  onClose,
  onInquire,
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'review'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  // Collect all images (cover + gallery)
  const allImages = project
    ? [
        { url: project.coverImage, label: 'Cover Showcase' },
        ...(project.gallery || []).map((g, i) => ({
          url: g.url || g,
          label: `Screenshot ${i + 1}`,
        })),
      ]
    : [];

  // Reset active image when project changes
  useEffect(() => {
    setActiveImg(0);
    setActiveTab('gallery');
    setIsFullscreen(false);
    setZoomLevel(1);
  }, [project?._id]);

  // Current project index in projects list
  const currentIndex = projects.findIndex((p) => p._id === project?._id);
  const hasMultipleProjects = projects.length > 1 && currentIndex !== -1;

  const goToPrevProject = () => {
    if (!hasMultipleProjects || !onSelectProject) return;
    const prevIdx = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    onSelectProject(projects[prevIdx]);
  };

  const goToNextProject = () => {
    if (!hasMultipleProjects || !onSelectProject) return;
    const nextIdx = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    onSelectProject(projects[nextIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
          setZoomLevel(1);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeTab === 'gallery' && allImages.length > 1) {
          setActiveImg((i) => (i === 0 ? allImages.length - 1 : i - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (activeTab === 'gallery' && allImages.length > 1) {
          setActiveImg((i) => (i === allImages.length - 1 ? 0 : i + 1));
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, isFullscreen, activeTab, allImages.length]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const prevImage = () => {
    setActiveImg((i) => (i === 0 ? allImages.length - 1 : i - 1));
    setZoomLevel(1);
  };

  const nextImage = () => {
    setActiveImg((i) => (i === allImages.length - 1 ? 0 : i + 1));
    setZoomLevel(1);
  };

  const handleCopyLink = () => {
    const shareUrl = project.demoUrl || window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Project link copied to clipboard!', { id: 'modal-copy' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInquireClick = () => {
    if (onInquire) {
      onInquire(project);
    } else {
      onClose();
      setTimeout(() => {
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  if (!project) return null;

  // Platform style helper
  const getPlatformStyle = (slug) => {
    switch (slug?.toLowerCase()) {
      case 'wix':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
      case 'squarespace':
        return 'bg-slate-500/15 text-slate-800 dark:text-slate-200 border-slate-400/30';
      case 'wordpress':
        return 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30';
      case 'webflow':
        return 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30';
      case 'shopify':
        return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30';
      case 'kajabi':
        return 'bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/30';
      default:
        return 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30';
    }
  };

  // Simulated live domain for browser mockup
  const simulatedDomain = project.demoUrl
    ? project.demoUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : `${project.slug || 'project'}.live`;

  return (
    <>
      {/* Centered Modal Container (Fixed overlay with Flexbox centering) */}
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 md:p-8">
        {/* Backdrop overlay */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer transition-all"
        />

        {/* Modal Window Card */}
        <motion.div
          ref={modalRef}
          key="panel"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative z-10 w-full max-w-5xl my-auto bg-white dark:bg-[#0e111a] border border-slate-200/90 dark:border-zinc-800/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ─── Browser Mockup Titlebar & Navigation ─────────────────────── */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200/90 dark:border-zinc-800/90 bg-slate-50/95 dark:bg-[#121520]/95 backdrop-blur-md">
            {/* Left: macOS Window Traffic Lights */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <button
                  onClick={onClose}
                  title="Close (Esc)"
                  className="w-3.5 h-3.5 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-600/40 transition-all cursor-pointer"
                />
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title="Toggle Fullscreen"
                  className="w-3.5 h-3.5 rounded-full bg-amber-500/80 hover:bg-amber-500 border border-amber-600/40 transition-all cursor-pointer"
                />
                <button
                  onClick={goToNextProject}
                  title="Next Project"
                  className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 border border-emerald-600/40 transition-all cursor-pointer"
                />
              </div>

              {/* Prev / Next Project Switcher Buttons */}
              {hasMultipleProjects && (
                <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-0.5 shadow-xs">
                  <button
                    onClick={goToPrevProject}
                    title="Previous Project"
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span className="text-[11px] font-semibold px-2 text-slate-500 dark:text-slate-400 border-x border-slate-200 dark:border-zinc-800 select-none">
                    {currentIndex + 1} / {projects.length}
                  </span>
                  <button
                    onClick={goToNextProject}
                    title="Next Project"
                    className="p-1 rounded-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Center: Simulated Browser URL Address Bar */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-slate-400 max-w-sm w-full mx-4 shadow-2xs">
              <Globe size={13} className="text-indigo-500 shrink-0" />
              <span className="truncate font-mono text-[11px] text-slate-700 dark:text-slate-300">
                https://{simulatedDomain}
              </span>
              <button
                onClick={handleCopyLink}
                title="Copy Project Link"
                className="ml-auto text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Share2 size={12} />}
              </button>
            </div>

            {/* Right: Actions & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                title="Share Project"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-500" />
                    <span className="hidden xs:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 size={14} />
                    <span className="hidden xs:inline text-[11px]">Share</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer flex items-center gap-1"
                aria-label="Close modal"
              >
                <X size={18} />
                <span className="hidden sm:inline text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-200/70 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  ESC
                </span>
              </button>
            </div>
          </div>

          {/* ─── Modal Scrollable Body ───────────────────────────────────── */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* Top Info Bar: Category, Tags, Title */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {project.category && (
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold border backdrop-blur-md shadow-xs ${getPlatformStyle(
                        project.category.slug
                      )}`}
                    >
                      {project.category.name}
                    </span>
                  )}
                  {project.isPinned && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 shadow-xs">
                      📌 Pinned Showcase
                    </span>
                  )}
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 shadow-xs">
                      <Star size={11} className="fill-indigo-500" />
                      Featured
                    </span>
                  )}
                  {(project.isRecentActive || project.isRecent) && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 shadow-xs animate-pulse">
                      🔥 Recent Work
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {project.title}
                </h2>
              </div>

              {/* Quick Jump buttons if project has client review */}
              {project.review && (
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'gallery'
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Eye size={13} />
                    <span>Showcase ({allImages.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('review')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'review'
                        ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    <span>Client Review</span>
                  </button>
                </div>
              )}
            </div>

            {/* ─── Main Content Grid: Media Viewport & Details ──────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Media Stage (7 cols on lg) */}
              <div className="lg:col-span-7 space-y-4">
                {activeTab === 'gallery' ? (
                  <div className="space-y-3">
                    {/* Main Image Frame */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-slate-200 dark:border-zinc-800/80 shadow-lg group select-none">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeImg}
                          src={allImages[activeImg]?.url}
                          alt={allImages[activeImg]?.label || project.title}
                          initial={{ opacity: 0, scale: 1.02 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full h-full object-cover object-top"
                        />
                      </AnimatePresence>

                      {/* Image top overlay badge: Counter & Zoom */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm pointer-events-auto">
                          {activeImg + 1} / {allImages.length}
                        </span>

                        <div className="flex items-center gap-1.5 pointer-events-auto">
                          <button
                            onClick={() => setIsFullscreen(true)}
                            title="Open Fullscreen Lightbox Zoom"
                            className="p-2 rounded-xl bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/10 shadow-sm transition-all hover:scale-105 cursor-pointer"
                          >
                            <Maximize2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Left / Right Carousel Controls */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            aria-label="Previous screenshot"
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg z-10"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={nextImage}
                            aria-label="Next screenshot"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer shadow-lg z-10"
                          >
                            <ChevronRight size={18} />
                          </button>

                          {/* Dots Bar */}
                          <div className="absolute bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-10">
                            {allImages.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveImg(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                  i === activeImg
                                    ? 'bg-indigo-500 w-6 shadow-sm shadow-indigo-500/50'
                                    : 'bg-white/40 hover:bg-white/80 w-1.5'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {allImages.length > 1 && (
                      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                        {allImages.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setActiveImg(i);
                              setZoomLevel(1);
                            }}
                            className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative group/thumb ${
                              i === activeImg
                                ? 'border-indigo-500 shadow-md shadow-indigo-500/20 scale-[1.03]'
                                : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={img.label}
                              className="w-full h-full object-cover object-top"
                            />
                            {i === activeImg && (
                              <span className="absolute bottom-0 inset-x-0 h-1 bg-indigo-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Verified Review View */
                  project.review && (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-zinc-800/80 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-white">
                              {project.review.platform || 'Direct Client'} Testimonial
                            </span>
                          </div>
                          <div className="flex gap-0.5">
                            {Array.from({ length: project.review.rating || 5 }).map((_, i) => (
                              <Star key={i} size={13} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        {/* Review Image with click-to-zoom */}
                        <div
                          onClick={() => setIsFullscreen(true)}
                          className="relative rounded-xl overflow-hidden border border-slate-700/60 cursor-pointer group/rev"
                        >
                          <img
                            src={project.review.image}
                            alt="Client review proof"
                            className="w-full h-auto object-contain max-h-[380px] mx-auto rounded-lg group-hover/rev:scale-[1.02] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/rev:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-xs">
                            <ZoomIn size={16} />
                            <span>Click to Inspect Full Size</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Right Column: Project Details & Interactions (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* About Description */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-indigo-500" />
                      Project Overview & Scope
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800/80">
                      {project.description}
                    </p>
                  </div>

                  {/* Highlights / Technical Pills */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Key Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Fully Responsive',
                        'SEO Optimized',
                        'Clean Typography',
                        'Interactive UI',
                        'Speed Performance',
                      ].map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-zinc-800"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Client Testimonial Preview Card (if available and not in review tab) */}
                  {project.review && activeTab === 'gallery' && (
                    <div
                      onClick={() => setActiveTab('review')}
                      className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 hover:border-amber-500/60 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Verified {project.review.platform || 'Partner'} Review
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: project.review.rating || 5 }).map((_, i) => (
                            <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                        {project.review.clientName
                          ? `Feedback from ${project.review.clientName}`
                          : '5-Star Rating & Feedback Attached'}
                      </p>
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 group-hover:underline inline-flex items-center gap-1 mt-1">
                        Inspect review screenshot →
                      </span>
                    </div>
                  )}
                </div>

                {/* ─── Action Buttons ─────────────────────────────────────── */}
                <div className="space-y-2.5 pt-4 border-t border-slate-200/80 dark:border-zinc-800/80">
                  {/* Live Site CTA */}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full py-3.5 shadow-lg group flex items-center justify-center gap-2"
                    >
                      <Globe size={16} />
                      <span>Explore Live Website</span>
                      <ExternalLink
                        size={15}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                      />
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 text-center py-2 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
                      Private / Internal Project Showcase
                    </div>
                  )}

                  {/* Start Similar Project CTA */}
                  <button
                    onClick={handleInquireClick}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:border-indigo-500/40"
                  >
                    <MessageSquare size={15} className="text-indigo-500" />
                    <span>Inquire About a Project Like This</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Footer: Next / Prev Navigation Bar ──────────────────────── */}
          {hasMultipleProjects && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200/80 dark:border-zinc-800/80 bg-slate-50 dark:bg-[#121520]/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <button
                onClick={goToPrevProject}
                className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-800"
              >
                <ChevronLeft size={15} />
                <span>Previous Project</span>
              </button>

              <span className="text-[11px] font-mono text-slate-400">
                Use <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">→</kbd> to browse screenshots
              </span>

              <button
                onClick={goToNextProject}
                className="flex items-center gap-1.5 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-800"
              >
                <span>Next Project</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Immersive Fullscreen Lightbox Zoom Modal ─────────────────── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 select-none"
            onClick={() => {
              setIsFullscreen(false);
              setZoomLevel(1);
            }}
          >
            {/* Top Toolbar */}
            <div
              className="flex items-center justify-between text-white z-10 px-2 sm:px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold truncate max-w-xs sm:max-w-md">
                  {project.title} —{' '}
                  {activeTab === 'review'
                    ? 'Client Review Proof'
                    : allImages[activeImg]?.label || 'Screenshot'}
                </span>
                {activeTab === 'gallery' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 font-mono">
                    {activeImg + 1} / {allImages.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Zoom in/out controls */}
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
                  title="Zoom In"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 1))}
                  title="Zoom Out"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs font-mono"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  onClick={() => {
                    setIsFullscreen(false);
                    setZoomLevel(1);
                  }}
                  title="Close Fullscreen"
                  className="p-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image Canvas with pan/zoom */}
            <div
              className="flex-1 flex items-center justify-center overflow-auto p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={
                  activeTab === 'review'
                    ? project.review?.image
                    : allImages[activeImg]?.url
                }
                alt={project.title}
                animate={{ scale: zoomLevel }}
                transition={{ duration: 0.2 }}
                className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl transition-transform cursor-grab active:cursor-grabbing"
              />
            </div>

            {/* Bottom Carousel Controls in Fullscreen */}
            {activeTab === 'gallery' && allImages.length > 1 && (
              <div
                className="flex items-center justify-center gap-4 py-2 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={prevImage}
                  className="p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveImg(i);
                        setZoomLevel(1);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === activeImg ? 'w-8 bg-indigo-500' : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextImage}
                  className="p-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
