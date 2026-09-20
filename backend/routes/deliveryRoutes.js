const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
router.get('/today', authMiddleware, roleGuard('delivery_partner', 'admin'), deliveryController.getPartnerManifest);
router.patch('/:id/status', authMiddleware, roleGuard('delivery_partner', 'admin'), deliveryController.updateDeliveryStatus);

module.exports = router;