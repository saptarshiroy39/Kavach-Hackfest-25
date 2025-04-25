/**
 * Application Configuration
 * Central place for app-wide configuration settings
 */

export const APP_CONFIG = {
  name: 'Kavach',
  version: '1.0.0',
  description: 'Advanced security platform for digital identity protection',
  
  // Feature flags for enabling/disabling features
  features: {
    darkWebMonitoring: true,
    blockchainVerification: true,
    biometricAuth: true,
    encryptedMessaging: true,
    phishingDetection: true,
    passwordVault: true,
    paymentScanner: true,
  },
  
  // Default settings
  defaults: {
    theme: 'system',  // 'light', 'dark', or 'system'
    language: 'en',   // Default language
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in ms
    passwordStrengthMinimum: 3, // Minimum strength required (1-5)
  },
  
  // API endpoints
  api: {
    baseUrl: '/api',
    auth: '/api/auth',
    users: '/api/users',
    security: '/api/security',
    blockchain: '/api/blockchain',
    messaging: '/api/messaging',
  },
  
  // Security settings
  security: {
    allowedLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in ms
    allowedDevices: 5, // Maximum number of devices per user
    passwordResetExpiry: 24 * 60 * 60 * 1000, // 24 hours in ms
  },
  
  // Application routes
  routes: {
    home: '/',
    login: '/login',
    signup: '/signup',
    dashboard: '/',
    passwordVault: '/password-vault',
    authentication: '/authentication',
    securityStatus: '/security-status',
    blockchainVerify: '/blockchain-verify',
    encryptedMessaging: '/encrypted-messaging',
    notifications: '/notifications',
    settings: '/settings',
    admin: {
      root: '/admin',
      dashboard: '/admin',
      users: '/admin/users',
      settings: '/admin/settings',
    }
  }
}; 