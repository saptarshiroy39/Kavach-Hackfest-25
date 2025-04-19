import api from './api';
import { jwtDecode } from 'jwt-decode';

// Types
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyTwoFactorData {
  userId: string;
  token: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
  securityScore: number;
  role: string;
}

// Auth service functions
const AuthService = {
  // Register a new user
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Login user
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Verify 2FA token
  verifyTwoFactor: async (data: VerifyTwoFactorData) => {
    const response = await api.post('/auth/verify-2fa', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Setup 2FA
  setupTwoFactor: async () => {
    const response = await api.post('/auth/setup-2fa');
    return response.data;
  },

  // Enable 2FA
  enableTwoFactor: async (token: string) => {
    const response = await api.post('/auth/enable-2fa', { token });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;    try {
      // Check if token is expired
      const decoded: any = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default AuthService;

// Export individual functions for components that import them directly
export const register = (data: RegisterData) => {
  return AuthService.register(data);
};
