import { motion } from 'framer-motion';
import { Layers, Globe, Code2, ShoppingBag, Palette, GraduationCap, Zap, Sparkles } from 'lucide-react';

export default function PlatformMarquee() {
  const platforms = [
    {
      name: 'Wix Studio',
      icon: Layers,
      color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/20',
    },
    {
      name: 'Squarespace 7.1',
      icon: Globe,
      color: 'text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-500/10 border-slate-300 dark:border-slate-500/20',
    },
    {
      name: 'Webflow CMS',
      icon: Sparkles,
      color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20',
    },
    {
      name: 'WordPress & Elementor',
      icon: Palette,
      color: 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 border-sky-300 dark:border-sky-500/20',
    },
    {
      name: 'Shopify E-commerce',
      icon: ShoppingBag,
      color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/20',
    },
    {
      name: 'Kajabi Courses',
      icon: GraduationCap,
      color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/20',
    },
    {
      name: 'Custom React & Tailwind',
      icon: Code2,
      color: 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/20',
    },
    {
      name: 'Speed & SEO Optimization',
      icon: Zap,
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full py-6 border-y border-slate-200 dark:border-zinc-800/80 bg-slate-50/90 dark:bg-zinc-950/40 backdrop-blur-md overflow-hidden relative select-none"
    >
      {/* Subtle fade gradient edges (Light & Dark friendly) */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-slate-50 dark:from-[#07090e] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-slate-50 dark:from-[#07090e] to-transparent z-10 pointer-events-none" />

      {/* Continuous Marquee Dual-Tracks */}
      <div className="flex overflow-hidden select-none">
        <div className="marquee-track flex shrink-0 items-center gap-6 pr-6">
          {platforms.map((plat, idx) => {
            const Icon = plat.icon;
            return (
              <div
                key={`p1-${idx}`}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold shrink-0 ${plat.color} transition-all duration-200 hover:scale-105 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
                <span>{plat.name}</span>
              </div>
            );
          })}
        </div>

        <div className="marquee-track flex shrink-0 items-center gap-6 pr-6" aria-hidden="true">
          {platforms.map((plat, idx) => {
            const Icon = plat.icon;
            return (
              <div
                key={`p2-${idx}`}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold shrink-0 ${plat.color} transition-all duration-200 hover:scale-105 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
                <span>{plat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
