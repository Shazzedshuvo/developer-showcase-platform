import axios from 'axios';

const getBaseUrl = () => {
  const apiUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (apiUrl) {
    return apiUrl.replace(/\/+$/, '');
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://developer-showcase-platform.onrender.com/api';
  }
  return '/api';
};

/**
 * Axios instance pre-configured for the Express API.
 * `withCredentials: true` is critical — it ensures the browser sends
 * the httpOnly cookie on every request.
 */
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// Attach Authorization header if token exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
