const db = require('../database/connection');

const TABLE = 'users';

module.exports = {
  async findById(id) {
    return db(TABLE).where({ id }).first();
  },

  async findByEmail(email) {
    return db(TABLE).where({ email }).first();
  },

  async findByUsername(username) {
    return db(TABLE).where({ username }).first();
  },

  async list({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [data, [{ count }]] = await Promise.all([
      db(TABLE).where({ status: 'ACTIVE' }).orderBy('created_at', 'desc').limit(limit).offset(offset),
      db(TABLE).where({ status: 'ACTIVE' }).count('id as count'),
    ]);
    return { data, total: parseInt(count, 10), page, limit };
  },
};
