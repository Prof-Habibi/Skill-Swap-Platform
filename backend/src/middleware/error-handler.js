/**
 * Global error handler — consistent error response format per §19.
 * Never exposes stack traces in production.
 */
function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = status === 500 && process.env.ENVIRONMENT === 'production'
    ? 'An unexpected error occurred'
    : err.message || 'An unexpected error occurred';

  if (status === 500) {
    console.error('[ERROR]', err);
  }

  res.status(status).json({
    error: {
      code,
      message,
      details: err.details || [],
    },
  });
}

module.exports = errorHandler;
