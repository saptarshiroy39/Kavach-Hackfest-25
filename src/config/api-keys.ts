/**
 * API Keys Configuration
 * In a production application, these should be stored securely on the server-side
 * and accessed via environment variables or a secure vault.
 */

// Define types for API keys for better type safety
export interface ApiKeys {
  ai: {
    openai: string;
    perplexity: string;
  };
  blockchain: {
    infura: string;
    alchemy: string;
    etherscan: string;
  };
  email: {
    sendgrid: string;
  };
  sms: {
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioPhoneNumber: string;
  };
  payment: {
    stripePublic: string;
    stripeSecret: string;
  };
  database: {
    url: string;
  };
  security: {
    qrScanner: string;
    virusTotal: string;
    threatIntel: string;
  };
  auth: {
    jwtSecret: string;
  };
}

// This should be loaded from environment variables in production
export const API_KEYS: ApiKeys = {
  ai: {
    openai: import.meta.env.VITE_OPENAI_API_KEY || 'sk-demo12345abcdef',
    perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY || 'pplx-demo12345abcdef',
  },
  blockchain: {
    infura: import.meta.env.VITE_INFURA_API_KEY || '1a2b3c4d5e6f7g8h9i0j',
    alchemy: import.meta.env.VITE_ALCHEMY_API_KEY || 'a1b2c3d4e5f6g7h8i9j0',
    etherscan: import.meta.env.VITE_ETHERSCAN_API_KEY || 'ABCDEFGHIJKLMNOPQRST',
  },
  email: {
    sendgrid: import.meta.env.VITE_SENDGRID_API_KEY || 'SG.demo12345abcdef',
  },
  sms: {
    twilioAccountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'AC1a2b3c4d5e6f7g8h9i0j',
    twilioAuthToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '1a2b3c4d5e6f7g8h9i0j',
    twilioPhoneNumber: import.meta.env.VITE_TWILIO_PHONE_NUMBER || '+15551234567',
  },
  payment: {
    stripePublic: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo12345abcdef',
    stripeSecret: import.meta.env.VITE_STRIPE_SECRET_KEY || 'sk_test_demo12345abcdef',
  },
  database: {
    url: import.meta.env.VITE_DATABASE_URL || 'postgresql://username:password@localhost:5432/kavach_db',
  },
  security: {
    qrScanner: import.meta.env.VITE_QR_SCANNER_API_KEY || 'qr-demo12345abcdef',
    virusTotal: import.meta.env.VITE_VIRUS_TOTAL_API_KEY || 'vt-demo12345abcdef',
    threatIntel: import.meta.env.VITE_THREAT_INTEL_API_KEY || 'ti-demo12345abcdef',
  },
  auth: {
    jwtSecret: import.meta.env.VITE_JWT_SECRET || 'jwtsecret123456789',
  },
};

// Export individual keys for convenience
export const OPENAI_API_KEY = API_KEYS.ai.openai;
export const INFURA_API_KEY = API_KEYS.blockchain.infura;
export const JWT_SECRET = API_KEYS.auth.jwtSecret; 