const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticated = require('../utils/protect');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/profile', authController.profile);
router.get('/me', authenticated, authController.getMe );
router.get('/like', authenticated, (req, res) => {
  res.json({ message: 'This is protected!', user: req.user });
});


module.exports = router;
