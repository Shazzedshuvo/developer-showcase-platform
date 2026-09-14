import { motion } from 'framer-motion';

export default function CategoryFilter({ categories = [], activeSlug = 'all', onChange, counts = {} }) {
  const allTabs = [
    { name: 'All Platforms', slug: 'all' },
    { name: '🔥 Recent Work', slug: 'recent' },
    ...categories,
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800/90 backdrop-blur-md max-w-5xl mx-auto mb-10 shadow-md shadow-slate-200/50 dark:shadow-xl">
      {allTabs.map((cat) => {
        const isActive = activeSlug === cat.slug;
        const count = cat.slug === 'all' ? counts.total : counts[cat.slug];

        return (
          <button
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
            className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              isActive
                ? 'text-white font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategoryPill"
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-xl shadow-md shadow-indigo-500/25 -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
