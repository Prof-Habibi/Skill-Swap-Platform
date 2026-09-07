const knex = require('knex');
const config = require('../config');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 30000,
    afterCreate: (conn, done) => {
      conn.query('SET search_path TO skillswap, public;', (err) => {
        done(err, conn);
      });
    },
  },
  searchPath: ['skillswap', 'public'],
});

module.exports = db;
