const { Router } = require('express');
const skillController = require('../controllers/skill.controller');

const router = Router();
router.get('/', skillController.list);
router.get('/:id', skillController.getById);

module.exports = router;
