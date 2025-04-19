import api from './api';

// Types
interface SecurityEvent {
  id: string;
  eventType: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  blockchainHash?: string;
  verified: boolean;
}

interface PhishingCheckData {
  content: string;
  contentType: string;
}

interface PhishingResult {
  isPhishing: boolean;
  confidence: number;
  matchedPatterns: string[];
}

// Security service functions
const SecurityService = {
  // Log a security event
  logSecurityEvent: async (eventType: string, description: string, riskLevel?: 'low' | 'medium' | 'high' | 'critical') => {
    const response = await api.post('/security/events', {
      eventType,
      description,
      riskLevel
    });
    return response.data;
  },

  // Get security events for current user
  getSecurityEvents: async () => {
    const response = await api.get('/security/events');
    return response.data.data;
  },

  // Get security analysis for current user
  getSecurityAnalysis: async () => {
    const response = await api.get('/security/analysis');
    return response.data.data;
  },

  // Check content for phishing
  checkPhishing: async (data: PhishingCheckData): Promise<PhishingResult> => {
    const response = await api.post('/security/check-phishing', data);
    return response.data.data;
  },

  // Verify blockchain transaction
  verifyBlockchainTransaction: async (hash: string) => {
    const response = await api.get(`/blockchain/verify/${hash}`);
    return response.data.verified;
  },

  // Get digital identity from blockchain
  getDigitalIdentity: async () => {
    const response = await api.get('/blockchain/identity');
    return response.data.data;
  }
};

export default SecurityService;

// Export individual functions for components that import them directly
export const checkPhishingUrl = async (url: string) => {
  return SecurityService.checkPhishing({ content: url, contentType: 'url' });
};

export const getSecuritySettings = async () => {
  const response = await api.get('/security/settings');
  return response.data.data;
};

export const updateSecuritySettings = async (settings: any) => {
  const response = await api.put('/security/settings', settings);
  return response.data.data;
};

export const requestNewTOTP = async () => {
  const response = await api.post('/security/totp/new');
  return response.data.data;
};

export const getSecurityEvents = SecurityService.getSecurityEvents;
