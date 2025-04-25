/**
 * Authentication Service
 * Handles user authentication, session management, and user operations
 */

import apiClient from './api-client';
import { APP_CONFIG, AUTH_TOKEN_KEY, USER_ROLE_KEY } from '@/config';
import { 
  ApiResponse, 
  User, 
  LoginCredentials, 
  SignupData, 
  AuthState,
  TwoFactorAuthData,
  PasswordResetRequest,
  PasswordResetConfirm,
  SessionInfo
} from '@/types';

const API_ENDPOINTS = {
  LOGIN: `${APP_CONFIG.api.auth}/login`,
  SIGNUP: `${APP_CONFIG.api.auth}/signup`,
  LOGOUT: `${APP_CONFIG.api.auth}/logout`,
  VERIFY_TOKEN: `${APP_CONFIG.api.auth}/verify-token`,
  REFRESH_TOKEN: `${APP_CONFIG.api.auth}/refresh-token`,
  ME: `${APP_CONFIG.api.auth}/me`,
  TWO_FACTOR: `${APP_CONFIG.api.auth}/two-factor`,
  RESET_PASSWORD: `${APP_CONFIG.api.auth}/reset-password`,
  RESET_PASSWORD_CONFIRM: `${APP_CONFIG.api.auth}/reset-password-confirm`,
  CHANGE_PASSWORD: `${APP_CONFIG.api.auth}/change-password`,
  SESSIONS: `${APP_CONFIG.api.auth}/sessions`,
  UPDATE_PROFILE: `${APP_CONFIG.api.users}/profile`,
};

// Mock implementation for development
const MOCK_USER: User = {
  id: '1',
  username: 'demo_user',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  role: 'user',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  isEmailVerified: true,
  isTwoFactorEnabled: false,
};

const MOCK_ADMIN: User = {
  id: '2',
  username: 'admin',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  isEmailVerified: true,
  isTwoFactorEnabled: true,
};

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string, user: User }>> => {
    // In a real app, this would make an API call
    // For demo, we're using mock data
    const isAdmin = credentials.email === 'admin@example.com' && credentials.password === 'admin123';
    const isUser = credentials.email === 'demo@example.com' && credentials.password === 'demo123';
    
    if (isAdmin || isUser) {
      const user = isAdmin ? MOCK_ADMIN : MOCK_USER;
      const token = isAdmin ? 'admin-token' : 'user-token';
      
      // Store auth data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(USER_ROLE_KEY, user.role);
      
      // Trigger auth change event
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
      
      return {
        data: { token, user },
        status: 200,
        success: true,
        message: 'Login successful',
      };
    }
    
    // Return error for invalid credentials
    return {
      error: 'Invalid email or password',
      status: 401,
      success: false,
    };
  },
  
  /**
   * Sign up a new user
   */
  signup: async (signupData: SignupData): Promise<ApiResponse<User>> => {
    // In a real app, this would register a new user
    // For demo, just return a success response
    if (signupData.email && signupData.password === signupData.confirmPassword) {
      const newUser: User = {
        ...MOCK_USER,
        id: Math.random().toString(36).substring(2, 9),
        email: signupData.email,
        username: signupData.username,
        firstName: signupData.firstName || 'New',
        lastName: signupData.lastName || 'User',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      return {
        data: newUser,
        status: 201,
        success: true,
        message: 'Registration successful',
      };
    }
    
    return {
      error: 'Invalid registration data',
      status: 400,
      success: false,
    };
  },
  
  /**
   * Log out the current user
   */
  logout: async (): Promise<ApiResponse<null>> => {
    // Clear stored data
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    
    // Trigger auth change event
    window.dispatchEvent(new CustomEvent('auth-state-changed'));
    
    return {
      status: 200,
      success: true,
      message: 'Logout successful',
    };
  },
  
  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userRole = localStorage.getItem(USER_ROLE_KEY);
    
    if (!token) {
      return {
        error: 'Not authenticated',
        status: 401,
        success: false,
      };
    }
    
    // Return the appropriate mock user based on role
    return {
      data: userRole === 'admin' ? MOCK_ADMIN : MOCK_USER,
      status: 200,
      success: true,
    };
  },
  
  /**
   * Verify two-factor authentication
   */
  verifyTwoFactor: async (twoFactorData: TwoFactorAuthData): Promise<ApiResponse<{ token: string }>> => {
    // Mock two-factor verification for demo
    if (twoFactorData.value === '123456') {
      return {
        data: { token: 'verified-token' },
        status: 200,
        success: true,
        message: 'Two-factor authentication successful',
      };
    }
    
    return {
      error: 'Invalid two-factor code',
      status: 400,
      success: false,
    };
  },
  
  /**
   * Request a password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<ApiResponse<null>> => {
    // Mock password reset request
    if (data.email) {
      return {
        status: 200,
        success: true,
        message: 'Password reset instructions sent to your email',
      };
    }
    
    return {
      error: 'Email is required',
      status: 400,
      success: false,
    };
  },
  
  /**
   * Confirm a password reset with token and new password
   */
  confirmPasswordReset: async (data: PasswordResetConfirm): Promise<ApiResponse<null>> => {
    // Mock password reset confirmation
    if (data.token && data.newPassword === data.confirmPassword) {
      return {
        status: 200,
        success: true,
        message: 'Password has been reset successfully',
      };
    }
    
    return {
      error: 'Invalid reset request',
      status: 400,
      success: false,
    };
  },
  
  /**
   * Get all active sessions for current user
   */
  getSessions: async (): Promise<ApiResponse<SessionInfo[]>> => {
    // Mock sessions
    const sessions: SessionInfo[] = [
      {
        id: '1',
        device: 'Desktop',
        browser: 'Chrome',
        operatingSystem: 'Windows',
        ipAddress: '192.168.1.1',
        location: 'New York, USA',
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date().toISOString(),
        isCurrentSession: true,
      },
      {
        id: '2',
        device: 'Mobile',
        browser: 'Safari',
        operatingSystem: 'iOS',
        ipAddress: '192.168.1.2',
        location: 'Chicago, USA',
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrentSession: false,
      },
    ];
    
    return {
      data: sessions,
      status: 200,
      success: true,
    };
  },
  
  /**
   * End a specific session
   */
  endSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    // Mock end session
    if (sessionId) {
      return {
        status: 200,
        success: true,
        message: 'Session ended successfully',
      };
    }
    
    return {
      error: 'Invalid session ID',
      status: 400,
      success: false,
    };
  },
};

export default authService; 