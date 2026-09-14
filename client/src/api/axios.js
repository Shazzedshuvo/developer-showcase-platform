import axios from 'axios';

/**
 * Axios instance pre-configured for the Express API.
 * `withCredentials: true` is critical — it ensures the browser sends
 * the httpOnly cookie on every request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
