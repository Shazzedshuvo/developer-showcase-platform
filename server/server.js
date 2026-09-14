require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('./config/cloudinary'); // Initialize Cloudinary SDK

// Route modules
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const settingRoutes = require('./routes/settingRoutes');
const teamRoutes = require('./routes/teamRoutes');

// Middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Bootstrap ——————————————————————————————————————
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    // Allow requests from Vite dev server; update for production
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Required for httpOnly cookie forwarding
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/team', teamRoutes);

// Root & Health check
app.get('/', (req, res) =>
  res.json({
    message: '🚀 Portfolio Showcase API is running',
    frontend: process.env.CLIENT_URL || 'http://localhost:5173',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      projects: '/api/projects',
      reviews: '/api/reviews',
      health: '/api/health',
    },
  })
);
app.get('/api', (req, res) =>
  res.json({ status: 'ok', message: 'API root' })
);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
