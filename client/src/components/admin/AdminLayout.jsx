import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import {
  LayoutDashboard,
  Tag,
  FolderOpen,
  Star,
  Sliders,
  Users,
  MessageSquare,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
  Shield,
  Sparkles,
  Mail,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/chat', icon: MessageSquare, label: 'Live Chat Inbox' },
  { to: '/admin/leads', icon: Mail, label: 'Client Leads & Emails' },
  { to: '/admin/team', icon: Users, label: 'Team Manager' },
  { to: '/admin/projects', icon: FolderOpen, label: 'Projects Manager' },
  { to: '/admin/categories', icon: Tag, label: 'Platform Categories' },
  { to: '/admin/reviews', icon: Star, label: 'Client Reviews' },
  { to: '/admin/settings', icon: Sliders, label: 'Brand & Logo' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const getPageTitle = () => {
    const item = navItems.find((n) =>
      n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
    );
    return item ? item.label : 'Admin Panel';
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c0f17] border-r border-slate-200 dark:border-zinc-800/80 select-none transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          {settings?.logo ? (
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center p-1">
              <img
                src={settings.logo}
                alt={settings.siteName || 'Brand Logo'}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-[#0c0f17] rounded-[10px] flex items-center justify-center font-extrabold text-slate-900 dark:text-white text-sm">
                {settings?.logoName || 'SS'}
              </div>
            </div>
          )}

          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight truncate">
                {settings?.siteName || 'Shazzed Shuvo'}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
              <Shield className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
              <span className="truncate">Admin Management</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-3 py-4 flex-1 overflow-y-auto custom-scrollbar">
        <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
          Management
        </span>
        <nav className="space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-zinc-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Quick View Website Button */}
      <div className="px-4 py-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-slate-300 dark:hover:text-white transition-all group"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Live Portfolio</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
        </a>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer shadow-sm"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/20 bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#07090e] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-50 flex flex-col w-64 h-full shadow-2xl">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 border-b border-slate-200 dark:border-zinc-800/80 bg-white/85 dark:bg-[#07090e]/80 backdrop-blur-xl transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">{getPageTitle()}</h1>
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                <Link to="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Admin
                </Link>
                <span>/</span>
                <span className="text-slate-600 dark:text-slate-400">{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-600/25 transition-all"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-300 dark:hover:text-white transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
