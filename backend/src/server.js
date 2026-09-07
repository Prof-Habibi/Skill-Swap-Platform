const config = require('./config');
const app = require('./app');
const db = require('./database/connection');

async function start() {
  // Test database connection
  try {
    await db.raw('SELECT 1');
    console.log('[DB] Connected to PostgreSQL');
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[SERVER] SkillSwap API running on port ${config.port}`);
    console.log(`[SERVER] Environment: ${config.environment}`);
    console.log(`[SERVER] Health: http://localhost:${config.port}/api/v1/health`);
  });
}

start();
