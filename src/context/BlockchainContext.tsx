import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BlockchainNetwork, DEFAULT_NETWORK, BLOCKCHAIN_SETTINGS } from '@/lib/blockchain/config';
import { 
  BlockchainConnection, 
  defaultConnection, 
  connectWallet, 
  getConnectionStatus, 
  switchNetwork 
} from '@/lib/blockchain/connection';
import {
  getUserVerificationStatus,
  VerificationStatus,
  getUserSecurityEvents,
  SecurityEvent,
  verifyUserIdentity,
  recordSecurityEvent
} from '@/lib/blockchain/contracts';
import { useToast } from '@/hooks/use-toast';

// Context interface
interface BlockchainContextType {
  connection: BlockchainConnection;
  verificationStatus: VerificationStatus | null;
  securityEvents: SecurityEvent[];
  isLoading: boolean;
  connectToWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  switchToNetwork: (network: BlockchainNetwork) => Promise<boolean>;
  verifyIdentity: (identityHash: string, signature: string) => Promise<boolean>;
  recordEvent: (eventType: number, data: any) => Promise<number>;
  refreshVerificationStatus: () => Promise<void>;
}

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  connection: defaultConnection,
  verificationStatus: null,
  securityEvents: [],
  isLoading: false,
  connectToWallet: async () => false,
  disconnectWallet: () => {},
  switchToNetwork: async () => false,
  verifyIdentity: async () => false,
  recordEvent: async () => -1,
  refreshVerificationStatus: async () => {}
});

// Custom hook to use the blockchain context
export const useBlockchain = () => useContext(BlockchainContext);

// Provider component
export const BlockchainProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [connection, setConnection] = useState<BlockchainConnection>(defaultConnection);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize connection on mount
  useEffect(() => {
    const initConnection = async () => {
      if (BLOCKCHAIN_SETTINGS.autoConnect) {
        setIsLoading(true);
        try {
          const status = await getConnectionStatus();
          if (status.isConnected) {
            setConnection(status);
            await fetchUserData(status);
          }
        } catch (error) {
          console.error('Failed to initialize blockchain connection:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initConnection();

    // Setup event listeners for wallet
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnectWallet();
        } else if (connection.account !== accounts[0]) {
          // Account changed, update connection
          const status = await getConnectionStatus();
          setConnection(status);
          if (status.isConnected) {
            await fetchUserData(status);
          }
        }
      };

      const handleChainChanged = async () => {
        // Chain changed, refresh connection
        const status = await getConnectionStatus();
        setConnection(status);
        if (status.isConnected) {
          await fetchUserData(status);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Fetch user data from blockchain
  const fetchUserData = async (conn: BlockchainConnection) => {
    if (!conn.isConnected || !conn.account) return;

    try {
      // Get verification status
      const status = await getUserVerificationStatus(conn, conn.account);
      setVerificationStatus(status);

      // Get security events
      const events = await getUserSecurityEvents(conn, conn.account);
      setSecurityEvents(events);
    } catch (error) {
      console.error('Failed to fetch user blockchain data:', error);
    }
  };

  // Connect to wallet
  const connectToWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if running in a supported browser environment
      if (typeof window === 'undefined') {
        toast({
          title: 'Browser Not Supported',
          description: 'This feature requires a web browser',
          variant: 'destructive',
        });
        return false;
      }

      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: 'Wallet Not Found',
          description: 'Please install MetaMask or another web3 wallet browser extension',
          variant: 'destructive',
        });
        return false;
      }

      const conn = await connectWallet();
      setConnection(conn);

      if (conn.isConnected && conn.account) {
        await fetchUserData(conn);
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${abbreviateAddress(conn.account)}`,
        });
        return true;
      } else {
        // Display specific error message if available
        if (conn.error) {
          toast({
            title: 'Connection Failed',
            description: conn.error,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Connection Failed',
            description: 'Could not connect to wallet. Please try again.',
            variant: 'destructive',
          });
        }
        return false;
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Could not connect to wallet',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setConnection(defaultConnection);
    setVerificationStatus(null);
    setSecurityEvents([]);
  };

  // Switch network
  const switchToNetwork = async (network: BlockchainNetwork): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await switchNetwork(network);
      if (success) {
        const conn = await getConnectionStatus();
        setConnection(conn);
        if (conn.isConnected) {
          await fetchUserData(conn);
        }
        toast({
          title: 'Network Switched',
          description: `Connected to ${BLOCKCHAIN_SETTINGS.useTestnet ? 'Testnet' : 'Mainnet'}`,
        });
        return true;
      } else {
        toast({
          title: 'Network Switch Failed',
          description: 'Could not switch network',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast({
        title: 'Network Error',
        description: (error as Error).message || 'Could not switch network',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify identity
  const verifyIdentity = async (identityHash: string, signature: string): Promise<boolean> => {
    if (!connection.isConnected) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return false;
    }

    setIsLoading(true);
    try {
      const success = await verifyUserIdentity(connection, identityHash, signature);
      if (success) {
        await refreshVerificationStatus();
        toast({
          title: 'Identity Verified',
          description: 'Your identity has been verified on the blockchain',
        });
        return true;
      } else {
        toast({
          title: 'Verification Failed',
          description: 'Could not verify identity',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to verify identity:', error);
      toast({
        title: 'Verification Error',
        description: (error as Error).message || 'Could not verify identity',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Record security event
  const recordEvent = async (eventType: number, data: any): Promise<number> => {
    if (!connection.isConnected || !connection.account) {
      toast({
        title: 'Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return -1;
    }

    setIsLoading(true);
    try {
      // Create a hash of the data
      const dataString = JSON.stringify(data);
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
      
      const eventId = await recordSecurityEvent(connection, connection.account, eventType, dataHash);
      if (eventId >= 0) {
        // Refresh security events
        const events = await getUserSecurityEvents(connection, connection.account);
        setSecurityEvents(events);
        
        toast({
          title: 'Event Recorded',
          description: 'Security event has been recorded on the blockchain',
        });
        return eventId;
      } else {
        toast({
          title: 'Record Failed',
          description: 'Could not record security event',
          variant: 'destructive',
        });
        return -1;
      }
    } catch (error) {
      console.error('Failed to record security event:', error);
      toast({
        title: 'Recording Error',
        description: (error as Error).message || 'Could not record security event',
        variant: 'destructive',
      });
      return -1;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh verification status
  const refreshVerificationStatus = async (): Promise<void> => {
    if (!connection.isConnected || !connection.account) return;

    setIsLoading(true);
    try {
      const status = await getUserVerificationStatus(connection, connection.account);
      setVerificationStatus(status);
    } catch (error) {
      console.error('Failed to refresh verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to abbreviate addresses
  const abbreviateAddress = (address: string | null): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Context value
  const value: BlockchainContextType = {
    connection,
    verificationStatus,
    securityEvents,
    isLoading,
    connectToWallet,
    disconnectWallet,
    switchToNetwork,
    verifyIdentity,
    recordEvent,
    refreshVerificationStatus
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContext; 