const User = require('../models/User');
const SecurityEvent = require('../models/SecurityEvent');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        securityScore: user.securityScore,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        securityScore: user.securityScore,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Please provide current and new password'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Set new password
    user.password = newPassword;
    await user.save();
    
    // Log security event
    await SecurityEvent.create({
      user: user._id,
      eventType: 'password_changed',
      description: 'Password changed successfully',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      riskLevel: 'low'
    });
    
    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user activity dashboard
// @route   GET /api/users/dashboard
// @access  Private
exports.getUserDashboard = async (req, res, next) => {
  try {
    // Get recent security events
    const recentEvents = await SecurityEvent.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get security metrics
    const highRiskEvents = await SecurityEvent.countDocuments({
      user: req.user.id,
      riskLevel: { $in: ['high', 'critical'] },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const phishingAttempts = await SecurityEvent.countDocuments({
      user: req.user.id,
      eventType: 'phishing_detected',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    // Get user
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        securityScore: user.securityScore,
        twoFactorEnabled: user.twoFactorEnabled,
        recentEvents,
        metrics: {
          highRiskEvents,
          phishingAttempts,
          securityStrength: user.twoFactorEnabled ? 'Strong' : 'Moderate'
        },
        recommendations: [
          !user.twoFactorEnabled ? 'Enable two-factor authentication for stronger security' : null,
          highRiskEvents > 0 ? 'Review recent high-risk security events' : null,
          phishingAttempts > 0 ? 'Be vigilant about phishing attempts - review security guidelines' : null,
          'Update your password regularly for improved security'
        ].filter(Boolean)
      }
    });
  } catch (error) {
    next(error);
  }
};
