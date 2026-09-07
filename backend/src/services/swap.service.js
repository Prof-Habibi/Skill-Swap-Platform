const swapRepo = require('../repositories/swap.repository');
const userRepo = require('../repositories/user.repository');
const skillRepo = require('../repositories/skill.repository');

module.exports = {
  async createSwap(data) {
    // Validate requester exists
    const requester = await userRepo.findById(data.requester_id);
    if (!requester) {
      const err = new Error('Requester not found');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    // Validate recipient exists
    const recipient = await userRepo.findById(data.recipient_id);
    if (!recipient) {
      const err = new Error('Recipient not found');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    // Validate skills exist
    const reqSkill = await skillRepo.findById(data.requester_skill_id);
    if (!reqSkill) {
      const err = new Error('Requester skill not found');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    const recSkill = await skillRepo.findById(data.recipient_skill_id);
    if (!recSkill) {
      const err = new Error('Recipient skill not found');
      err.status = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }

    return swapRepo.create(data);
  },

  async getSwap(id) {
    return swapRepo.findById(id);
  },
};
