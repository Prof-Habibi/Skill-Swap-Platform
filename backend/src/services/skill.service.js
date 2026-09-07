const skillRepo = require('../repositories/skill.repository');

module.exports = {
  async listSkills(query) {
    return skillRepo.list(query);
  },

  async getSkill(id) {
    return skillRepo.findById(id);
  },
};
