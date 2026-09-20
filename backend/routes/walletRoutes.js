const express = require('express');
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', authMiddleware, walletController.getWalletDetails);
router.post('/topup', authMiddleware, walletController.addMockFunds);

module.exports = router;