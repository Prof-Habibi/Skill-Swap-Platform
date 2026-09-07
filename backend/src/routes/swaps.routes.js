const { Router } = require('express');
const swapController = require('../controllers/swap.controller');
const validate = require('../middleware/validate');
const { createSwapSchema } = require('../schemas');

const router = Router();
router.post('/', validate(createSwapSchema), swapController.create);
router.get('/:id', swapController.getById);

module.exports = router;
