const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Helper: generates a signed JWT and sets it as an httpOnly cookie.
 */
const sendTokenCookie = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Authenticate admin — returns httpOnly JWT cookie & token payload
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Username and password are required');
  }

  const admin = await Admin.findOne({ username: username.toLowerCase() });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const token = sendTokenCookie(res, admin._id);

  res.json({
    message: 'Logged in successfully',
    username: admin.username,
    token,
    isAdmin: true,
  });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 * @desc    Clear the JWT cookie
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
});

/**
 * @route   GET /api/auth/me
 * @access  Public (uses cookie or Bearer token if present)
 * @desc    Returns whether the current request is authenticated.
 */
const getMe = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) return res.json({ isAdmin: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.json({ isAdmin: false });
    res.json({ isAdmin: true, username: admin.username });
  } catch {
    res.json({ isAdmin: false });
  }
});

module.exports = { login, logout, getMe };
