import api from './api';

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
  securityScore: number;
  role: string;
  createdAt: Date;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface DashboardData {
  securityScore: number;
  twoFactorEnabled: boolean;
  recentEvents: any[];
  metrics: {
    highRiskEvents: number;
    phishingAttempts: number;
    securityStrength: string;
  };
  recommendations: string[];
}

// User service functions
const UserService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.put('/users/change-password', data);
    return response.data;
  },

  // Get user dashboard data
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/users/dashboard');
    return response.data.data;
  }
};

export default UserService;
