const projectService = require('../services/project.service');

module.exports = {
  async list(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
      const result = await projectService.listProjects({ page, limit });
      res.json({ data: result.data, meta: { page: result.page, limit: result.limit, total: result.total } });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const project = await projectService.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found', details: [] } });
      }
      res.json({ data: project });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const project = await projectService.createProject(req.validated);
      res.status(201).json({ data: project });
    } catch (err) {
      next(err);
    }
  },
};
