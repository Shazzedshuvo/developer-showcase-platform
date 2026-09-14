import { Layers, Globe, Code2, ShoppingBag, Palette, GraduationCap, Zap, Sparkles } from 'lucide-react';

export default function PlatformMarquee() {
  const platforms = [
    { name: 'Wix Studio', icon: Layers, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { name: 'Squarespace 7.1', icon: Globe, color: 'text-slate-200 bg-slate-500/10 border-slate-500/20' },
    { name: 'Webflow CMS', icon: Sparkles, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { name: 'WordPress & Elementor', icon: Palette, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { name: 'Shopify E-commerce', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { name: 'Kajabi Courses', icon: GraduationCap, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { name: 'Custom React & Tailwind', icon: Code2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { name: 'Speed & SEO Optimization', icon: Zap, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  return (
    <div className="w-full py-6 border-y border-zinc-800/80 bg-zinc-950/40 dark:bg-zinc-950/40 light:bg-slate-100/80 backdrop-blur-sm overflow-hidden relative">
      {/* Subtle fade gradient edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#07090e] dark:from-[#07090e] light:from-slate-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#07090e] dark:from-[#07090e] light:from-slate-50 to-transparent z-10 pointer-events-none"></div>

      {/* Marquee Track (Continuous Infinite Animation) */}
      <div className="flex overflow-hidden select-none">
        <div className="marquee-track flex shrink-0 items-center gap-6 pr-6">
          {platforms.map((plat, idx) => {
            const Icon = plat.icon;
            return (
              <div
                key={`p1-${idx}`}
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 ${plat.color} transition-all hover:scale-105 shadow-sm`}
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
                className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 ${plat.color} transition-all hover:scale-105 shadow-sm`}
              >
                <Icon className="w-4 h-4" />
                <span>{plat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
