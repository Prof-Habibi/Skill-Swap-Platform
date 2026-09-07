/**
 * Migration: Create swaps table in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('swaps', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('requester_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.uuid('recipient_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.uuid('requester_skill_id').notNullable().references('id').inTable('skillswap.skills').onDelete('CASCADE');
    table.uuid('recipient_skill_id').notNullable().references('id').inTable('skillswap.skills').onDelete('CASCADE');
    table.enu('status', ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED']).defaultTo('PENDING');
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_swaps_requester ON skillswap.swaps (requester_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_swaps_recipient ON skillswap.swaps (recipient_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_swaps_status ON skillswap.swaps (status)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('swaps');
};
