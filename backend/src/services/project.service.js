const projectRepo = require('../repositories/project.repository');
const userRepo = require('../repositories/user.repository');

module.exports = {
  async createProject(data) {
    const owner = await userRepo.findById(data.owner_id);
    if (!owner) {
      const err = new Error('Owner not found');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const project = await projectRepo.create(data);
    // Auto-add owner as OWNER member
    await projectRepo.addMember(project.id, data.owner_id, 'OWNER');
    return projectRepo.findById(project.id);
  },

  async getProject(id) {
    return projectRepo.findById(id);
  },

  async listProjects(query) {
    return projectRepo.list(query);
  },
};
