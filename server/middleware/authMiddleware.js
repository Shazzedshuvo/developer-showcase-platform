const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Admin = require('../models/Admin');

/**
 * Middleware: protect
 * Verifies the JWT stored in the httpOnly cookie "token".
 * Attaches `req.adminId` and continues if valid; 401 otherwise.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Confirm admin still exists in DB
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      res.status(401);
      throw new Error('Not authorized — admin not found');
    }
    req.adminId = admin._id;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired token');
  }
});

module.exports = { protect };
