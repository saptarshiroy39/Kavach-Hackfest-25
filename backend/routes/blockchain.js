const express = require('express');
const BlockchainService = require('../services/blockchain');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   GET /api/blockchain/identity
// @desc    Get user's digital identity from blockchain
// @access  Private
router.get('/identity', async (req, res, next) => {
  try {
    const identity = await BlockchainService.getDigitalIdentity(req.user.id);
    
    res.status(200).json({
      success: true,
      data: identity
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/blockchain/verify/:hash
// @desc    Verify a blockchain transaction
// @access  Private
router.get('/verify/:hash', async (req, res, next) => {
  try {
    const isVerified = await BlockchainService.verifyTransaction(req.params.hash);
    
    res.status(200).json({
      success: true,
      verified: isVerified
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
