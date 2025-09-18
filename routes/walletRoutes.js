const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticated = require('../utils/protect');

// const auth = require('../middleware/auth'); // Uncomment if using auth

router.post('/fund', authenticated, walletController.initializeFundWallet);
router.post('/verify', authenticated, walletController.verifyAndCreditWallet);
router.get('/verify', authenticated, walletController.verifyAndCreditWallet);
router.get('/balance', authenticated, walletController.getWalletBalance);
router.get('/transactions', authenticated, walletController.getTransactionHistory);
router.post('/webhook/paystack', walletController.handlePaystackWebhook); // No auth needed
router.post('/simulate-payment', authenticated, walletController.simulatePaymentSuccess);

module.exports = router;