const express = require('express');
const { 
  logSecurityEvent,
  getMySecurityEvents,
  analyzeUserSecurity,
  checkPhishing
} = require('../controllers/security');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/events')
  .post(logSecurityEvent)
  .get(getMySecurityEvents);

router.get('/analysis', analyzeUserSecurity);
router.post('/check-phishing', checkPhishing);

module.exports = router;
