const mongoose = require('mongoose');

const SecurityEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventType: {
    type: String,
    enum: ['login_attempt', 'phishing_detected', 'suspicious_activity', 'password_changed', 'two_factor_enabled', 'two_factor_disabled'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  blockchainHash: {
    type: String
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for fast lookup by user
SecurityEventSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SecurityEvent', SecurityEventSchema);
