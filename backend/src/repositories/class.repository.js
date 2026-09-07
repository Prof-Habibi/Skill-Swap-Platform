const db = require('../database/connection');

module.exports = {
  async findById(id) {
    const cls = await db('classes')
      .join('skills', 'classes.skill_id', 'skills.id')
      .join('users', 'classes.owner_id', 'users.id')
      .where({ 'classes.id': id })
      .select('classes.*', 'skills.name as skill_name', 'skills.slug as skill_slug', 'users.name as owner_name', 'users.username as owner_username')
      .first();
    if (!cls) return null;

    const members = await db('class_members')
      .join('users', 'class_members.user_id', 'users.id')
      .where({ class_id: id })
      .select('class_members.*', 'users.name as user_name', 'users.username');

    return { ...cls, members };
  },

  async list({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [data, [{ count }]] = await Promise.all([
      db('classes')
        .join('skills', 'classes.skill_id', 'skills.id')
        .join('users', 'classes.owner_id', 'users.id')
        .select('classes.*', 'skills.name as skill_name', 'users.name as owner_name')
        .orderBy('classes.created_at', 'desc')
        .limit(limit).offset(offset),
      db('classes').count('id as count'),
    ]);
    return { data, total: parseInt(count, 10), page, limit };
  },
};
