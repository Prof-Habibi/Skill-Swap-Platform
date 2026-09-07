const classService = require('../services/class.service');

module.exports = {
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const result = await classService.listClasses({ page, limit });
      res.json({ data: result.data, meta: { page: result.page, limit: result.limit, total: result.total } });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const cls = await classService.getClass(req.params.id);
      if (!cls) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Class not found', details: [] } });
      }
      res.json({ data: cls });
    } catch (err) {
      next(err);
    }
  },
};
