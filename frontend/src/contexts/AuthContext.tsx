import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/auth';

interface User {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  verifyTwoFactor: (userId: string, token: string) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  verifyTwoFactor: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const fetchUser = async () => {
      try {
        if (AuthService.isLoggedIn()) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login({ email, password });
    
    if (response.token) {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    }
    
    return response;
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await AuthService.register({ name, email, password });
    
    if (response.token) {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    }
    
    return response;
  };

  const verifyTwoFactor = async (userId: string, token: string) => {
    const response = await AuthService.verifyTwoFactor({ userId, token });
    
    if (response.token) {
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
    }
    
    return response;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        verifyTwoFactor,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
