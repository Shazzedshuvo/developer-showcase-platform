import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Sparkles,
  Github,
  Linkedin,
  Globe,
  Mail,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  Award,
  Layers,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../api/axios';

export default function TeamPage() {
  const [teamInfo, setTeamInfo] = useState({
    teamName: 'Dont Worry',
    teamTagline: 'Collaborative Excellence in Web Development & CMS Solutions',
    teamDescription:
      'A high-performance multidisciplinary team of dedicated web engineers, designers, and CMS specialists delivering bespoke digital experiences with 100% precision.',
    members: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    api
      .get('/team')
      .then(({ data }) => {
        if (data) setTeamInfo(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Projects Completed', value: '100+', icon: Layers },
    { label: 'Client Satisfaction', value: '100%', icon: Award },
    { label: 'Platform Experts', value: '8+', icon: Zap },
    { label: 'Avg. Turnaround', value: '24-48h', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 shadow-sm"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team {teamInfo.teamName || 'Dont Worry'}</span>
            <span className="text-slate-400 dark:text-zinc-600">•</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Specialist Collective</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white max-w-3xl mx-auto mb-6"
          >
            Meet the Minds of{' '}
            <span className="text-gradient-primary">Team {teamInfo.teamName || 'Dont Worry'}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {teamInfo.teamDescription}
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 shadow-sm"
          >
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* Team Members Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Our Core Creators &amp; Specialists
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              Cross-disciplinary talent focused on high conversion, precision code, and design perfection.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl p-6 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 animate-pulse h-[520px]"
                />
              ))}
            </div>
          ) : teamInfo.members && teamInfo.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamInfo.members.map((member, index) => (
                <motion.div
                  key={member._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-3xl bg-white dark:bg-[#0e1118] border border-slate-200 dark:border-zinc-800/80 overflow-hidden shadow-xl shadow-slate-200/60 dark:shadow-black/50 hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Unified Studio Theme Background for Member Photo */}
                    <div className="relative w-full h-80 sm:h-96 overflow-hidden p-3 pb-0">
                      <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner border border-slate-200/80 dark:border-indigo-500/20 bg-gradient-to-b from-[#0e1222] via-[#090b14] to-[#04060a]">
                        {/* Cohesive Theme Blur Glow Studio Lighting (Identical across all members) */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-indigo-500/35 rounded-full blur-3xl" />
                          <div className="absolute -bottom-8 -right-8 w-44 h-44 bg-purple-600/30 rounded-full blur-2xl" />
                          <div className="absolute -top-8 -left-8 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(99,102,241,0.2),transparent_75%)]" />
                        </div>

                        {/* Portrait Image */}
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="relative z-10 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white p-6">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl font-extrabold mb-2 text-indigo-300">
                              {member.name.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-slate-300">{member.name}</span>
                          </div>
                        )}

                        {/* Top Floating Glass Badge */}
                        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-lg">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>{member.role}</span>
                          </span>

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white backdrop-blur-md shadow-lg border border-emerald-400/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Active</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Member Details Content (Clean & High Contrast Below Photo) */}
                    <div className="p-6 space-y-4">
                      {/* Name & Role Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {member.name}
                          </h3>
                          {member.experience && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                              <Award className="w-3 h-3 text-amber-500" />
                              <span>{member.experience}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                          {member.role} • Team {teamInfo.teamName || 'Dont Worry'}
                        </p>
                      </div>

                      {/* Bio */}
                      {member.bio ? (
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          Specialist in responsive web design, CMS architecture, and pixel-perfect implementation.
                        </p>
                      )}

                      {/* Skills Tags */}
                      {member.skills && member.skills.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Core Technologies
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {member.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800/90 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-700/80 hover:border-indigo-500/40 transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social & Contact Action Bar */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-950/80 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      {member.socialLinks?.github && (
                        <a
                          href={member.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm"
                          title="GitHub Profile"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {member.socialLinks?.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.socialLinks?.portfolio && (
                        <a
                          href={member.socialLinks.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all shadow-sm"
                          title="Portfolio / Works"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:text-amber-500 hover:border-amber-300 dark:hover:border-amber-800 transition-all shadow-sm"
                          title="Direct Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <a
                      href="/#contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <span>Hire Expert</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              No team members listed yet. Add them in the Admin Dashboard!
            </div>
          )}
        </section>

        {/* Why Choose Our Team Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-tr from-indigo-950/20 via-slate-900/40 to-purple-950/20 border border-indigo-500/20 relative overflow-hidden">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Why Team {teamInfo.teamName || 'Dont Worry'}?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                Built for High-Growth Brands &amp; Global Clients
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  100% Guaranteed Quality
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every site is meticulously built with responsive QA, Google Lighthouse 100/100 performance scores, and SEO best practices.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Fast 24-48h Delivery
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our structured development workflow ensures your project is launched without endless delays or bottleneck backlogs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  Direct Developer Access
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Zero middlemen. You communicate directly with the developers and designers building your digital product.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Hire CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Ready to Build With Team {teamInfo.teamName || 'Dont Worry'}?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Let's discuss your next project, custom redesign, or complete CMS development roadmap today.
          </p>
          <a href="/#contact" className="btn-primary !px-8 !py-3.5 !text-sm inline-flex items-center gap-2">
            <span>Start a Project with Us</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
