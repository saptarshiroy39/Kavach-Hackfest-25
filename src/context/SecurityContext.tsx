/**
 * Security Context
 * Provides security-related state and functions throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Password,
  SecurityScore,
  SecurityAlert,
  BlockchainDocument,
  PhishingCheck,
  PaymentMethod,
  LoadingState
} from '@/types';
import { securityService } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

// Security context interface
interface SecurityContextType {
  // Password Vault
  passwords: Password[];
  loadingPasswords: LoadingState;
  getPasswords: () => Promise<void>;
  addPassword: (password: Omit<Password, 'id'>) => Promise<Password | null>;
  updatePassword: (id: string, data: Partial<Password>) => Promise<Password | null>;
  deletePassword: (id: string) => Promise<boolean>;
  checkPasswordStrength: (password: string) => Promise<number>;
  
  // Security Score
  securityScore: SecurityScore | null;
  loadingSecurityScore: LoadingState;
  getSecurityScore: () => Promise<void>;
  
  // Security Alerts
  securityAlerts: SecurityAlert[];
  loadingSecurityAlerts: LoadingState;
  getSecurityAlerts: () => Promise<void>;
  resolveSecurityAlert: (id: string) => Promise<boolean>;
  
  // Blockchain Verification
  blockchainDocuments: BlockchainDocument[];
  loadingBlockchainDocuments: LoadingState;
  getBlockchainDocuments: () => Promise<void>;
  verifyDocument: (fileHash: string) => Promise<BlockchainDocument | null>;
  registerDocument: (name: string, hash: string) => Promise<BlockchainDocument | null>;
  
  // Phishing Detection
  phishingChecks: PhishingCheck[];
  loadingPhishingChecks: LoadingState;
  getPhishingChecks: () => Promise<void>;
  checkUrl: (url: string) => Promise<PhishingCheck | null>;
  
  // Payment Scanner
  paymentMethods: PaymentMethod[];
  loadingPaymentMethods: LoadingState;
  getPaymentMethods: () => Promise<void>;
  scanPaymentMethod: (id: string) => Promise<PaymentMethod | null>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

// Create context with default values
const SecurityContext = createContext<SecurityContextType>({
  // Password Vault
  passwords: [],
  loadingPasswords: 'idle',
  getPasswords: async () => {},
  addPassword: async () => null,
  updatePassword: async () => null,
  deletePassword: async () => false,
  checkPasswordStrength: async () => 0,
  
  // Security Score
  securityScore: null,
  loadingSecurityScore: 'idle',
  getSecurityScore: async () => {},
  
  // Security Alerts
  securityAlerts: [],
  loadingSecurityAlerts: 'idle',
  getSecurityAlerts: async () => {},
  resolveSecurityAlert: async () => false,
  
  // Blockchain Verification
  blockchainDocuments: [],
  loadingBlockchainDocuments: 'idle',
  getBlockchainDocuments: async () => {},
  verifyDocument: async () => null,
  registerDocument: async () => null,
  
  // Phishing Detection
  phishingChecks: [],
  loadingPhishingChecks: 'idle',
  getPhishingChecks: async () => {},
  checkUrl: async () => null,
  
  // Payment Scanner
  paymentMethods: [],
  loadingPaymentMethods: 'idle',
  getPaymentMethods: async () => {},
  scanPaymentMethod: async () => null,
  
  // Error handling
  error: null,
  clearError: () => {},
});

// Provider component
export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Password Vault
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loadingPasswords, setLoadingPasswords] = useState<LoadingState>('idle');
  
  // Security Score
  const [securityScore, setSecurityScore] = useState<SecurityScore | null>(null);
  const [loadingSecurityScore, setLoadingSecurityScore] = useState<LoadingState>('idle');
  
  // Security Alerts
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loadingSecurityAlerts, setLoadingSecurityAlerts] = useState<LoadingState>('idle');
  
  // Blockchain Verification
  const [blockchainDocuments, setBlockchainDocuments] = useState<BlockchainDocument[]>([]);
  const [loadingBlockchainDocuments, setLoadingBlockchainDocuments] = useState<LoadingState>('idle');
  
  // Phishing Detection
  const [phishingChecks, setPhishingChecks] = useState<PhishingCheck[]>([]);
  const [loadingPhishingChecks, setLoadingPhishingChecks] = useState<LoadingState>('idle');
  
  // Payment Scanner
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState<LoadingState>('idle');
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getPasswords();
      getSecurityScore();
      getSecurityAlerts();
      getBlockchainDocuments();
      getPhishingChecks();
      getPaymentMethods();
    }
  }, [isAuthenticated]);
  
  // Password Vault Methods
  const getPasswords = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingPasswords('loading');
      setError(null);
      
      const result = await securityService.passwords.getAll();
      
      if (result.success && result.data) {
        setPasswords(result.data);
        setLoadingPasswords('success');
      } else {
        setError(result.error || 'Failed to load passwords');
        setLoadingPasswords('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading passwords';
      setError(errorMessage);
      setLoadingPasswords('error');
    }
  };
  
  const addPassword = async (password: Omit<Password, 'id'>): Promise<Password | null> => {
    if (!isAuthenticated) {
      toast({
        title: 'Not Authenticated',
        description: 'You must be logged in to add passwords',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      setLoadingPasswords('loading');
      setError(null);
      
      const result = await securityService.passwords.create(password);
      
      if (result.success && result.data) {
        setPasswords(prev => [...prev, result.data]);
        setLoadingPasswords('success');
        
        toast({
          title: 'Password Added',
          description: 'Your password has been securely stored',
          variant: 'default',
        });
        
        return result.data;
      } else {
        setError(result.error || 'Failed to add password');
        setLoadingPasswords('error');
        
        toast({
          title: 'Failed to Add Password',
          description: result.error || 'Could not store password',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding password';
      setError(errorMessage);
      setLoadingPasswords('error');
      
      toast({
        title: 'Error Adding Password',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  const updatePassword = async (id: string, data: Partial<Password>): Promise<Password | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoadingPasswords('loading');
      setError(null);
      
      const result = await securityService.passwords.update(id, data);
      
      if (result.success && result.data) {
        setPasswords(prev => 
          prev.map(pass => (pass.id === id ? result.data : pass))
        );
        setLoadingPasswords('success');
        
        toast({
          title: 'Password Updated',
          description: 'Your password has been updated successfully',
          variant: 'default',
        });
        
        return result.data;
      } else {
        setError(result.error || 'Failed to update password');
        setLoadingPasswords('error');
        
        toast({
          title: 'Update Failed',
          description: result.error || 'Could not update password',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating password';
      setError(errorMessage);
      setLoadingPasswords('error');
      
      toast({
        title: 'Error Updating Password',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  const deletePassword = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      setLoadingPasswords('loading');
      setError(null);
      
      const result = await securityService.passwords.delete(id);
      
      if (result.success) {
        setPasswords(prev => prev.filter(pass => pass.id !== id));
        setLoadingPasswords('success');
        
        toast({
          title: 'Password Deleted',
          description: 'Your password has been deleted successfully',
          variant: 'default',
        });
        
        return true;
      } else {
        setError(result.error || 'Failed to delete password');
        setLoadingPasswords('error');
        
        toast({
          title: 'Deletion Failed',
          description: result.error || 'Could not delete password',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting password';
      setError(errorMessage);
      setLoadingPasswords('error');
      
      toast({
        title: 'Error Deleting Password',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  const checkPasswordStrength = async (password: string): Promise<number> => {
    try {
      const result = await securityService.passwords.checkStrength(password);
      
      if (result.success && result.data) {
        return result.data.strength;
      }
      
      return 0;
    } catch (err) {
      console.error('Error checking password strength:', err);
      return 0;
    }
  };
  
  // Security Score Methods
  const getSecurityScore = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingSecurityScore('loading');
      setError(null);
      
      const result = await securityService.securityScore.get();
      
      if (result.success && result.data) {
        setSecurityScore(result.data);
        setLoadingSecurityScore('success');
      } else {
        setError(result.error || 'Failed to load security score');
        setLoadingSecurityScore('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading security score';
      setError(errorMessage);
      setLoadingSecurityScore('error');
    }
  };
  
  // Security Alerts Methods
  const getSecurityAlerts = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingSecurityAlerts('loading');
      setError(null);
      
      const result = await securityService.securityAlerts.getAll();
      
      if (result.success && result.data) {
        setSecurityAlerts(result.data);
        setLoadingSecurityAlerts('success');
      } else {
        setError(result.error || 'Failed to load security alerts');
        setLoadingSecurityAlerts('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading security alerts';
      setError(errorMessage);
      setLoadingSecurityAlerts('error');
    }
  };
  
  const resolveSecurityAlert = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      setLoadingSecurityAlerts('loading');
      setError(null);
      
      const result = await securityService.securityAlerts.resolve(id);
      
      if (result.success && result.data) {
        setSecurityAlerts(prev => 
          prev.map(alert => (alert.id === id ? result.data : alert))
        );
        setLoadingSecurityAlerts('success');
        
        toast({
          title: 'Alert Resolved',
          description: 'Security alert has been resolved',
          variant: 'default',
        });
        
        return true;
      } else {
        setError(result.error || 'Failed to resolve alert');
        setLoadingSecurityAlerts('error');
        
        toast({
          title: 'Resolution Failed',
          description: result.error || 'Could not resolve alert',
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while resolving alert';
      setError(errorMessage);
      setLoadingSecurityAlerts('error');
      
      toast({
        title: 'Error Resolving Alert',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  // Blockchain Verification Methods
  const getBlockchainDocuments = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingBlockchainDocuments('loading');
      setError(null);
      
      const result = await securityService.blockchain.getDocuments();
      
      if (result.success && result.data) {
        setBlockchainDocuments(result.data);
        setLoadingBlockchainDocuments('success');
      } else {
        setError(result.error || 'Failed to load blockchain documents');
        setLoadingBlockchainDocuments('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading blockchain documents';
      setError(errorMessage);
      setLoadingBlockchainDocuments('error');
    }
  };
  
  const verifyDocument = async (fileHash: string): Promise<BlockchainDocument | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoadingBlockchainDocuments('loading');
      setError(null);
      
      const result = await securityService.blockchain.verifyDocument(fileHash);
      
      if (result.success && result.data) {
        if (result.data.verified) {
          toast({
            title: 'Document Verified',
            description: 'The document has been successfully verified on the blockchain',
            variant: 'default',
          });
        } else {
          toast({
            title: 'Document Not Verified',
            description: 'The document could not be verified on the blockchain',
            variant: 'destructive',
          });
        }
        
        setLoadingBlockchainDocuments('success');
        return result.data;
      } else {
        setError(result.error || 'Failed to verify document');
        setLoadingBlockchainDocuments('error');
        
        toast({
          title: 'Verification Failed',
          description: result.error || 'Could not verify document',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while verifying document';
      setError(errorMessage);
      setLoadingBlockchainDocuments('error');
      
      toast({
        title: 'Error Verifying Document',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  const registerDocument = async (name: string, hash: string): Promise<BlockchainDocument | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoadingBlockchainDocuments('loading');
      setError(null);
      
      const result = await securityService.blockchain.registerDocument(name, hash);
      
      if (result.success && result.data) {
        setBlockchainDocuments(prev => [...prev, result.data]);
        setLoadingBlockchainDocuments('success');
        
        toast({
          title: 'Document Registered',
          description: 'Your document has been registered on the blockchain',
          variant: 'default',
        });
        
        return result.data;
      } else {
        setError(result.error || 'Failed to register document');
        setLoadingBlockchainDocuments('error');
        
        toast({
          title: 'Registration Failed',
          description: result.error || 'Could not register document',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while registering document';
      setError(errorMessage);
      setLoadingBlockchainDocuments('error');
      
      toast({
        title: 'Error Registering Document',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  // Phishing Detection Methods
  const getPhishingChecks = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingPhishingChecks('loading');
      setError(null);
      
      const result = await securityService.phishing.getRecentChecks();
      
      if (result.success && result.data) {
        setPhishingChecks(result.data);
        setLoadingPhishingChecks('success');
      } else {
        setError(result.error || 'Failed to load phishing checks');
        setLoadingPhishingChecks('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading phishing checks';
      setError(errorMessage);
      setLoadingPhishingChecks('error');
    }
  };
  
  const checkUrl = async (url: string): Promise<PhishingCheck | null> => {
    try {
      setLoadingPhishingChecks('loading');
      setError(null);
      
      const result = await securityService.phishing.checkUrl(url);
      
      if (result.success && result.data) {
        // Add to recent checks
        setPhishingChecks(prev => [result.data, ...prev]);
        setLoadingPhishingChecks('success');
        
        // Show toast based on result
        if (result.data.status === 'safe') {
          toast({
            title: 'URL is Safe',
            description: 'The URL appears to be legitimate',
            variant: 'default',
          });
        } else if (result.data.status === 'suspicious') {
          toast({
            title: 'URL is Suspicious',
            description: 'The URL appears suspicious - proceed with caution',
            variant: 'destructive',
          });
        } else if (result.data.status === 'dangerous') {
          toast({
            title: 'URL is Dangerous',
            description: 'This URL is flagged as dangerous - do not proceed',
            variant: 'destructive',
          });
        }
        
        return result.data;
      } else {
        setError(result.error || 'Failed to check URL');
        setLoadingPhishingChecks('error');
        
        toast({
          title: 'URL Check Failed',
          description: result.error || 'Could not check URL',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while checking URL';
      setError(errorMessage);
      setLoadingPhishingChecks('error');
      
      toast({
        title: 'Error Checking URL',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  // Payment Scanner Methods
  const getPaymentMethods = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingPaymentMethods('loading');
      setError(null);
      
      const result = await securityService.payment.getMethods();
      
      if (result.success && result.data) {
        setPaymentMethods(result.data);
        setLoadingPaymentMethods('success');
      } else {
        setError(result.error || 'Failed to load payment methods');
        setLoadingPaymentMethods('error');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading payment methods';
      setError(errorMessage);
      setLoadingPaymentMethods('error');
    }
  };
  
  const scanPaymentMethod = async (id: string): Promise<PaymentMethod | null> => {
    if (!isAuthenticated) return null;
    
    try {
      setLoadingPaymentMethods('loading');
      setError(null);
      
      const result = await securityService.payment.scanMethod(id);
      
      if (result.success && result.data) {
        setPaymentMethods(prev => 
          prev.map(method => (method.id === id ? result.data : method))
        );
        setLoadingPaymentMethods('success');
        
        toast({
          title: 'Payment Method Scanned',
          description: 'Your payment method has been scanned successfully',
          variant: 'default',
        });
        
        return result.data;
      } else {
        setError(result.error || 'Failed to scan payment method');
        setLoadingPaymentMethods('error');
        
        toast({
          title: 'Scan Failed',
          description: result.error || 'Could not scan payment method',
          variant: 'destructive',
        });
        
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while scanning payment method';
      setError(errorMessage);
      setLoadingPaymentMethods('error');
      
      toast({
        title: 'Error Scanning Payment Method',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  // Error handling
  const clearError = (): void => {
    setError(null);
  };
  
  // Context value
  const contextValue: SecurityContextType = {
    // Password Vault
    passwords,
    loadingPasswords,
    getPasswords,
    addPassword,
    updatePassword,
    deletePassword,
    checkPasswordStrength,
    
    // Security Score
    securityScore,
    loadingSecurityScore,
    getSecurityScore,
    
    // Security Alerts
    securityAlerts,
    loadingSecurityAlerts,
    getSecurityAlerts,
    resolveSecurityAlert,
    
    // Blockchain Verification
    blockchainDocuments,
    loadingBlockchainDocuments,
    getBlockchainDocuments,
    verifyDocument,
    registerDocument,
    
    // Phishing Detection
    phishingChecks,
    loadingPhishingChecks,
    getPhishingChecks,
    checkUrl,
    
    // Payment Scanner
    paymentMethods,
    loadingPaymentMethods,
    getPaymentMethods,
    scanPaymentMethod,
    
    // Error handling
    error,
    clearError,
  };
  
  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook for using security context
export const useSecurity = () => useContext(SecurityContext);

export default SecurityContext; 