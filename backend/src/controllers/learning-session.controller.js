const sessionService = require('../services/learning-session.service');

module.exports = {
  async getById(req, res, next) {
    try {
      const session = await sessionService.getSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Learning session not found', details: [] } });
      }
      res.json({ data: session });
    } catch (err) {
      next(err);
    }
  },
};
