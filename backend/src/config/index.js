const path = require('path');
const fs = require('fs');

// Load secrets from .secrets/db.env if it exists
const secretsPath = path.join(__dirname, '..', '..', '.secrets', 'db.env');
if (fs.existsSync(secretsPath)) {
  const content = fs.readFileSync(secretsPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  environment: process.env.ENVIRONMENT || 'development',
  isProduction: (process.env.ENVIRONMENT || 'development') === 'production',
};

module.exports = config;
