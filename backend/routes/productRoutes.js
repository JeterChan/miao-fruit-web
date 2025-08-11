const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 產品相關路由
router.get('/', productController.getAllProducts);                    // GET /api/products
router.get('/:id', productController.getProduct);                    // GET /api/products/:id

module.exports = router;