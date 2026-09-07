const db = require('../database/connection');

module.exports = {
  async findById(id) {
    const session = await db('learning_sessions')
      .join('skills', 'learning_sessions.skill_id', 'skills.id')
      .join('users', 'learning_sessions.created_by', 'users.id')
      .leftJoin('swaps', 'learning_sessions.swap_id', 'swaps.id')
      .leftJoin('classes', 'learning_sessions.class_id', 'classes.id')
      .where({ 'learning_sessions.id': id })
      .select(
        'learning_sessions.*',
        'skills.name as skill_name',
        'users.name as creator_name',
        'users.username as creator_username'
      )
      .first();
    if (!session) return null;

    const participants = await db('session_participants')
      .join('users', 'session_participants.user_id', 'users.id')
      .where({ session_id: id })
      .select('session_participants.*', 'users.name as user_name', 'users.username');

    return { ...session, participants };
  },
};
