/**
 * Migration 000: Create the skillswap schema.
 * This MUST run first. All subsequent migrations operate within this schema.
 * We never touch the pokevault schema.
 */
exports.up = async function (knex) {
  await knex.raw('CREATE SCHEMA IF NOT EXISTS skillswap');
  await knex.raw('SET search_path TO skillswap, public');
};

exports.down = async function (knex) {
  await knex.raw('DROP SCHEMA IF EXISTS skillswap CASCADE');
};
