// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
// const auth = require('../middleware/auth');

router.get('/history', /* auth, */ transactionController.getTransactionHistory);

module.exports = router;