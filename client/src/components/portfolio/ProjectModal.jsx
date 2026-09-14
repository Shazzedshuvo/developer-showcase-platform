import { AnimatePresence, motion } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ProjectModal({ project, onClose }) {
  const [activeImg, setActiveImg] = useState(0);

  const allImages = project
    ? [
        { url: project.coverImage },
        ...(project.gallery || []).map((g) => ({ url: g.url || g })),
      ]
    : [];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const prev = () => setActiveImg((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () => setActiveImg((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                       z-50 w-full sm:w-[90vw] sm:max-w-4xl max-h-[92vh] overflow-y-auto
                       bg-white dark:bg-[#131316] border border-slate-200 dark:border-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#131316]/95 backdrop-blur z-10">
              <div className="flex items-center gap-2 flex-wrap">
                {project.isRecentActive && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                    🔥 Recent Project
                  </span>
                )}
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    <Star size={10} className="fill-amber-400" />
                    Featured
                  </span>
                )}
                {project.category && (
                  <span className="badge">{project.category.name}</span>
                )}
                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight truncate max-w-xs sm:max-w-md">
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {/* Left — Image gallery */}
              <div className="space-y-3">
                {/* Main image */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImg}
                      src={allImages[activeImg]?.url}
                      alt={`Screenshot ${activeImg + 1}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Carousel controls */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                                   bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg
                                   bg-black/60 text-white hover:bg-black/80 transition-all cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImg(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                              i === activeImg ? 'bg-indigo-500 w-4' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`flex-shrink-0 w-16 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === activeImg ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Details */}
              <div className="flex flex-col gap-5 justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    About this project
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Demo link */}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !self-start !text-xs !py-2.5 !px-4"
                  >
                    <ExternalLink size={14} />
                    <span>View Live Website</span>
                  </a>
                )}

                {/* Client Review / Testimonial Screenshot */}
                {project.review && (
                  <div className="border border-slate-200 dark:border-zinc-800 rounded-xl p-4 bg-slate-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: project.review.rating || 5 }).map((_, i) => (
                          <Star key={i} size={12} className="text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                        {project.review.platform && project.review.platform !== 'Fiverr' ? project.review.platform : 'Client Review'}
                        {project.review.clientName && ` — ${project.review.clientName}`}
                      </span>
                    </div>
                    <img
                      src={project.review.image}
                      alt="Client review screenshot"
                      className="w-full rounded-lg border border-slate-200 dark:border-zinc-700"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
