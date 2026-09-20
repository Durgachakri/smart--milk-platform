const express = require('express');
const subscriptionController = require('../controllers/subscriptionController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();
router.post('/', authMiddleware, subscriptionController.createSubscription);
router.get('/my', authMiddleware, subscriptionController.getUserSubscriptions);
router.patch('/:id/status', authMiddleware, subscriptionController.toggleStatus);
router.post('/:id/exception', authMiddleware, subscriptionController.setException);
router.get('/:id/exceptions', authMiddleware, subscriptionController.getExceptions);
router.delete('/:id', authMiddleware, subscriptionController.deleteSubscription);

module.exports = router;