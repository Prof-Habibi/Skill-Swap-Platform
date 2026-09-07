const path = require('path');
const fs = require('fs');

// Load secrets
const secretsPath = path.join(__dirname, '.secrets', 'db.env');
if (fs.existsSync(secretsPath)) {
  const content = fs.readFileSync(secretsPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
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
  migrations: {
    directory: path.join(__dirname, 'src', 'database', 'migrations'),
    tableName: 'knex_migrations',
    schemaName: 'skillswap',
  },
  seeds: {
    directory: path.join(__dirname, 'src', 'database', 'seed'),
  },
};
