/**
 * Migration: Create projects table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('projects', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title', 200).notNullable();
    table.text('description').defaultTo('');
    table.uuid('owner_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.enu('status', ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).defaultTo('DRAFT');
    table.enu('visibility', ['PUBLIC', 'PRIVATE']).defaultTo('PUBLIC');
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_projects_owner ON skillswap.projects (owner_id)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('projects');
};
