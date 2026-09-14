import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PublicPortfolio from './pages/PublicPortfolio';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Projects from './pages/admin/Projects';
import Reviews from './pages/admin/Reviews';
import Settings from './pages/admin/Settings';

/**
 * ProtectedRoute — redirects unauthenticated users to /admin/login
 */
const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <Routes>
      {/* Public Portfolio */}
      <Route path="/" element={<PublicPortfolio />} />

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
        <Route path="categories" element={<Categories />} />
        <Route path="projects" element={<Projects />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
