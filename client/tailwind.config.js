/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Toggle via 'dark' class on <html>
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom zinc/slate dark palette
        bg: {
          primary: '#09090b',
          secondary: '#0f172a',
          elevated: '#18181b',
          card: '#1c1c1f',
        },
        border: {
          subtle: '#27272a',
          DEFAULT: '#3f3f46',
        },
        accent: {
          DEFAULT: '#6366f1',   // Indigo
          hover: '#818cf8',
          muted: '#4f46e5',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
