const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 訂單相關路由
router.post('/submit', orderController.submitOrder);           // POST /api/orders/submit
router.get('/status', orderController.getOrderStatus);         // GET /api/orders/status?orderNumber=xxx&email=xxx
router.get('/:orderNumber', orderController.getOrderDetails);  // GET /api/orders/:orderNumber?email=xxx

module.exports = router;