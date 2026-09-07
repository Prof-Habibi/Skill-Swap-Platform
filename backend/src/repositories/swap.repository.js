const db = require('../database/connection');

const TABLE = 'swaps';

module.exports = {
  async findById(id) {
    return db(TABLE)
      .join('users as requester', 'swaps.requester_id', 'requester.id')
      .join('users as recipient', 'swaps.recipient_id', 'recipient.id')
      .join('skills as req_skill', 'swaps.requester_skill_id', 'req_skill.id')
      .join('skills as rec_skill', 'swaps.recipient_skill_id', 'rec_skill.id')
      .where({ 'swaps.id': id })
      .select(
        'swaps.*',
        'requester.name as requester_name',
        'requester.username as requester_username',
        'recipient.name as recipient_name',
        'recipient.username as recipient_username',
        'req_skill.name as requester_skill_name',
        'rec_skill.name as recipient_skill_name'
      )
      .first();
  },

  async create(data) {
    const [swap] = await db(TABLE).insert(data).returning('*');
    return swap;
  },

  async updateStatus(id, status) {
    const [swap] = await db(TABLE).where({ id }).update({ status, updated_at: db.fn.now() }).returning('*');
    return swap;
  },

  async findByUser(userId, { page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const baseQuery = db(TABLE).where('requester_id', userId).orWhere('recipient_id', userId);
    const [data, [{ count }]] = await Promise.all([
      baseQuery.clone().orderBy('created_at', 'desc').limit(limit).offset(offset),
      baseQuery.clone().count('id as count'),
    ]);
    return { data, total: parseInt(count, 10), page, limit };
  },
};
