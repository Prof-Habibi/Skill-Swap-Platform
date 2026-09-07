const { Router } = require('express');
const projectController = require('../controllers/project.controller');
const validate = require('../middleware/validate');
const { createProjectSchema } = require('../schemas');

const router = Router();
router.get('/', projectController.list);
router.get('/:id', projectController.getById);
router.post('/', validate(createProjectSchema), projectController.create);

module.exports = router;
