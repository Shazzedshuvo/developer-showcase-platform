/**
 * notFound
 * Catches all requests that didn't match any route and
 * converts them into a proper 404 Error for the error handler below.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler
 * Global Express error handler.
 * Returns a JSON error response; hides stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes Express sets 200 even on thrown errors — normalize it
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
