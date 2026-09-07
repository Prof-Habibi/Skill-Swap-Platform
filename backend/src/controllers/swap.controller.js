const swapService = require('../services/swap.service');

module.exports = {
  async create(req, res, next) {
    try {
      const swap = await swapService.createSwap(req.validated);
      res.status(201).json({ data: swap });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const swap = await swapService.getSwap(req.params.id);
      if (!swap) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Swap not found', details: [] } });
      }
      res.json({ data: swap });
    } catch (err) {
      next(err);
    }
  },
};
