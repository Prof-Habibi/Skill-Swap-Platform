const skillService = require('../services/skill.service');

module.exports = {
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const category = req.query.category || undefined;
      const result = await skillService.listSkills({ page, limit, category });
      res.json({ data: result.data, meta: { page: result.page, limit: result.limit, total: result.total } });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const skill = await skillService.getSkill(req.params.id);
      if (!skill) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Skill not found', details: [] } });
      }
      res.json({ data: skill });
    } catch (err) {
      next(err);
    }
  },
};
