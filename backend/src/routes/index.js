const { Router } = require('express');

const healthRoutes = require('./health.routes');
const usersRoutes = require('./users.routes');
const skillsRoutes = require('./skills.routes');
const swapsRoutes = require('./swaps.routes');
const projectsRoutes = require('./projects.routes');
const classesRoutes = require('./classes.routes');
const sessionsRoutes = require('./learning-sessions.routes');

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', usersRoutes);
router.use('/skills', skillsRoutes);
router.use('/swaps', swapsRoutes);
router.use('/projects', projectsRoutes);
router.use('/classes', classesRoutes);
router.use('/learning-sessions', sessionsRoutes);

module.exports = router;
