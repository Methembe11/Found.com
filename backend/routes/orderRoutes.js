const express = require('express');
const router = express.Router();
const { createOrder, getOrderById, getOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/:id/status', getOrderStatus);

module.exports = router;
