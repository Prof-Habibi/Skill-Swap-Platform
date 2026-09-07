const { Router } = require('express');
const sessionController = require('../controllers/learning-session.controller');

const router = Router();
router.get('/:id', sessionController.getById);

module.exports = router;
