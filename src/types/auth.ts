/**
 * Authentication Type Definitions
 */

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  lastLogin?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  preferredAuthMethod?: string;
  securityQuestions?: SecurityQuestion[];
}

export type UserRole = 'user' | 'admin' | 'guest';

export interface SecurityQuestion {
  id: string;
  question: string;
  answer: string; // In practice, this should be hashed
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  acceptTerms: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface TwoFactorAuthData {
  type: 'app' | 'sms' | 'email';
  value: string; // The OTP value or confirmation code
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  operatingSystem: string;
  ipAddress: string;
  location?: string;
  startTime: string;
  lastActivity: string;
  isCurrentSession: boolean;
} 