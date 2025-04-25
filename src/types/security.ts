/**
 * Security Type Definitions
 */

// Password Vault Types
export interface Password {
  id: string;
  website: string;
  username: string;
  password: string;
  strength: PasswordStrength;
  lastUpdated: string;
  notes?: string;
  category?: string;
  isFavorite: boolean;
}

export type PasswordStrength = 1 | 2 | 3 | 4 | 5;

export interface PasswordCategory {
  id: string;
  name: string;
  color: string;
}

// Authentication Types
export type AuthMethod = 'password' | 'fingerprint' | 'face' | 'device' | 'otp' | 'email';

export interface AuthDevice {
  id: string;
  name: string;
  type: string;
  lastUsed: string;
  isCurrentDevice: boolean;
  ipAddress: string;
  location?: string;
}

// Security Status Types
export interface SecurityScore {
  overall: number;
  passwordStrength: number;
  authenticationSecurity: number;
  darkWebExposure: number;
  deviceSecurity: number;
  browserSecurity: number;
}

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  category: string;
  details?: string;
}

// Blockchain Verification Types
export interface BlockchainDocument {
  id: string;
  name: string;
  hash: string;
  timestamp: string;
  verified: boolean;
  blockchain: string;
  transactionId?: string;
}

// Phishing Detection Types
export interface PhishingCheck {
  url: string;
  status: 'safe' | 'suspicious' | 'dangerous' | 'unknown';
  score: number;
  details: string[];
  timestamp: string;
}

// Payment Scanner Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  lastChecked: string;
  status: 'secure' | 'at-risk' | 'compromised' | 'unknown';
  alerts: string[];
} 