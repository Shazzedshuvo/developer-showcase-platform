import { motion } from 'framer-motion';
import { Compass, PenTool, Code, CheckCircle, Rocket } from 'lucide-react';

export default function ProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We align on your brand identity, target demographic, feature wishlist, and inspiration sites to map out a clear roadmap.',
      icon: Compass,
    },
    {
      step: '02',
      title: 'Wireframing & UI Design',
      description: 'Crafting modern layout wireframes, typography selections, color schemes, and mobile-first responsive mockups.',
      icon: PenTool,
    },
    {
      step: '03',
      title: 'Development & Build',
      description: 'Building the site in your desired platform (Wix, Squarespace, Webflow, WordPress, or Custom) with custom CSS/JS interactions.',
      icon: Code,
    },
    {
      step: '04',
      title: 'Testing, SEO & QA',
      description: 'Testing responsiveness on iPhone, Android, tablets & desktop. Optimizing Core Web Vitals, speed, and on-page SEO meta tags.',
      icon: CheckCircle,
    },
    {
      step: '05',
      title: 'Launch & 30-Day Support',
      description: 'Connecting custom domains, setting up DNS records, recording tutorial walkthrough videos, and providing 30 days of free support.',
      icon: Rocket,
    },
  ];

  return (
    <section id="process" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-zinc-800/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 mb-4">
          <span>Workflow &amp; Transparency</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          How We Bring Your Vision <span className="text-gradient-primary">To Life</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          A battle-tested 5-step process designed for rapid turnaround, seamless communication, and flawless execution.
        </p>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {steps.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="card p-6 flex flex-col justify-between relative overflow-hidden group card-hover-effect hover:border-purple-500/40 transition-all duration-300"
            >
              {/* Step background number */}
              <div className="absolute top-2 right-3 text-4xl font-extrabold text-slate-200 dark:text-zinc-800/40 group-hover:text-purple-500/20 transition-colors pointer-events-none select-none">
                {st.step}
              </div>

              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                  Phase {st.step}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
