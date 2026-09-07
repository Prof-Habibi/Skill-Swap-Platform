/**
 * Migration: Create classes and class_members tables in skillswap schema
 */
exports.up = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');

  await knex.schema.createTable('classes', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title', 200).notNullable();
    table.text('description').defaultTo('');
    table.uuid('skill_id').notNullable().references('id').inTable('skillswap.skills').onDelete('CASCADE');
    table.uuid('owner_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.integer('max_participants').defaultTo(20);
    table.enu('status', ['DRAFT', 'OPEN', 'FULL', 'ACTIVE', 'COMPLETED', 'CANCELLED']).defaultTo('DRAFT');
    table.timestamp('start_at').nullable();
    table.timestamp('end_at').nullable();
    table.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_classes_owner ON skillswap.classes (owner_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_classes_skill ON skillswap.classes (skill_id)');

  await knex.schema.createTable('class_members', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('class_id').notNullable().references('id').inTable('skillswap.classes').onDelete('CASCADE');
    table.uuid('user_id').notNullable().references('id').inTable('skillswap.users').onDelete('CASCADE');
    table.enu('role', ['INSTRUCTOR', 'LEARNER']).notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());

    table.unique(['class_id', 'user_id']);
  });

  await knex.raw('CREATE INDEX IF NOT EXISTS idx_cm_class ON skillswap.class_members (class_id)');
  await knex.raw('CREATE INDEX IF NOT EXISTS idx_cm_user ON skillswap.class_members (user_id)');
};

exports.down = async function (knex) {
  await knex.raw('SET search_path TO skillswap, public');
  await knex.schema.dropTableIfExists('class_members');
  await knex.schema.dropTableIfExists('classes');
};
