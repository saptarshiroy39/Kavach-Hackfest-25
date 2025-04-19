const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  forgotPassword,
  setupTwoFactor,
  enableTwoFactor,
  verifyTwoFactor
} = require('../controllers/auth');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verifyTwoFactor);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/setup-2fa', protect, setupTwoFactor);
router.post('/enable-2fa', protect, enableTwoFactor);

module.exports = router;
