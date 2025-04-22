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
