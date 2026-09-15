import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const apiUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (apiUrl.startsWith('http')) {
    try {
      const parsed = new URL(apiUrl);
      return parsed.origin;
    } catch {
      return apiUrl.replace(/\/api\/?.*$/i, '').trim();
    }
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://developer-showcase-platform.onrender.com';
  }
  return 'http://localhost:5000';
};

// Singleton socket instance
export const socket = io(getSocketUrl(), {
  autoConnect: true,
  withCredentials: true,
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Helper to get or generate persistent visitor session ID
export const getVisitorSessionId = () => {
  let sessionId = localStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = 'client_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

// Helper to get or store visitor display info
export const getVisitorProfile = () => {
  try {
    const data = localStorage.getItem('chat_visitor_profile');
    return data ? JSON.parse(data) : { name: '', email: '' };
  } catch {
    return { name: '', email: '' };
  }
};

export const setVisitorProfile = (profile) => {
  try {
    localStorage.setItem('chat_visitor_profile', JSON.stringify(profile));
  } catch (err) {
    console.error(err);
  }
};
