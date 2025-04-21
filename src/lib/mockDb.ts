// Mock database for the security application

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  isVerified: boolean;
  hasTwoFactor: boolean;
  hasBiometrics: boolean;
  hasBlockchainVerification: boolean;
  securityScore: number;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
  passwordLastChanged: string;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
  recoveryEmail?: string;
  recoveryCodes?: string[];
}

export interface PasswordEntry {
  id: string;
  userId: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  category: string;
  strength: 'weak' | 'medium' | 'strong';
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type: 'login' | 'password_change' | 'security_alert' | 'settings_change';
  description: string;
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  isRead: boolean;
}

export interface SecurityStatus {
  passwordHealth: number;
  vulnerableAccounts: number;
  darkWebExposures: number;
  reusedPasswords: number;
  weakPasswords: number;
  lastScanDate: string;
  overallScore: number;
}

// Mock Users Data - Separate for admin and regular users
export const users: User[] = [
  {
    id: 'usr_123456789',
    name: 'Demo User',
    email: 'demo@example.com',
    isVerified: true,
    hasTwoFactor: true,
    hasBiometrics: true,
    hasBlockchainVerification: false,
    securityScore: 85,
    role: 'user',
    createdAt: '2024-01-15T08:00:00Z',
    lastLogin: '2025-04-20T10:30:00Z',
    passwordLastChanged: '2025-03-05T14:20:00Z',
    subscriptionTier: 'premium',
    phone: '+1 (555) 123-4567',
    recoveryEmail: 'recovery@example.com',
    recoveryCodes: ['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234', 'YZA567', 'BCD890']
  },
  {
    id: 'usr_987654321',
    name: 'Admin User',
    email: 'admin@example.com',
    isVerified: true,
    hasTwoFactor: true,
    hasBiometrics: true,
    hasBlockchainVerification: true,
    securityScore: 95,
    role: 'admin',
    createdAt: '2024-01-10T08:00:00Z',
    lastLogin: '2025-04-20T09:15:00Z',
    passwordLastChanged: '2025-02-28T11:45:00Z',
    subscriptionTier: 'enterprise',
    phone: '+1 (555) 987-6543',
    recoveryEmail: 'admin-recovery@example.com',
    recoveryCodes: ['ZYX987', 'WVU654', 'TSR321', 'QPO098', 'NML765', 'KJI432', 'HGF109', 'EDC876', 'CBA543', 'ZYX210']
  }
];

export const currentUser: User = users[0];

// Mock Data
export const passwordEntries: PasswordEntry[] = [
  {
    id: 'pwd_001',
    userId: 'usr_123456789',
    title: 'Personal Email',
    username: 'demo@gmail.com',
    password: '********',
    url: 'https://mail.google.com',
    category: 'email',
    strength: 'strong',
    isFavorite: true,
    createdAt: '2025-01-20T12:00:00Z',
    updatedAt: '2025-03-05T14:20:00Z'
  },
  {
    id: 'pwd_002',
    userId: 'usr_123456789',
    title: 'Online Banking',
    username: 'demouser123',
    password: '********',
    url: 'https://bank.example.com',
    category: 'financial',
    strength: 'strong',
    isFavorite: true,
    createdAt: '2025-01-22T09:30:00Z',
    updatedAt: '2025-02-15T11:45:00Z'
  },
  {
    id: 'pwd_003',
    userId: 'usr_123456789',
    title: 'Work Email',
    username: 'demo.user@company.com',
    password: '********',
    url: 'https://mail.company.com',
    category: 'work',
    strength: 'medium',
    isFavorite: false,
    createdAt: '2025-02-01T15:20:00Z',
    updatedAt: '2025-02-01T15:20:00Z'
  },
  {
    id: 'pwd_004',
    userId: 'usr_123456789',
    title: 'Social Media',
    username: 'demouser',
    password: '********',
    url: 'https://socialmedia.example.com',
    category: 'social',
    strength: 'weak',
    isFavorite: false,
    createdAt: '2025-02-10T10:10:00Z',
    updatedAt: '2025-02-10T10:10:00Z'
  },
  {
    id: 'pwd_005',
    userId: 'usr_123456789',
    title: 'Shopping Site',
    username: 'demo.shopper',
    password: '********',
    url: 'https://shopping.example.com',
    category: 'shopping',
    strength: 'medium',
    isFavorite: false,
    createdAt: '2025-03-01T13:15:00Z',
    updatedAt: '2025-03-01T13:15:00Z'
  }
];

export const securityEvents: SecurityEvent[] = [
  {
    id: 'evt_001',
    userId: 'usr_123456789',
    type: 'login',
    description: 'Successful login from new device',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Windows PC - Chrome',
    timestamp: '2025-04-20T09:45:00Z',
    severity: 'low',
    isRead: true
  },
  {
    id: 'evt_002',
    userId: 'usr_123456789',
    type: 'security_alert',
    description: 'Your email address was found in a data breach',
    ipAddress: 'N/A',
    location: 'N/A',
    device: 'N/A',
    timestamp: '2025-04-19T14:20:00Z',
    severity: 'high',
    isRead: false
  },
  {
    id: 'evt_003',
    userId: 'usr_123456789',
    type: 'password_change',
    description: 'Password updated for Personal Email',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'Windows PC - Chrome',
    timestamp: '2025-04-18T11:30:00Z',
    severity: 'low',
    isRead: true
  },
  {
    id: 'evt_004',
    userId: 'usr_123456789',
    type: 'login',
    description: 'Failed login attempt',
    ipAddress: '203.0.113.42',
    location: 'Unknown Location',
    device: 'Unknown Device',
    timestamp: '2025-04-17T06:15:00Z',
    severity: 'high',
    isRead: true
  },
  {
    id: 'evt_005',
    userId: 'usr_123456789',
    type: 'settings_change',
    description: 'Two-factor authentication enabled',
    ipAddress: '192.168.1.100',
    location: 'San Francisco, CA',
    device: 'iPhone - Safari',
    timestamp: '2025-04-15T16:40:00Z',
    severity: 'medium',
    isRead: true
  }
];

export const securityStatus: SecurityStatus = {
  passwordHealth: 78,
  vulnerableAccounts: 2,
  darkWebExposures: 1,
  reusedPasswords: 1,
  weakPasswords: 2,
  lastScanDate: '2025-04-19T00:00:00Z',
  overallScore: 85
};

// Mock API functions with improved functionality
export const mockApi = {
  getCurrentUser: (): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(currentUser), 300);
    });
  },
  
  getPasswordEntries: (): Promise<PasswordEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(passwordEntries), 300);
    });
  },
  
  getSecurityEvents: (): Promise<SecurityEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(securityEvents), 300);
    });
  },
  
  getSecurityStatus: (): Promise<SecurityStatus> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(securityStatus), 300);
    });
  },
  
  register: (userData: { name: string, email: string, phone?: string, password: string }): Promise<{ success: boolean, token?: string, user?: User, error?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!userData.email || !userData.password) {
          resolve({ success: false, error: 'Email and password are required' });
          return;
        }
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
          resolve({ success: false, error: 'Email already in use' });
          return;
        }
        
        // Create new user
        const newUser: User = {
          id: 'usr_' + Math.random().toString(36).substring(2, 15),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          isVerified: false,
          hasTwoFactor: false,
          hasBiometrics: false,
          hasBlockchainVerification: false,
          securityScore: 50,
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          passwordLastChanged: new Date().toISOString(),
          subscriptionTier: 'free',
          recoveryCodes: generateRecoveryCodes(),
        };
        
        // In a real app, we would save the user to the database
        // Here we just return the success
        
        resolve({ 
          success: true, 
          token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15),
          user: newUser
        });
      }, 800);
    });
  },
  
  login: (email: string, password: string): Promise<{success: boolean, user?: User, token?: string, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find user by email
        const user = users.find(u => u.email === email);
        
        if (!user) {
          resolve({success: false, error: 'User not found'});
          return;
        }
        
        // In a real app, we would verify the password
        // For demo purposes, we'll accept specific passwords
        if ((email === 'demo@example.com' && password === 'password123') || 
            (email === 'admin@example.com' && password === 'admin123')) {
          resolve({
            success: true, 
            user: user,
            token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15)
          });
        } else {
          resolve({success: false, error: 'Invalid email or password'});
        }
      }, 800);
    });
  },
  
  verifyTwoFactor: (code: string): Promise<{success: boolean, token?: string, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code === '123456') {
          resolve({
            success: true,
            token: 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15)
          });
        } else {
          resolve({success: false, error: 'Invalid verification code'});
        }
      }, 800);
    });
  },
  
  verifyBiometric: (): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({success: true});
      }, 1200);
    });
  },
  
  verifyBlockchain: (walletAddress: string): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (walletAddress && walletAddress.startsWith('0x')) {
          resolve({success: true});
        } else {
          resolve({success: false, error: 'Invalid wallet address'});
        }
      }, 1500);
    });
  },
  
  changePassword: (currentPassword: string, newPassword: string): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (currentPassword === 'password123') {
          resolve({success: true});
        } else {
          resolve({success: false, error: 'Current password is incorrect'});
        }
      }, 800);
    });
  },
  
  updateRecoveryEmail: (email: string): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && email.includes('@')) {
          resolve({success: true});
        } else {
          resolve({success: false, error: 'Invalid email address'});
        }
      }, 500);
    });
  },
  
  updateRecoveryPhone: (phone: string): Promise<{success: boolean, error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (phone && phone.length >= 10) {
          resolve({success: true});
        } else {
          resolve({success: false, error: 'Invalid phone number'});
        }
      }, 500);
    });
  },
  
  getRecoveryCodes: (): Promise<{success: boolean, codes?: string[], error?: string}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          codes: currentUser.recoveryCodes || []
        });
      }, 500);
    });
  },
  
  // New AI-based security detection methods
  detectPhishingEmail: (emailContent: string): Promise<{isPhishing: boolean, confidence: number, reasons?: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple keyword-based detection for demo purposes
        const phishingKeywords = ['urgent', 'password', 'verify account', 'suspicious activity', 'click here', 'login immediately'];
        const lowerContent = emailContent.toLowerCase();
        
        let matchCount = 0;
        const matchedKeywords: string[] = [];
        
        phishingKeywords.forEach(keyword => {
          if (lowerContent.includes(keyword.toLowerCase())) {
            matchCount++;
            matchedKeywords.push(keyword);
          }
        });
        
        const confidence = Math.min(matchCount * 20, 95);
        resolve({
          isPhishing: confidence > 50,
          confidence,
          reasons: confidence > 50 ? [
            `Detected suspicious phrases: ${matchedKeywords.join(', ')}`,
            'Email contains typical phishing patterns',
            'Requesting sensitive information in an unusual way'
          ] : undefined
        });
      }, 700);
    });
  },
  
  detectSmsScam: (smsContent: string): Promise<{isScam: boolean, confidence: number, reasons?: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple keyword-based detection for demo purposes
        const scamKeywords = ['urgent', 'won', 'prize', 'click', 'bank', 'account locked', 'verify', 'unusual activity'];
        const lowerContent = smsContent.toLowerCase();
        
        let matchCount = 0;
        const matchedKeywords: string[] = [];
        
        scamKeywords.forEach(keyword => {
          if (lowerContent.includes(keyword.toLowerCase())) {
            matchCount++;
            matchedKeywords.push(keyword);
          }
        });
        
        const confidence = Math.min(matchCount * 20, 95);
        resolve({
          isScam: confidence > 50,
          confidence,
          reasons: confidence > 50 ? [
            `Detected suspicious phrases: ${matchedKeywords.join(', ')}`,
            'SMS contains typical scam patterns',
            'Requesting immediate action or sensitive information'
          ] : undefined
        });
      }, 700);
    });
  },
  
  verifyQrCode: (qrCodeImage: string): Promise<{isValid: boolean, confidence: number, reasons?: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulation of QR code validation
        // In a real application, this would analyze the QR code content
        const randomConfidence = Math.random() * 100;
        
        resolve({
          isValid: randomConfidence > 30,
          confidence: randomConfidence,
          reasons: randomConfidence <= 30 ? [
            'QR code redirects to suspicious domain',
            'Unusual payment request format',
            'Domain was recently registered'
          ] : undefined
        });
      }, 1000);
    });
  },
  
  detectVoipScam: (callDetails: {number: string, duration: number}): Promise<{isScam: boolean, confidence: number, reasons?: string[]}> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple heuristic for demo purposes
        const suspiciousAreaCodes = ['+1900', '+1809', '+1876', '+1284', '+1473', '+1649', '+1767', '+1849', '+1869', '+1868', '+1664'];
        
        let isHighRisk = false;
        suspiciousAreaCodes.forEach(code => {
          if (callDetails.number.startsWith(code)) {
            isHighRisk = true;
          }
        });
        
        // Short duration calls might be scam attempts
        const shortDuration = callDetails.duration < 20;
        
        const confidence = isHighRisk ? 90 : (shortDuration ? 60 : 20);
        
        resolve({
          isScam: confidence > 50,
          confidence,
          reasons: confidence > 50 ? [
            isHighRisk ? 'Call from known high-risk area code' : 'Unusual call pattern detected',
            shortDuration ? 'Suspiciously short call duration' : undefined,
            'Matches patterns of known scam calls'
          ].filter(Boolean) as string[] : undefined
        });
      }, 800);
    });
  }
};

// Helper function to generate random recovery codes
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  for (let i = 0; i < 10; i++) {
    let code = '';
    for (let j = 0; j < 6; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }
  
  return codes;
}
