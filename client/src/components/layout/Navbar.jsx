import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Shazzed Shuvo',
    tagline: 'Web Specialist & Web Developer',
    availableForHire: true,
    logo: '',
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => setSettings(data))
      .catch(console.error);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'Services', href: '#services' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-[#07090e]/90 light:bg-white/90 backdrop-blur-xl border-b border-zinc-800/80 light:border-slate-200 shadow-lg shadow-black/10'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          {settings.logo ? (
            <div className="h-10 max-w-[160px] flex items-center">
              <img
                src={settings.logo}
                alt={settings.siteName || 'Logo'}
                className="max-h-9 w-auto object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#07090e] light:bg-white rounded-[10px] flex items-center justify-center font-bold text-white light:text-slate-900 text-base">
                SS
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 light:text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-indigo-400 transition-colors">
                {settings.siteName || 'Shazzed Shuvo'}
              </span>
              {settings.availableForHire && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Available
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 light:text-slate-600 font-medium hidden sm:block">
              {settings.tagline || 'Web Specialist & CMS Architect'}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/70 light:bg-slate-100/90 backdrop-blur-md border border-zinc-800/80 light:border-slate-200 px-4 py-1.5 rounded-full shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-white/10 light:hover:bg-white rounded-full transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-xl border border-zinc-800 light:border-slate-200 bg-zinc-900/80 light:bg-white text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 transition-all duration-200 shadow-sm cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Admin Login Link */}
          <Link
            to="/admin/login"
            className="p-2.5 rounded-xl border border-zinc-800 light:border-slate-200 bg-zinc-900/80 light:bg-white text-slate-400 hover:text-indigo-400 transition-all duration-200 shadow-sm"
            title="Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>

          {/* CTA Button */}
          <a
            href="#contact"
            className="hidden sm:inline-flex btn-primary !py-2.5 !px-4 !text-xs !rounded-xl"
          >
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-zinc-800 light:border-slate-200 bg-zinc-900 light:bg-white text-slate-300 light:text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d14] light:bg-white border-b border-zinc-800 light:border-slate-200 px-6 py-5 mt-3 space-y-3 animate-slide-up shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-200 light:text-slate-800 hover:text-indigo-400"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-zinc-800 light:border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400 light:text-slate-500">Ready for a project?</span>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary !py-2 !px-4 !text-xs"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
