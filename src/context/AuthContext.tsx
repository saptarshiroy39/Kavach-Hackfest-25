/**
 * Authentication Context
 * Provides authentication state and functions throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  AuthState, 
  LoginCredentials, 
  SignupData, 
  TwoFactorAuthData, 
  PasswordResetRequest,
  PasswordResetConfirm,
  SessionInfo,
  ApiResponse
} from '@/types';
import { authService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { AUTH_TOKEN_KEY, USER_ROLE_KEY } from '@/config';

// Auth context interface
interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyTwoFactor: (data: TwoFactorAuthData) => Promise<boolean>;
  resetPassword: (data: PasswordResetRequest) => Promise<boolean>;
  confirmResetPassword: (data: PasswordResetConfirm) => Promise<boolean>;
  
  // Session management
  getSessions: () => Promise<SessionInfo[]>;
  endSession: (sessionId: string) => Promise<boolean>;
  
  // User profile
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  
  // Clear error
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
  error: null,
  
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  verifyTwoFactor: async () => false,
  resetPassword: async () => false,
  confirmResetPassword: async () => false,
  
  getSessions: async () => [],
  endSession: async () => false,
  
  updateProfile: async () => false,
  
  clearError: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true,
    error: null,
    token: null,
  });
  
  const { toast } = useToast();
  
  // Check for existing auth session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        
        if (token) {
          const result = await authService.getCurrentUser();
          
          if (result.success && result.data) {
            setAuthState({
              user: result.data,
              isAuthenticated: true,
              isAdmin: result.data.role === 'admin',
              isLoading: false,
              error: null,
              token,
            });
          } else {
            // Invalid token, clear it
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_ROLE_KEY);
            
            setAuthState({
              user: null,
              isAuthenticated: false,
              isAdmin: false,
              isLoading: false,
              error: null,
              token: null,
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false,
            error: null,
            token: null,
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
          isLoading: false,
          error: 'Authentication check failed',
          token: null,
        });
      }
    };
    
    checkAuth();
    
    // Add listener for auth state changes from other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === AUTH_TOKEN_KEY) {
        checkAuth();
      }
    });
    
    // Add listener for auth state changes via custom event
    window.addEventListener('auth-state-changed', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-state-changed', checkAuth);
    };
  }, []);
  
  // Login method
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.login(credentials);
      
      if (result.success && result.data) {
        setAuthState({
          user: result.data.user,
          isAuthenticated: true,
          isAdmin: result.data.user.role === 'admin',
          isLoading: false,
          error: null,
          token: result.data.token,
        });
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${result.data.user.firstName || result.data.user.username}!`,
          variant: 'default',
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Login failed',
        }));
        
        toast({
          title: 'Login Failed',
          description: result.error || 'Invalid credentials',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Login Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Signup method
  const signup = async (data: SignupData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.signup(data);
      
      if (result.success && result.data) {
        toast({
          title: 'Signup Successful',
          description: 'Your account has been created successfully',
          variant: 'default',
        });
        
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Signup failed',
        }));
        
        toast({
          title: 'Signup Failed',
          description: result.error || 'Could not create account',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Signup Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Logout method
  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await authService.logout();
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        error: null,
        token: null,
      });
      
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
        variant: 'default',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      
      toast({
        title: 'Logout Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  };
  
  // Two-factor verification
  const verifyTwoFactor = async (data: TwoFactorAuthData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.verifyTwoFactor(data);
      
      if (result.success && result.data) {
        toast({
          title: 'Verification Successful',
          description: 'Two-factor authentication verified successfully',
          variant: 'default',
        });
        
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          token: result.data.token,
        }));
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Verification failed',
        }));
        
        toast({
          title: 'Verification Failed',
          description: result.error || 'Invalid verification code',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Verification Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Request password reset
  const resetPassword = async (data: PasswordResetRequest): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.requestPasswordReset(data);
      
      if (result.success) {
        toast({
          title: 'Reset Email Sent',
          description: 'If your email is registered, you will receive reset instructions',
          variant: 'default',
        });
        
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Password reset request failed',
        }));
        
        toast({
          title: 'Reset Request Failed',
          description: result.error || 'Could not process reset request',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Reset Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Confirm password reset
  const confirmResetPassword = async (data: PasswordResetConfirm): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const result = await authService.confirmPasswordReset(data);
      
      if (result.success) {
        toast({
          title: 'Password Reset',
          description: 'Your password has been reset successfully',
          variant: 'default',
        });
        
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Password reset confirmation failed',
        }));
        
        toast({
          title: 'Reset Failed',
          description: result.error || 'Could not reset password',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Reset Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Get user sessions
  const getSessions = async (): Promise<SessionInfo[]> => {
    try {
      const result = await authService.getSessions();
      
      if (result.success && result.data) {
        return result.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  };
  
  // End a session
  const endSession = async (sessionId: string): Promise<boolean> => {
    try {
      const result = await authService.endSession(sessionId);
      
      if (result.success) {
        toast({
          title: 'Session Ended',
          description: 'The session has been terminated successfully',
          variant: 'default',
        });
        
        return true;
      } else {
        toast({
          title: 'Failed to End Session',
          description: result.error || 'Could not end the session',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to end session';
      
      toast({
        title: 'Session Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Update user profile
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Mock implementation for now
      if (authState.user) {
        const updatedUser: User = {
          ...authState.user,
          ...data,
        };
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
        }));
        
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully',
          variant: 'default',
        });
        
        return true;
      }
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Not authenticated',
      }));
      
      toast({
        title: 'Profile Update Failed',
        description: 'You must be logged in to update your profile',
        variant: 'destructive',
      });
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        title: 'Update Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Clear error
  const clearError = (): void => {
    setAuthState(prev => ({ ...prev, error: null }));
  };
  
  // Context value
  const contextValue: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.isAdmin,
    isLoading: authState.isLoading,
    error: authState.error,
    
    login,
    signup,
    logout,
    verifyTwoFactor,
    resetPassword,
    confirmResetPassword,
    
    getSessions,
    endSession,
    
    updateProfile,
    
    clearError,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 