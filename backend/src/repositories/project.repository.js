const db = require('../database/connection');

module.exports = {
  async findById(id) {
    const project = await db('projects')
      .join('users', 'projects.owner_id', 'users.id')
      .where({ 'projects.id': id })
      .select('projects.*', 'users.name as owner_name', 'users.username as owner_username')
      .first();
    if (!project) return null;

    const members = await db('project_members')
      .join('users', 'project_members.user_id', 'users.id')
      .where({ project_id: id })
      .select('project_members.*', 'users.name as user_name', 'users.username');

    return { ...project, members };
  },

  async create(data) {
    const [project] = await db('projects').insert(data).returning('*');
    return project;
  },

  async list({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [data, [{ count }]] = await Promise.all([
      db('projects')
        .where({ visibility: 'PUBLIC' })
        .join('users', 'projects.owner_id', 'users.id')
        .select('projects.*', 'users.name as owner_name', 'users.username as owner_username')
        .orderBy('projects.created_at', 'desc')
        .limit(limit).offset(offset),
      db('projects').where({ visibility: 'PUBLIC' }).count('id as count'),
    ]);
    return { data, total: parseInt(count, 10), page, limit };
  },

  async addMember(projectId, userId, role = 'MEMBER') {
    const [member] = await db('project_members').insert({ project_id: projectId, user_id: userId, role }).returning('*');
    return member;
  },
};
