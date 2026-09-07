const sessionRepo = require('../repositories/learning-session.repository');

module.exports = {
  async getSession(id) {
    return sessionRepo.findById(id);
  },
};
