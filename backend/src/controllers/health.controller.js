const db = require('../database/connection');

module.exports = {
  async check(req, res) {
    try {
      await db.raw('SELECT 1');
      res.json({ data: { status: 'ok', database: 'connected', timestamp: new Date().toISOString() } });
    } catch (err) {
      res.status(503).json({ data: { status: 'error', database: 'disconnected', timestamp: new Date().toISOString() } });
    }
  },
};
