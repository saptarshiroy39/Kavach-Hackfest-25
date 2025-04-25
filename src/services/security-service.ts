/**
 * Security Service
 * Handles security-related API calls and functionality
 */

import apiClient from './api-client';
import { APP_CONFIG } from '@/config';
import { 
  ApiResponse,
  Password,
  SecurityScore,
  SecurityAlert,
  BlockchainDocument,
  PhishingCheck,
  PaymentMethod
} from '@/types';

// Mock data for development
import { 
  mockPasswords, 
  mockSecurityScore, 
  mockSecurityAlerts,
  mockBlockchainDocuments,
  mockPhishingChecks,
  mockPaymentMethods
} from '@/lib/securityFeaturesMock';

// API endpoints
const API_ENDPOINTS = {
  PASSWORDS: `${APP_CONFIG.api.security}/passwords`,
  SECURITY_SCORE: `${APP_CONFIG.api.security}/score`,
  SECURITY_ALERTS: `${APP_CONFIG.api.security}/alerts`,
  BLOCKCHAIN_DOCUMENTS: `${APP_CONFIG.api.blockchain}/documents`,
  PHISHING_CHECK: `${APP_CONFIG.api.security}/phishing-check`,
  PAYMENT_METHODS: `${APP_CONFIG.api.security}/payment-methods`,
};

/**
 * Security Service
 */
export const securityService = {
  /**
   * Password Management
   */
  passwords: {
    // Get all passwords
    getAll: async (): Promise<ApiResponse<Password[]>> => {
      // Mock implementation
      return {
        data: mockPasswords,
        status: 200,
        success: true,
      };
    },
    
    // Get a password by ID
    getById: async (id: string): Promise<ApiResponse<Password>> => {
      const password = mockPasswords.find(p => p.id === id);
      
      if (password) {
        return {
          data: password,
          status: 200,
          success: true,
        };
      }
      
      return {
        error: 'Password not found',
        status: 404,
        success: false,
      };
    },
    
    // Create a new password
    create: async (password: Omit<Password, 'id'>): Promise<ApiResponse<Password>> => {
      const newPassword: Password = {
        ...password,
        id: Math.random().toString(36).substring(2, 9),
        lastUpdated: new Date().toISOString(),
      };
      
      return {
        data: newPassword,
        status: 201,
        success: true,
        message: 'Password created successfully',
      };
    },
    
    // Update a password
    update: async (id: string, password: Partial<Password>): Promise<ApiResponse<Password>> => {
      const existingPassword = mockPasswords.find(p => p.id === id);
      
      if (!existingPassword) {
        return {
          error: 'Password not found',
          status: 404,
          success: false,
        };
      }
      
      const updatedPassword: Password = {
        ...existingPassword,
        ...password,
        lastUpdated: new Date().toISOString(),
      };
      
      return {
        data: updatedPassword,
        status: 200,
        success: true,
        message: 'Password updated successfully',
      };
    },
    
    // Delete a password
    delete: async (id: string): Promise<ApiResponse<null>> => {
      const passwordExists = mockPasswords.some(p => p.id === id);
      
      if (!passwordExists) {
        return {
          error: 'Password not found',
          status: 404,
          success: false,
        };
      }
      
      return {
        status: 200,
        success: true,
        message: 'Password deleted successfully',
      };
    },
    
    // Check password strength
    checkStrength: async (password: string): Promise<ApiResponse<{ strength: number }>> => {
      // Simple mock implementation
      let strength = 1;
      
      if (password.length >= 8) strength++;
      if (password.match(/[A-Z]/)) strength++;
      if (password.match(/[0-9]/)) strength++;
      if (password.match(/[^A-Za-z0-9]/)) strength++;
      
      return {
        data: { strength },
        status: 200,
        success: true,
      };
    },
  },
  
  /**
   * Security Score
   */
  securityScore: {
    // Get security score
    get: async (): Promise<ApiResponse<SecurityScore>> => {
      return {
        data: mockSecurityScore,
        status: 200,
        success: true,
      };
    },
  },
  
  /**
   * Security Alerts
   */
  securityAlerts: {
    // Get all security alerts
    getAll: async (): Promise<ApiResponse<SecurityAlert[]>> => {
      return {
        data: mockSecurityAlerts,
        status: 200,
        success: true,
      };
    },
    
    // Resolve an alert
    resolve: async (id: string): Promise<ApiResponse<SecurityAlert>> => {
      const alert = mockSecurityAlerts.find(a => a.id === id);
      
      if (!alert) {
        return {
          error: 'Alert not found',
          status: 404,
          success: false,
        };
      }
      
      const resolvedAlert: SecurityAlert = {
        ...alert,
        resolved: true,
      };
      
      return {
        data: resolvedAlert,
        status: 200,
        success: true,
        message: 'Alert resolved successfully',
      };
    },
  },
  
  /**
   * Blockchain Document Verification
   */
  blockchain: {
    // Get all blockchain documents
    getDocuments: async (): Promise<ApiResponse<BlockchainDocument[]>> => {
      return {
        data: mockBlockchainDocuments,
        status: 200,
        success: true,
      };
    },
    
    // Verify a document with blockchain
    verifyDocument: async (fileHash: string): Promise<ApiResponse<BlockchainDocument>> => {
      // Mock verification
      const verified = Math.random() > 0.2; // 80% chance of success
      
      return {
        data: {
          id: Math.random().toString(36).substring(2, 9),
          name: 'Verified Document',
          hash: fileHash,
          timestamp: new Date().toISOString(),
          verified,
          blockchain: 'Ethereum',
          transactionId: verified ? `0x${Math.random().toString(16).substring(2, 42)}` : undefined,
        },
        status: 200,
        success: true,
        message: verified ? 'Document verified successfully' : 'Document verification failed',
      };
    },
    
    // Register a document on blockchain
    registerDocument: async (name: string, hash: string): Promise<ApiResponse<BlockchainDocument>> => {
      return {
        data: {
          id: Math.random().toString(36).substring(2, 9),
          name,
          hash,
          timestamp: new Date().toISOString(),
          verified: true,
          blockchain: 'Ethereum',
          transactionId: `0x${Math.random().toString(16).substring(2, 42)}`,
        },
        status: 201,
        success: true,
        message: 'Document registered successfully',
      };
    },
  },
  
  /**
   * Phishing Detection
   */
  phishing: {
    // Check a URL for phishing
    checkUrl: async (url: string): Promise<ApiResponse<PhishingCheck>> => {
      // Mock implementation
      const isDangerous = url.includes('phishing') || url.includes('scam');
      const isSuspicious = url.includes('suspicious') || url.includes('unknown');
      
      const status = isDangerous ? 'dangerous' : 
                    isSuspicious ? 'suspicious' : 'safe';
                    
      const score = isDangerous ? 90 : 
                   isSuspicious ? 50 : 10;
                   
      return {
        data: {
          url,
          status: status as 'safe' | 'suspicious' | 'dangerous' | 'unknown',
          score,
          details: [
            isDangerous ? 'Known phishing domain' : 'Domain appears legitimate',
            isDangerous ? 'Suspicious URL structure' : 'Normal URL structure',
            isDangerous ? 'Reported by multiple users' : 'No user reports',
          ],
          timestamp: new Date().toISOString(),
        },
        status: 200,
        success: true,
      };
    },
    
    // Get recent phishing checks
    getRecentChecks: async (): Promise<ApiResponse<PhishingCheck[]>> => {
      return {
        data: mockPhishingChecks,
        status: 200,
        success: true,
      };
    },
  },
  
  /**
   * Payment Scanner
   */
  payment: {
    // Get all payment methods
    getMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
      return {
        data: mockPaymentMethods,
        status: 200,
        success: true,
      };
    },
    
    // Scan a payment method
    scanMethod: async (id: string): Promise<ApiResponse<PaymentMethod>> => {
      const method = mockPaymentMethods.find(m => m.id === id);
      
      if (!method) {
        return {
          error: 'Payment method not found',
          status: 404,
          success: false,
        };
      }
      
      // Mock scan result
      const updatedMethod: PaymentMethod = {
        ...method,
        lastChecked: new Date().toISOString(),
      };
      
      return {
        data: updatedMethod,
        status: 200,
        success: true,
        message: 'Payment method scanned successfully',
      };
    },
  },
};

export default securityService; 