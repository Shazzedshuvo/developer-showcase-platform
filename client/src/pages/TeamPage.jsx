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
                  className="rounded-3xl p-6 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 animate-pulse h-96"
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative rounded-3xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 p-6 shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Member Avatar Header */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors shadow-md">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xl text-indigo-500 bg-indigo-500/10">
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                          {member.role}
                        </p>
                        {member.experience && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-700">
                            {member.experience}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Skills Tags */}
                    {member.skills && member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {member.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social & Contact Bar */}
                  <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      {member.socialLinks?.github && (
                        <a
                          href={member.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
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
                          className="p-1.5 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
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
                          className="p-1.5 rounded-lg hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Portfolio / Live Work"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-lg hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <a
                      href="/#contact"
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>Collaborate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
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
