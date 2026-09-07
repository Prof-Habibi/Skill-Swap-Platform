const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();
router.get('/:id', userController.getById);
router.get('/:id/skills', userController.getSkills);
router.get('/:id/matches', userController.getMatches);

module.exports = router;
