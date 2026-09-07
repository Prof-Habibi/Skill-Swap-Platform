/**
 * Migration: Create project_members table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('project_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('project_id').notNullable().references('id').inTable('skillswap.projects').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.enu('role', ['OWNER', 'MEMBER', 'CONTRIBUTOR']).defaultTo('MEMBER');
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    table.unique(['project_id', 'user_id']);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_pm_project ON skillswap.project_members (project_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_pm_user ON skillswap.project_members (user_id)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('project_members');
};
