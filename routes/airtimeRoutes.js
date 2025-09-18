// src/routes/airtimeRoutes.js
const express = require('express');
const router = express.Router();
const airtimeController = require('../controllers/airtimeController');
const authenticated = require('../utils/protect');
const { testVTPass } = require('../controllers/controlair');
// const auth = require('../middleware/auth');

router.post('/buy', authenticated, airtimeController.buyAirtime);
router.post('/test', testVTPass);

module.exports = router;