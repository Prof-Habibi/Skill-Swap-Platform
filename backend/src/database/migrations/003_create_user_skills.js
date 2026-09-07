/**
 * Migration: Create user_skills join table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('user_skills', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('user_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.uuid('skill_id').notNullable().references('id').inTable('skillswap.skills').onDelete('CASCADE');
    table.enu('relationship_type', ['CAN_TEACH', 'WANTS_TO_LEARN']).notNullable();
    table.enu('proficiency_level', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).defaultTo('BEGINNER');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);

    table.unique(['user_id', 'skill_id', 'relationship_type']);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_user_skills_user ON skillswap.user_skills (user_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_user_skills_skill ON skillswap.user_skills (skill_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_user_skills_type ON skillswap.user_skills (user_id, relationship_type)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('user_skills');
};
