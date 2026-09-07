const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/error-handler');
const notFound = require('./middleware/not-found');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.frontendOrigin, credentials: true }));

// Parsing
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/v1', apiRoutes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
