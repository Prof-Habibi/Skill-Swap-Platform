/**
 * Migration: Create learning_sessions and session_participants in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('learning_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title', 200).notNullable();
    table.text('description').defaultTo('');
    table.uuid('skill_id').notNullable().references('id').inTable('skillswap.skills').onDelete('CASCADE');
    table.uuid('swap_id').nullable().references('id').inTable('skillswap.swaps').onDelete('SET NULL');
    table.uuid('class_id').nullable().references('id').inTable('skillswap.classes').onDelete('SET NULL');
    table.uuid('created_by').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.timestamp('start_time').nullable();
    table.timestamp('end_time').nullable();
    table.enu('status', ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).defaultTo('SCHEDULED');
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_ls_skill ON skillswap.learning_sessions (skill_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_ls_swap ON skillswap.learning_sessions (swap_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_ls_class ON skillswap.learning_sessions (class_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_ls_created_by ON skillswap.learning_sessions (created_by)');

  await knex.schema.createTable('session_participants', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('session_id').notNullable().references('id').inTable('skillswap.learning_sessions').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.enu('role', ['TEACHER', 'LEARNER']).notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    table.unique(['session_id', 'user_id']);
  });
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('session_participants');
  await knex.schema.dropTableIfExists('learning_sessions');
};
