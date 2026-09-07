/**
 * Migration: Create users table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name', 100).notNullable();
    table.string('username', 50).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.text('bio').defaultTo('');
    table.string('avatar_url', 500).defaultTo('');
    table.string('location', 100).defaultTo('');
    table.enu('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']).defaultTo('ACTIVE');
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_users_email ON skillswap.users (email)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_users_username ON skillswap.users (username)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('users');
};
