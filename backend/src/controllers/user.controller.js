const userService = require('../services/user.service');

module.exports = {
  async getById(req, res, next) {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found', details: [] } });
      }
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  },

  async getSkills(req, res, next) {
    try {
      const user = await userService.getUserWithSkills(req.params.id);
      if (!user) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found', details: [] } });
      }
      res.json({ data: { can_teach: user.can_teach, wants_to_learn: user.wants_to_learn } });
    } catch (err) {
      next(err);
    }
  },

  async getMatches(req, res, next) {
    try {
      const matches = await userService.findReciprocalMatches(req.params.id);
      res.json({ data: matches });
    } catch (err) {
      next(err);
    }
  },
};
