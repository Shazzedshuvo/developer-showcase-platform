import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800/80 bg-slate-100/90 dark:bg-[#05070a] pt-16 pb-12 relative overflow-hidden glow-mesh-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteName || 'Logo'}
                  className="max-h-9 w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px]">
                  <div className="w-full h-full bg-white dark:bg-[#07090e] rounded-[10px] flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm">
                    {settings?.logoName || 'SS'}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                  {settings.siteName || 'Shazzed Shuvo'}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Professional Web Developer &amp; CMS Specialist creating high-converting digital experiences on Wix Studio, Squarespace, Webflow, Shopify &amp; Full-Stack code.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Available Worldwide
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="/#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Services &amp; Pricing
                </a>
              </li>
              <li>
                <a href="/team" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <span>Team ({settings.teamName || 'Dont Worry'})</span>
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Client Reviews (5.0 ⭐)
                </a>
              </li>
              <li>
                <a href="/#process" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Development Process
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">
              Supported Platforms
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Wix Studio', 'Squarespace 7.1', 'Webflow', 'WordPress', 'Shopify', 'Kajabi', 'React.js', 'Tailwind CSS'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} {settings.siteName || 'Shazzed Shuvo'}. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for high performance.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group cursor-pointer"
          >
            <span>Back to top</span>
            <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 group-hover:bg-slate-50 dark:group-hover:bg-zinc-800 transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
