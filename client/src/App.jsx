import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PublicPortfolio from './pages/PublicPortfolio';
import TeamPage from './pages/TeamPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminChat from './pages/admin/AdminChat';
import ClientLeads from './pages/admin/ClientLeads';
import TeamManager from './pages/admin/TeamManager';
import Categories from './pages/admin/Categories';
import Projects from './pages/admin/Projects';
import Reviews from './pages/admin/Reviews';
import Settings from './pages/admin/Settings';
import LiveChatWidget from './components/chat/LiveChatWidget';

/**
 * ProtectedRoute — redirects unauthenticated users to /admin/login
 */
const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        {/* Public Portfolio */}
        <Route path="/" element={<PublicPortfolio />} />

        {/* Public Team Page */}
        <Route path="/team" element={<TeamPage />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<AdminChat />} />
          <Route path="leads" element={<ClientLeads />} />
          <Route path="team" element={<TeamManager />} />
          <Route path="categories" element={<Categories />} />
          <Route path="projects" element={<Projects />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Floating Live Chat for Visitors (Only visible on public pages) */}
      {!isAdminRoute && <LiveChatWidget />}
    </>
  );
}
