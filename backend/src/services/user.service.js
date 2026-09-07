const userRepo = require('../repositories/user.repository');
const userSkillRepo = require('../repositories/user-skill.repository');

module.exports = {
  async getUser(id) {
    const user = await userRepo.findById(id);
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  },

  async getUserWithSkills(id) {
    const user = await userRepo.findById(id);
    if (!user) return null;
    const { password_hash, ...safe } = user;
    const skills = await userSkillRepo.findByUser(id);
    const canTeach = skills.filter((s) => s.relationship_type === 'CAN_TEACH');
    const wantsToLearn = skills.filter((s) => s.relationship_type === 'WANTS_TO_LEARN');
    return { ...safe, can_teach: canTeach, wants_to_learn: wantsToLearn };
  },

  async findMatches(userId) {
    return userSkillRepo.findPotentialTeachers(userId);
  },

  async findReciprocalMatches(userId) {
    return userSkillRepo.findReciprocalMatches(userId);
  },
};
