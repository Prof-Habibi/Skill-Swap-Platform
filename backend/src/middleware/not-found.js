/**
 * 404 handler for unmatched routes.
 */
function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
      details: [],
    },
  });
}

module.exports = notFound;
