const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Customer endpoints
router.post('/', authMiddleware, orderController.createOrder);
router.get('/my', authMiddleware, orderController.getMyOrders);

// Admin endpoints
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllAdminOrders);
router.patch('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);

module.exports = router;