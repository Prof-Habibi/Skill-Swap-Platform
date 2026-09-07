const { Router } = require('express');
const classController = require('../controllers/class.controller');

const router = Router();
router.get('/', classController.list);
router.get('/:id', classController.getById);

module.exports = router;
