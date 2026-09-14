import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Re-hydrate auth state on page load by calling /api/auth/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setIsAdmin(!!data.isAdmin);
        if (!data.isAdmin) {
          localStorage.removeItem('admin-token');
        }
      } catch {
        setIsAdmin(false);
        localStorage.removeItem('admin-token');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    if (data.token) {
      localStorage.setItem('admin-token', data.token);
    }
    setIsAdmin(true);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('admin-token');
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
