/**
 * API Endpoints Configuration
 * A central file for all API endpoints used in the application
 */

// Base URL for API requests (can be configured for different environments)
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.kavach-security.com'  // Production API
  : 'http://localhost:3000';           // Development API

// Authentication Endpoints
export const AUTH_API = {
  login: `${API_BASE_URL}/api/auth/login`,
  register: `${API_BASE_URL}/api/auth/register`,
  logout: `${API_BASE_URL}/api/auth/logout`,
  refreshToken: `${API_BASE_URL}/api/auth/refresh-token`,
  resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
  changePassword: `${API_BASE_URL}/api/auth/change-password`,
  verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,
  mfaSetup: `${API_BASE_URL}/api/auth/mfa/setup`,
  mfaVerify: `${API_BASE_URL}/api/auth/mfa/verify`,
  biometricSetup: `${API_BASE_URL}/api/auth/biometric/setup`,
  biometricVerify: `${API_BASE_URL}/api/auth/biometric/verify`,
};

// User Management Endpoints
export const USER_API = {
  profile: `${API_BASE_URL}/api/users/profile`,
  update: `${API_BASE_URL}/api/users/update`,
  devices: `${API_BASE_URL}/api/users/devices`,
  preferences: `${API_BASE_URL}/api/users/preferences`,
  deleteAccount: `${API_BASE_URL}/api/users/delete-account`,
  sessions: `${API_BASE_URL}/api/users/sessions`,
};

// Password Vault Endpoints
export const PASSWORD_VAULT_API = {
  getAll: `${API_BASE_URL}/api/vault/passwords`,
  getById: (id: string) => `${API_BASE_URL}/api/vault/passwords/${id}`,
  create: `${API_BASE_URL}/api/vault/passwords`,
  update: (id: string) => `${API_BASE_URL}/api/vault/passwords/${id}`,
  delete: (id: string) => `${API_BASE_URL}/api/vault/passwords/${id}`,
  checkStrength: `${API_BASE_URL}/api/vault/check-strength`,
  generatePassword: `${API_BASE_URL}/api/vault/generate-password`,
  categories: `${API_BASE_URL}/api/vault/categories`,
};

// Security Scanner Endpoints
export const SECURITY_SCANNER_API = {
  scanEmail: `${API_BASE_URL}/api/security/scan/email`,
  scanUrl: `${API_BASE_URL}/api/security/scan/url`,
  scanDevice: `${API_BASE_URL}/api/security/scan/device`,
  scanSocialMedia: `${API_BASE_URL}/api/security/scan/social-media`,
  darkWebScan: `${API_BASE_URL}/api/security/dark-web`,
  vulnerabilityCheck: `${API_BASE_URL}/api/security/vulnerabilities`,
  securityReport: `${API_BASE_URL}/api/security/report`,
};

// Blockchain Verification Endpoints
export const BLOCKCHAIN_API = {
  verifyDocument: `${API_BASE_URL}/api/blockchain/verify/document`,
  verifyIdentity: `${API_BASE_URL}/api/blockchain/verify/identity`,
  certificate: (id: string) => `${API_BASE_URL}/api/blockchain/certificate/${id}`,
  transactions: `${API_BASE_URL}/api/blockchain/transactions`,
  issueCredential: `${API_BASE_URL}/api/blockchain/issue-credential`,
};

// Phishing Detection Endpoints
export const PHISHING_API = {
  checkUrl: `${API_BASE_URL}/api/phishing/check-url`,
  checkEmail: `${API_BASE_URL}/api/phishing/check-email`,
  reportPhishing: `${API_BASE_URL}/api/phishing/report`,
  safeLinks: `${API_BASE_URL}/api/phishing/safe-links`,
};

// Payment Protection Endpoints
export const PAYMENT_API = {
  validateCard: `${API_BASE_URL}/api/payment/validate-card`,
  scanMethod: `${API_BASE_URL}/api/payment/scan-method`,
  verifyTransaction: `${API_BASE_URL}/api/payment/verify-transaction`,
  paymentHistory: `${API_BASE_URL}/api/payment/history`,
};

// Encrypted Messaging Endpoints
export const MESSAGING_API = {
  conversations: `${API_BASE_URL}/api/messaging/conversations`,
  messages: (conversationId: string) => `${API_BASE_URL}/api/messaging/conversations/${conversationId}/messages`,
  sendMessage: (conversationId: string) => `${API_BASE_URL}/api/messaging/conversations/${conversationId}/send`,
  createConversation: `${API_BASE_URL}/api/messaging/conversations`,
  deleteConversation: (id: string) => `${API_BASE_URL}/api/messaging/conversations/${id}`,
  keyExchange: `${API_BASE_URL}/api/messaging/key-exchange`,
};

// Notification Endpoints
export const NOTIFICATION_API = {
  getAll: `${API_BASE_URL}/api/notifications`,
  markAsRead: (id: string) => `${API_BASE_URL}/api/notifications/${id}/read`,
  deleteNotification: (id: string) => `${API_BASE_URL}/api/notifications/${id}`,
  updatePreferences: `${API_BASE_URL}/api/notifications/preferences`,
};

// Admin Endpoints
export const ADMIN_API = {
  dashboard: `${API_BASE_URL}/api/admin/dashboard`,
  users: {
    getAll: `${API_BASE_URL}/api/admin/users`,
    getById: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    create: `${API_BASE_URL}/api/admin/users`,
    update: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    delete: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    resetPassword: (id: string) => `${API_BASE_URL}/api/admin/users/${id}/reset-password`,
  },
  logs: `${API_BASE_URL}/api/admin/logs`,
  settings: `${API_BASE_URL}/api/admin/settings`,
  analytics: `${API_BASE_URL}/api/admin/analytics`,
  reports: `${API_BASE_URL}/api/admin/reports`,
}; 