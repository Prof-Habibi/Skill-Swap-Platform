const db = require('../database/connection');

const TABLE = 'user_skills';

module.exports = {
  async findByUser(userId) {
    return db(TABLE)
      .join('skills', 'user_skills.skill_id', 'skills.id')
      .where({ 'user_skills.user_id': userId, 'user_skills.is_active': true })
      .select(
        'user_skills.id',
        'user_skills.relationship_type',
        'user_skills.proficiency_level',
        'skills.id as skill_id',
        'skills.name as skill_name',
        'skills.slug as skill_slug',
        'skills.category as skill_category'
      );
  },

  /**
   * Find users who CAN_TEACH a skill that the given user WANTS_TO_LEARN.
   */
  async findPotentialTeachers(userId) {
    const wantedSkills = db(TABLE)
      .where({ user_id: userId, relationship_type: 'WANTS_TO_LEARN', is_active: true })
      .select('skill_id');

    return db(TABLE)
      .join('users', 'user_skills.user_id', 'users.id')
      .join('skills', 'user_skills.skill_id', 'skills.id')
      .where({ 'user_skills.relationship_type': 'CAN_TEACH', 'user_skills.is_active': true })
      .whereNot({ 'user_skills.user_id': userId })
      .whereIn('user_skills.skill_id', wantedSkills)
      .select(
        'users.id as user_id',
        'users.name as user_name',
        'users.username',
        'skills.id as skill_id',
        'skills.name as skill_name',
        'user_skills.proficiency_level'
      );
  },

  /**
   * Find reciprocal swap matches:
   * User A wants X and can teach Y
   * User B wants Y and can teach X
   */
  async findReciprocalMatches(userId) {
    const query = `
      SELECT
        b_teach.user_id AS match_user_id,
        u.name AS match_user_name,
        u.username AS match_username,
        s_they_teach.id AS they_teach_skill_id,
        s_they_teach.name AS they_teach_skill_name,
        s_they_want.id AS they_want_skill_id,
        s_they_want.name AS they_want_skill_name
      FROM user_skills a_want
      JOIN user_skills b_teach
        ON b_teach.skill_id = a_want.skill_id
        AND b_teach.relationship_type = 'CAN_TEACH'
        AND b_teach.is_active = true
        AND b_teach.user_id != a_want.user_id
      JOIN user_skills a_teach
        ON a_teach.user_id = a_want.user_id
        AND a_teach.relationship_type = 'CAN_TEACH'
        AND a_teach.is_active = true
      JOIN user_skills b_want
        ON b_want.user_id = b_teach.user_id
        AND b_want.skill_id = a_teach.skill_id
        AND b_want.relationship_type = 'WANTS_TO_LEARN'
        AND b_want.is_active = true
      JOIN users u ON u.id = b_teach.user_id
      JOIN skills s_they_teach ON s_they_teach.id = b_teach.skill_id
      JOIN skills s_they_want ON s_they_want.id = b_want.skill_id
      WHERE a_want.user_id = ?
        AND a_want.relationship_type = 'WANTS_TO_LEARN'
        AND a_want.is_active = true
    `;
    const result = await db.raw(query, [userId]);
    return result.rows;
  },
};
