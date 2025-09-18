// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const authenticated = require('../utils/protect');
// const auth = require('../middleware/auth');

router.get('/plans/:network', dataController.getDataPlans);
router.post('/buy', authenticated, /* auth, */ dataController.buyData);

module.exports = router;