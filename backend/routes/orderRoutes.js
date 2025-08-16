const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { adminAuth } = require('../middleware/adminAuth');

// 訂單相關路由
router.post('/submit', orderController.submitOrder);           // POST /api/orders/submit
router.get('/status', orderController.getOrderStatus);         // GET /api/orders/status?orderNumber=xxx&email=xxx
router.get('/:orderNumber', orderController.getOrderDetails);  // GET /api/orders/:orderNumber?email=xxx

// 管理員路由 (需要管理員驗證)
router.get('/admin/all', adminAuth, orderController.getAllOrders);        // GET /api/orders/admin/all
router.put('/admin/:orderNumber/status', adminAuth, orderController.updateOrderStatus); // PUT /api/orders/admin/:orderNumber/status

module.exports = router;