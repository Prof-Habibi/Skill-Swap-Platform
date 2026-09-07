const db = require('../database/connection');

const TABLE = 'skills';

module.exports = {
  async findById(id) {
    return db(TABLE).where({ id }).first();
  },

  async findBySlug(slug) {
    return db(TABLE).where({ slug }).first();
  },

  async list({ page = 1, limit = 20, category } = {}) {
    const offset = (page - 1) * limit;
    let query = db(TABLE).where({ status: 'ACTIVE' });
    let countQuery = db(TABLE).where({ status: 'ACTIVE' });

    if (category) {
      query = query.andWhere({ category });
      countQuery = countQuery.andWhere({ category });
    }

    const [data, [{ count }]] = await Promise.all([
      query.orderBy('name', 'asc').limit(limit).offset(offset),
      countQuery.count('id as count'),
    ]);
    return { data, total: parseInt(count, 10), page, limit };
  },
};
