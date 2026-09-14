import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertCircle, ChevronDown } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects = [], loading = false, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'featured') {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [projects, searchQuery, sortBy]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="card overflow-hidden animate-pulse">
            <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-zinc-800" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-full" />
              <div className="h-3 bg-slate-200 dark:bg-zinc-800 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 backdrop-blur-md shadow-sm">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, industry, or tech..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Info & Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Showing <strong className="text-slate-900 dark:text-slate-200">{Math.min(displayedProjects.length, filteredProjects.length)}</strong> of <strong className="text-slate-900 dark:text-slate-200">{filteredProjects.length}</strong>
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer font-medium"
          >
            <option value="featured">Featured First</option>
            <option value="alphabetical">A-Z Name</option>
          </select>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-slate-400 dark:text-zinc-600 mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-slate-200 text-lg mb-1">No Projects Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search query or selecting a different platform category.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-secondary !text-xs !py-2 !px-4"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSelect={onSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProjects.length && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="btn-secondary group flex items-center gap-2 !px-8 !py-3 font-semibold text-sm cursor-pointer"
          >
            <span>Load More Projects ({filteredProjects.length - visibleCount} remaining)</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
