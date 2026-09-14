import { motion } from 'framer-motion';
import { ArrowDown, Star, Sparkles, FolderCheck, CheckCircle2, MessageSquare } from 'lucide-react';

export default function HeroSection({ totalProjects = 78 }) {
  const stats = [
    { label: 'Live Projects Built', value: `${totalProjects}+`, icon: FolderCheck },
    { label: 'Client Satisfaction', value: '100%', icon: Star },
    { label: 'Supported Platforms', value: '7+', icon: Sparkles },
    { label: 'Turnaround Time', value: '24-48h', icon: CheckCircle2 },
  ];

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 overflow-hidden glow-mesh">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-300 text-xs font-semibold mb-6 shadow-md shadow-slate-200/50 dark:shadow-xl backdrop-blur-md"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-800 dark:text-slate-300">Wix Studio, Squarespace &amp; CMS Specialist</span>
          <span className="text-slate-400 dark:text-zinc-600">•</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Agency &amp; Corporate Experience
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crafting High-Converting Websites That Turn{' '}
          <span className="text-gradient-primary">Visitors Into Clients</span>
        </motion.h1>

        {/* Subtitle */}
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

        {/* CTA Actions */}
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

          <a href="#contact" className="btn-secondary">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Get a Free Quote</span>
          </a>

          <a href="#reviews" className="btn-secondary">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Client Reviews</span>
          </a>
        </motion.div>

        {/* Stats Grid */}
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
                className="card p-4 sm:p-5 flex flex-col items-center justify-center text-center hover:border-indigo-400/50 transition-all group"
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
