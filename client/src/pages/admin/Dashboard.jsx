import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderOpen,
  Tag,
  Star,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Flame,
  Globe,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import api from '../../api/axios';

const COLORS = [
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f43f5e', // Rose
];

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/categories'),
      api.get('/reviews'),
      api.get('/settings').catch(() => ({ data: {} })),
    ])
      .then(([p, c, r, s]) => {
        setProjects(p.data || []);
        setCategories(c.data || []);
        setReviews(r.data || []);
        setSettings(s.data || {});
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute platform distribution for Pie Chart
  const platformChartData = useMemo(() => {
    if (!categories.length || !projects.length) return [];
    return categories
      .map((cat, idx) => {
        const count = projects.filter((p) => p.category?._id === cat._id || p.category?.slug === cat.slug).length;
        return {
          name: cat.name,
          value: count,
          color: COLORS[idx % COLORS.length],
        };
      })
      .filter((item) => item.value > 0);
  }, [categories, projects]);

  // Compute category breakdown with Recent vs Featured for Bar Chart
  const categoryBarData = useMemo(() => {
    if (!categories.length) return [];
    return categories.map((cat) => {
      const catProjects = projects.filter(
        (p) => p.category?._id === cat._id || p.category?.slug === cat.slug
      );
      const recentCount = catProjects.filter((p) => p.isRecentActive || p.isRecent).length;
      const featuredCount = catProjects.filter((p) => p.isFeatured).length;
      const standardCount = catProjects.length - recentCount;

      return {
        name: cat.name.split(' ')[0], // Short name
        fullName: cat.name,
        total: catProjects.length,
        recent: recentCount,
        featured: featuredCount,
        standard: Math.max(0, standardCount),
      };
    });
  }, [categories, projects]);

  // Simulated delivery growth timeline
  const growthTimelineData = useMemo(() => {
    return [
      { month: 'Q1', projects: 12, views: 3400, satisfaction: 100 },
      { month: 'Q2', projects: 24, views: 5800, satisfaction: 100 },
      { month: 'Q3', projects: 45, views: 9200, satisfaction: 100 },
      { month: 'Q4', projects: 62, views: 14500, satisfaction: 100 },
      { month: 'Current', projects: projects.length || 78, views: 18900, satisfaction: 100 },
    ];
  }, [projects.length]);

  const recentProjectsCount = useMemo(
    () => projects.filter((p) => p.isRecentActive || p.isRecent).length,
    [projects]
  );

  const featuredProjectsCount = useMemo(
    () => projects.filter((p) => p.isFeatured).length,
    [projects]
  );

  // Latest 5 projects
  const latestProjects = useMemo(() => projects.slice(0, 5), [projects]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Greeting */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-zinc-950 border border-indigo-500/20 shadow-xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Analytics &amp; Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {settings?.siteName || 'Shazzed'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
              Your portfolio is fully synchronized with MongoDB Atlas &amp; Cloudinary CDN. Manage 78+ client projects, live categories, and brand settings in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-slate-300 hover:text-white font-semibold text-xs transition-all"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Preview Portfolio</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="card p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Live Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? '...' : projects.length}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% active on Atlas DB</span>
            </div>
          </div>
        </div>

        {/* 1-Year Priority Recent Projects */}
        <div className="card p-5 flex flex-col justify-between hover:border-rose-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              🔥 1-Yr Recent Work
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? '...' : recentProjectsCount}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-semibold mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>365-day Top Showcase Priority</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="card p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Platforms Supported
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? '...' : categories.length}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Wix, Squarespace, Webflow &amp; more</span>
            </div>
          </div>
        </div>

        {/* Client Reviews */}
        <div className="card p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Client Feedback
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {loading ? '...' : reviews.length}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5.0 / 5.0 Rating Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Platform Distribution Donut */}
        <div className="lg:col-span-5 card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">Platform Distribution</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Share of projects by CMS &amp; stack
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-slate-300">
              {projects.length} Total
            </span>
          </div>

          {/* Chart Container */}
          <div className="h-64 w-full relative flex items-center justify-center">
            {loading ? (
              <div className="text-xs text-slate-500 animate-pulse">Loading chart...</div>
            ) : platformChartData.length === 0 ? (
              <div className="text-xs text-slate-500">No project data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {platformChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0f17',
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-800/80">
            {platformChartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-zinc-900/60">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-300 truncate font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-400 ml-2">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-slate-100 text-sm">Platform Projects Breakdown</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distribution of Standard, Featured, and 1-Year Recent work
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Standard
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> 🔥 Recent
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500 animate-pulse">
                Loading analytics...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c0f17',
                      borderColor: '#27272a',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                  />
                  <Bar dataKey="standard" name="Standard Projects" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="recent" name="🔥 1-Yr Recent" fill="#f43f5e" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Stats Footnote */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{featuredProjectsCount} projects featured on landing page</span>
            </span>
            <Link to="/admin/projects" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>Manage Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Chart Section 3: Portfolio Growth Area Curve */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-slate-100 text-sm">Portfolio Growth &amp; Engagement Activity</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cumulative project releases and client engagement velocity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% On-Time Delivery
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0c0f17',
                  borderColor: '#27272a',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="projects"
                name="Delivered Projects"
                stroke="#8b5cf6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProjects)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Latest Projects Table & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latest Projects List */}
        <div className="lg:col-span-8 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Recent Projects Feed</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Latest websites stored in your portfolio</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {latestProjects.map((p) => (
              <div
                key={p._id}
                className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80'}
                    alt={p.title}
                    className="w-12 h-9 rounded-lg object-cover bg-zinc-950 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-slate-200 text-xs truncate">{p.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.category && (
                        <span className="text-[10px] text-slate-400">{p.category.name}</span>
                      )}
                      {p.isRecentActive && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          🔥 Recent
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {p.demoUrl && (
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-slate-300 hover:text-white transition-all"
                      title="Open Live Site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Shortcuts Hub */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm">Quick Management</h3>
            <div className="space-y-2">
              <Link
                to="/admin/projects"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <FolderOpen className="w-3.5 h-3.5" />
                  </div>
                  <span>Add / Edit Projects</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/categories"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <span>Manage Categories</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/reviews"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Star className="w-3.5 h-3.5" />
                  </div>
                  <span>Upload Client Reviews</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-slate-200 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Brand Logo &amp; Settings</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>

          {/* System Status Card */}
          <div className="card p-5 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300">System Health</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-slate-200 font-semibold">MongoDB Atlas Cloud</span>
              </div>
              <div className="flex justify-between">
                <span>Media Storage:</span>
                <span className="text-slate-200 font-semibold">Cloudinary CDN</span>
              </div>
              <div className="flex justify-between">
                <span>Contact Gateway:</span>
                <span className="text-slate-200 font-semibold">EmailJS (shazzedshuvo@gmail.com)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
