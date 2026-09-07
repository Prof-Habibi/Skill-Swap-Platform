/**
 * Migration: Create skills table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('skills', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name', 100).notNullable();
    table.string('slug', 120).notNullable().unique();
    table.text('description').defaultTo('');
    table.string('category', 50).notNullable();
    table.enu('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_skills_slug ON skillswap.skills (slug)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_skills_category ON skillswap.skills (category)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('skills');
};
