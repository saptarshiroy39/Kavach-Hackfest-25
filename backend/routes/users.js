const express = require('express');
const { 
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserDashboard
} = require('../controllers/users');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);
router.get('/dashboard', getUserDashboard);

module.exports = router;
