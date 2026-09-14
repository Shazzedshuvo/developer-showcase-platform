import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Eye, Star, Globe, ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const fallbackImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="card group overflow-hidden flex flex-col card-hover-effect hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer"
      onClick={() => onSelect(project)}
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-zinc-950 overflow-hidden border-b border-slate-200 dark:border-zinc-800/80">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-100 dark:bg-zinc-900 animate-pulse flex items-center justify-center">
            <Globe className="w-8 h-8 text-slate-300 dark:text-zinc-700 animate-spin" />
          </div>
        )}

        <img
          src={imageError ? fallbackImage : (project.coverImage || fallbackImage)}
          alt={project.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Platform Badge (Top Left) */}
        {project.category && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md shadow-sm ${getPlatformStyle(
                project.category.slug
              )}`}
            >
              {project.category.name}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {project.isRecentActive && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-md animate-pulse">
              <span>🔥 Recent</span>
            </span>
          )}

          {project.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-md">
              <Star className="w-3 h-3 fill-amber-400" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
            {project.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View Showcase</span>
            <Eye className="w-3 h-3" />
          </button>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <span>Visit Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
