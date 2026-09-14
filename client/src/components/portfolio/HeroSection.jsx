import { motion } from 'framer-motion';
import { ArrowDown, Star, Sparkles, FolderCheck, CheckCircle2, MessageSquare, Zap, Globe, Layers } from 'lucide-react';
import EarthGlobe from './EarthGlobe';

export default function HeroSection({ totalProjects = 78, teamName = 'Dont Worry' }) {
  const stats = [
    { label: 'Live Projects Built', value: `${totalProjects}+`, icon: FolderCheck },
    { label: 'Client Satisfaction', value: '100%', icon: Star },
    { label: 'Supported Platforms', value: '7+', icon: Sparkles },
    { label: 'Turnaround Time', value: '24-48h', icon: CheckCircle2 },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden glow-mesh">
      {/* 3D Rotating Interactive Earth Globe Canvas */}
      <EarthGlobe />

      {/* Decorative Ambient Gradient Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[400px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-24 right-8 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Floating 3D Micro-Badges (Left & Right) */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 shadow-xl backdrop-blur-md absolute left-12 top-1/3 animate-float-slow"
      >
        <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100">100/100 Speed</div>
          <div className="text-[9px] text-slate-500 font-medium">Core Web Vitals</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 shadow-xl backdrop-blur-md absolute right-12 top-1/3 animate-float-reverse"
      >
        <div className="w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
          <Globe className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100">Global Clients</div>
          <div className="text-[9px] text-slate-500 font-medium">US, UK, EU, UAE</div>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {/* Availability & Badge Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-300 text-xs font-semibold mb-6 shadow-md shadow-slate-200/50 dark:shadow-xl backdrop-blur-md"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-800 dark:text-slate-300">Wix Studio, Squarespace &amp; CMS Specialist</span>
          {teamName && (
            <>
              <span className="text-slate-400 dark:text-zinc-600">•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                Team {teamName}
              </span>
            </>
          )}
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12] mb-6"
        >
          Crafting High-Converting Websites That Turn{' '}
          <span className="text-gradient-primary">Visitors Into Clients</span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Specialized in bespoke <strong className="text-slate-900 dark:text-slate-200 font-semibold">Wix Studio</strong>,{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-semibold">Squarespace</strong>,{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-semibold">Webflow</strong>,{' '}
          <strong className="text-slate-900 dark:text-slate-200 font-semibold">WordPress</strong> &amp; custom web development with pixel-perfect responsive design and 5-star verified client satisfaction.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <a href="#projects" className="btn-primary group">
            <span>Explore All Projects</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a href="#contact" className="btn-secondary group">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>Get a Free Quote</span>
          </a>

          <a href="#reviews" className="btn-secondary group">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
            <span>Client Reviews</span>
          </a>
        </motion.div>

        {/* KPI Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full"
        >
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="card p-4 sm:p-5 flex flex-col items-center justify-center text-center card-hover-effect group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  {st.label}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
