const config = require('./index');

const databaseConfig = {
  client: 'pg',
  connection: {
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../database/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../database/seed',
  },
};

module.exports = databaseConfig;
