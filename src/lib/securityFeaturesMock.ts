// Security Features Mock Data
// This file provides mock API functions for the security features

// Two-Factor Authentication (2FA) mocks
export const twoFactorMock = {
  generate2FASecret: async (userId: string) => {
    return {
      qrCode: 'https://example.com/qr-code',
      secretKey: 'ABCD-EFGH-IJKL-MNOP',
    };
  },
  
  send2FACode: async (userId: string, phoneNumber: string, method: 'sms' | 'email') => {
    return { success: true };
  },
  
  verify2FACode: async (userId: string, code: string) => {
    return { success: true };
  },
};

// Mock password data for security service
export const mockPasswords = [
  {
    id: 'pwd1',
    website: 'example.com',
    username: 'user@example.com',
    password: 'P@ssw0rd123!',
    strength: 5,
    lastUpdated: new Date().toISOString(),
    notes: 'Main account',
    category: 'Work',
    isFavorite: true,
  },
  {
    id: 'pwd2',
    website: 'social-media.com',
    username: 'socialuser',
    password: 'S0cialP@ss!',
    strength: 4,
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Personal account',
    category: 'Social',
    isFavorite: false,
  },
  {
    id: 'pwd3',
    website: 'banking.com',
    username: 'bankuser',
    password: 'B@nkingS3cure!',
    strength: 5,
    lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Main banking account',
    category: 'Financial',
    isFavorite: true,
  },
];

// Mock security score data
export const mockSecurityScore = {
  overall: 85,
  passwordStrength: 90,
  authenticationSecurity: 80,
  darkWebExposure: 95,
  deviceSecurity: 75,
  browserSecurity: 85,
};

// Mock security alerts
export const mockSecurityAlerts = [
  {
    id: 'alert1',
    severity: 'high',
    message: 'Suspicious login attempt detected from unknown location',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: false,
    category: 'login',
    details: 'IP: 123.456.789.0, Location: Unknown',
  },
  {
    id: 'alert2',
    severity: 'medium',
    message: 'Password reused across multiple sites',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: false,
    category: 'password',
    details: 'Same password used for social-media.com and example.com',
  },
  {
    id: 'alert3',
    severity: 'low',
    message: 'Browser extension requesting excessive permissions',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    category: 'browser',
    details: 'Extension "WebHelper" requesting access to all sites and data',
  },
];

// Mock blockchain documents
export const mockBlockchainDocuments = [
  {
    id: 'doc1',
    name: 'Important Contract.pdf',
    hash: '8a5da52ed126447d39bee5b3439d7dbceb3',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
    blockchain: 'Ethereum',
    transactionId: '0x5da19175de33d13254842d4d493a77ddf3ce547b66dc3a0850d3cbd676c8ecab',
  },
  {
    id: 'doc2',
    name: 'Certificate of Ownership.pdf',
    hash: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
    blockchain: 'Ethereum',
    transactionId: '0xd67a447fd0acc8364687e176ea38a2b435202da5a52362c249d143d6c82a0f22',
  },
  {
    id: 'doc3',
    name: 'Digital Signature.sig',
    hash: 'fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    verified: false,
    blockchain: 'Ethereum',
  },
];

// Mock phishing checks
export const mockPhishingChecks = [
  {
    url: 'https://legitimate-bank.com',
    status: 'safe',
    score: 10,
    details: [
      'Domain age: 15 years',
      'SSL certificate valid',
      'No suspicious redirects',
    ],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    url: 'https://suspicious-banking.site',
    status: 'suspicious',
    score: 60,
    details: [
      'Domain registered recently',
      'Similar to legitimate banking site',
      'Unusual TLD (.site)',
    ],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    url: 'https://obvious-phishing-attempt.xyz',
    status: 'dangerous',
    score: 95,
    details: [
      'Known phishing domain',
      'Reported by multiple users',
      'Contains malicious code',
    ],
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock payment methods
export const mockPaymentMethods = [
  {
    id: 'payment1',
    type: 'card',
    name: 'Visa ending in 4242',
    lastChecked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'secure',
    alerts: [],
  },
  {
    id: 'payment2',
    type: 'bank',
    name: 'Checking Account ****1234',
    lastChecked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'secure',
    alerts: [],
  },
  {
    id: 'payment3',
    type: 'wallet',
    name: 'Digital Wallet',
    lastChecked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'at-risk',
    alerts: ['Recent data breach reported for this provider'],
  },
];

// Password Health mocks
export const passwordHealthMock = {
  getPasswordHealth: async () => {
    return {
      overallScore: 75,
      passwords: [
        {
          id: 'pwd_1',
          site: 'example.com',
          username: 'user@example.com',
          password: '********',
          lastChanged: new Date('2025-01-15'),
          strength: 'strong',
          isReused: false,
          isBreached: false,
        },
        {
          id: 'pwd_2',
          site: 'social-media.com',
          username: 'user123',
          password: '********',
          lastChanged: new Date('2024-09-20'),
          strength: 'medium',
          isReused: true,
          isBreached: false,
        },
        {
          id: 'pwd_3',
          site: 'shopping-site.com',
          username: 'shopper_user',
          password: '********',
          lastChanged: new Date('2023-06-10'),
          strength: 'weak',
          isReused: false,
          isBreached: true,
        },
      ],
      reused: 1,
      weak: 1,
      breached: 1,
      old: 2,
      suggestions: [
        'Update your weak password for shopping-site.com',
        'Change your reused password on social-media.com',
        'Enable 2FA on accounts with weak passwords'
      ]
    };
  },
};

// Dark Web Monitoring mocks
export const darkWebMock = {
  getDarkWebMonitoringData: async () => {
    return {
      lastScan: '2025-04-20',
      riskScore: 35,
      breachesFound: 1,
      emailsMonitored: ['demo@example.com', 'recovery@example.com'],
      breaches: [
        {
          id: 'breach_1',
          source: 'OnlineStore Database',
          date: '2024-12-15',
          exposedData: ['email', 'username', 'password (hashed)'],
          severity: 'high',
          description: 'Data breach at OnlineStore exposed over 1M user accounts',
          affectedAccount: 'demo@example.com'
        }
      ]
    };
  },
};

// Privacy Report mocks
export const privacyMock = {
  getPrivacyReportData: async () => {
    return {
      privacyScore: 70,
      lastUpdated: '2025-04-19',
      connectedApps: [
        {
          id: 'app_1',
          name: 'Social Media App',
          icon: 'social-media-icon.svg',
          lastAccess: '2 days ago',
          permissions: ['Profile access', 'Friend list', 'Post on your behalf'],
          dataAccessed: ['Name', 'Email', 'Friends list'],
          isSensitive: true
        },
        {
          id: 'app_2',
          name: 'Fitness Tracker',
          icon: 'fitness-icon.svg',
          lastAccess: '1 week ago',
          permissions: ['Health data', 'Location history'],
          dataAccessed: ['Location', 'Activity data'],
          isSensitive: true
        },
        {
          id: 'app_3',
          name: 'News Reader',
          icon: 'news-icon.svg',
          lastAccess: '1 month ago',
          permissions: ['Email address'],
          dataAccessed: ['Email'],
          isSensitive: false
        }
      ],
      dataCollections: [
        {
          type: 'Location data',
          collected: true,
          purpose: 'To provide location-based services',
          sharedWith: ['Advertisers', 'Analytics providers'],
          controlOption: 'Disable location tracking'
        },
        {
          type: 'Browsing history',
          collected: true,
          purpose: 'To personalize content and ads',
          sharedWith: ['Advertisers'],
          controlOption: 'Clear browsing history'
        },
        {
          type: 'Contact information',
          collected: true,
          purpose: 'To enable communication features',
          sharedWith: [],
          controlOption: 'Limit contact sharing'
        },
        {
          type: 'Device information',
          collected: true,
          purpose: 'For security and optimization',
          sharedWith: ['Analytics providers'],
          controlOption: 'Restrict device info'
        }
      ],
      suggestions: [
        'Revoke excessive permissions from Social Media App',
        'Consider restricting location data collection',
        'Review third-party data sharing settings',
        'Enable privacy-focused DNS settings'
      ]
    };
  },
};

// Encrypted Messaging mocks
export const messagingMock = {
  getEncryptedConversations: async () => {
    return [
      {
        id: 'conv_1',
        contact: {
          id: 'contact_1',
          name: 'Alice Smith',
          avatar: undefined,
          lastSeen: '5 minutes ago',
          status: 'online'
        },
        messages: [
          {
            id: 'msg_1',
            senderId: 'current-user',
            receiverId: 'contact_1',
            content: 'Hi Alice, how are you doing?',
            timestamp: new Date().toISOString(),
            read: true
          },
          {
            id: 'msg_2',
            senderId: 'contact_1',
            receiverId: 'current-user',
            content: 'Doing well, thanks! How about you?',
            timestamp: new Date().toISOString(),
            read: true
          }
        ],
        encryptionStatus: 'active'
      },
      {
        id: 'conv_2',
        contact: {
          id: 'contact_2',
          name: 'Bob Johnson',
          avatar: undefined,
          lastSeen: '2 hours ago',
          status: 'offline'
        },
        messages: [
          {
            id: 'msg_3',
            senderId: 'current-user',
            receiverId: 'contact_2',
            content: 'Hey Bob, do you have time for a quick call today?',
            timestamp: new Date().toISOString(),
            read: false
          }
        ],
        encryptionStatus: 'active'
      }
    ];
  },
};

export interface DigitalFootprintCompany {
  id: string;
  name: string;
  logo: string;
  category: string;
  dataCollected: string[];
  lastActivity: string;
  privacyRating: number; // 1-10, 10 being the best privacy practices
  deletionStatus: 'not_requested' | 'requested' | 'in_progress' | 'completed';
  deletionSupported: boolean;
}

export interface DigitalFootprintData {
  lastScan: string;
  companiesWithData: number;
  totalDataTypes: number;
  privacyScore: number;
  deleteRequestsSent: number;
  deleteRequestsCompleted: number;
  companies: DigitalFootprintCompany[];
  dataCategories: {
    category: string;
    count: number;
  }[];
}

// Mock implementation for Digital Footprint Tracker (similar to Mine)
export const digitalFootprintMock = {
  getDigitalFootprintData: async (): Promise<DigitalFootprintData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      lastScan: new Date().toISOString(),
      companiesWithData: 27,
      totalDataTypes: 47,
      privacyScore: 68,
      deleteRequestsSent: 8,
      deleteRequestsCompleted: 5,
      dataCategories: [
        { category: "Personal Info", count: 22 },
        { category: "Contact Info", count: 16 },
        { category: "Online Activity", count: 14 },
        { category: "Financial Data", count: 7 },
        { category: "Location Data", count: 18 },
        { category: "Social Connections", count: 11 },
      ],
      companies: [
        {
          id: "1",
          name: "Google",
          logo: "/app-icons/google.svg",
          category: "Search & Advertising",
          dataCollected: ["Personal Info", "Search History", "Location", "Online Activity", "Device Info", "Contacts"],
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "2",
          name: "Facebook",
          logo: "/app-icons/facebook.svg",
          category: "Social Media",
          dataCollected: ["Personal Info", "Photos", "Social Connections", "Location", "Interests", "Messages"],
          lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 4,
          deletionStatus: 'requested',
          deletionSupported: true,
        },
        {
          id: "3",
          name: "Amazon",
          logo: "/app-icons/amazon.svg",
          category: "E-commerce",
          dataCollected: ["Purchase History", "Personal Info", "Payment Info", "Browsing History"],
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "4",
          name: "Netflix",
          logo: "/app-icons/netflix.svg",
          category: "Entertainment",
          dataCollected: ["Viewing History", "Personal Info", "Payment Info", "Device Info"],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 7,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "5",
          name: "X",
          logo: "/app-icons/x.svg",
          category: "Social Media",
          dataCollected: ["Personal Info", "Posts", "Social Connections", "Interests"],
          lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'in_progress',
          deletionSupported: true,
        },
        {
          id: "6",
          name: "LinkedIn",
          logo: "/app-icons/linkedin.svg",
          category: "Professional Network",
          dataCollected: ["Professional Info", "Social Connections", "Employment History", "Education", "Messages"],
          lastActivity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "7",
          name: "Spotify",
          logo: "/app-icons/spotify.svg",
          category: "Entertainment",
          dataCollected: ["Listening History", "Personal Info", "Payment Info"],
          lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 7,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "8",
          name: "Adobe",
          logo: "/app-icons/adobe.svg",
          category: "Software",
          dataCollected: ["Personal Info", "Payment Info", "Usage Data", "Creative Works"],
          lastActivity: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'completed',
          deletionSupported: true,
        },
        {
          id: "9",
          name: "Microsoft",
          logo: "/app-icons/microsoft.svg",
          category: "Software & Services",
          dataCollected: ["Personal Info", "Device Info", "Usage Data", "Files", "Communications"],
          lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 6,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "10",
          name: "Uber",
          logo: "/app-icons/uber.svg",
          category: "Transportation",
          dataCollected: ["Location Data", "Personal Info", "Payment Info", "Travel History"],
          lastActivity: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'not_requested',
          deletionSupported: true,
        },
        {
          id: "11",
          name: "DoorDash",
          logo: "/app-icons/doordash.svg",
          category: "Food Delivery",
          dataCollected: ["Order History", "Personal Info", "Payment Info", "Location Data"],
          lastActivity: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 5,
          deletionStatus: 'completed',
          deletionSupported: true,
        },
        {
          id: "12",
          name: "Instagram",
          logo: "/app-icons/instagram.svg",
          category: "Social Media",
          dataCollected: ["Photos", "Personal Info", "Social Connections", "Interests", "Location", "Interactions"],
          lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          privacyRating: 3,
          deletionStatus: 'requested',
          deletionSupported: true,
        }
      ]
    };
  },
  
  // Send deletion request to a company
  requestDataDeletion: async (companyId: string): Promise<{success: boolean, message: string}> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: "Data deletion request sent successfully. This process may take up to 30 days to complete."
    };
  },
  
  // Get updated status of a deletion request
  checkDeletionStatus: async (companyId: string): Promise<{status: string, lastUpdated: string}> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const statuses = ['not_requested', 'requested', 'in_progress', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      lastUpdated: new Date().toISOString()
    };
  },
  
  // Scan for new digital footprints
  rescanDigitalFootprints: async (): Promise<{success: boolean, newCompaniesFound: number}> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      newCompaniesFound: Math.floor(Math.random() * 3) // 0-2 new companies found
    };
  }
};
