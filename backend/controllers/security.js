const SecurityEvent = require('../models/SecurityEvent');
const BlockchainService = require('../services/blockchain');

// @desc    Log a security event
// @route   POST /api/security/events
// @access  Private
exports.logSecurityEvent = async (req, res, next) => {
  try {
    const { eventType, description, riskLevel } = req.body;
    
    // Create security event
    const securityEvent = await SecurityEvent.create({
      user: req.user.id,
      eventType,
      description,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      riskLevel: riskLevel || 'medium'
    });

    // Log to blockchain if high risk
    if (riskLevel === 'high' || riskLevel === 'critical') {
      try {
        const blockchainHash = await BlockchainService.logSecurityEvent({
          userId: req.user.id,
          eventId: securityEvent._id,
          eventType,
          timestamp: securityEvent.createdAt,
          riskLevel
        });
        
        // Update event with blockchain hash
        securityEvent.blockchainHash = blockchainHash;
        securityEvent.verified = true;
        await securityEvent.save();
      } catch (error) {
        console.error('Blockchain logging failed:', error);
      }
    }

    res.status(201).json({
      success: true,
      data: securityEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all security events for current user
// @route   GET /api/security/events
// @access  Private
exports.getMySecurityEvents = async (req, res, next) => {
  try {
    const events = await SecurityEvent.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze user security
// @route   GET /api/security/analysis
// @access  Private
exports.analyzeUserSecurity = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Start with base score
    let securityScore = 50;
    
    // Check for 2FA
    if (user.twoFactorEnabled) {
      securityScore += 30;
    }
    
    // Check password strength (this would be more complex in production)
    securityScore += 10;
    
    // Check for recent suspicious activities
    const recentEvents = await SecurityEvent.find({
      user: user._id,
      eventType: 'suspicious_activity',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    if (recentEvents.length > 0) {
      securityScore -= recentEvents.length * 5;
    }
    
    // Ensure score is within limits
    securityScore = Math.min(100, Math.max(0, securityScore));
    
    // Update user security score
    user.securityScore = securityScore;
    await user.save();
    
    res.status(200).json({
      success: true,
      data: {
        securityScore,
        twoFactorEnabled: user.twoFactorEnabled,
        recentSuspiciousActivities: recentEvents.length,
        recommendations: [
          !user.twoFactorEnabled ? 'Enable two-factor authentication' : null,
          'Regularly update your password',
          'Check your login history frequently'
        ].filter(Boolean)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check for phishing in provided content
// @route   POST /api/security/check-phishing
// @access  Private
exports.checkPhishing = async (req, res, next) => {
  try {
    const { content, contentType } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide content to check'
      });
    }
    
    // This would use the AI model to check for phishing
    // For the prototype, we'll use a simple detection
    const phishingPatterns = [
      'urgent action required',
      'your account will be suspended',
      'verify your information',
      'click here to claim',
      'lottery winner',
      'you have won',
      'password expired',
      'unusual activity'
    ];
    
    let isPhishing = false;
    let matchedPatterns = [];
    
    // Simple check for suspicious patterns
    const lowercaseContent = content.toLowerCase();
    phishingPatterns.forEach(pattern => {
      if (lowercaseContent.includes(pattern.toLowerCase())) {
        isPhishing = true;
        matchedPatterns.push(pattern);
      }
    });
    
    // If phishing detected, log security event
    if (isPhishing) {
      await SecurityEvent.create({
        user: req.user.id,
        eventType: 'phishing_detected',
        description: `Potential phishing detected in ${contentType || 'content'}: ${matchedPatterns.join(', ')}`,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        riskLevel: 'high'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        isPhishing,
        confidence: isPhishing ? 0.85 : 0.1,
        matchedPatterns
      }
    });
  } catch (error) {
    next(error);
  }
};
