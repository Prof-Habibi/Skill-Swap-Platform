/**
 * Zod validation middleware factory.
 * Usage: validate(schema) in a route to validate req.body
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request validation failed',
          details,
        },
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = validate;
