const classRepo = require('../repositories/class.repository');

module.exports = {
  async getClass(id) {
    return classRepo.findById(id);
  },

  async listClasses(query) {
    return classRepo.list(query);
  },
};
