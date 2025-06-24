import { ethers } from 'ethers';
import { BlockchainNetwork, NETWORK_CONFIG, DEFAULT_NETWORK, BLOCKCHAIN_SETTINGS } from './config';

// Type definitions
export interface BlockchainConnection {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  network: BlockchainNetwork;
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  isTestnet: boolean;
  error?: string;
}

// Default connection state
export const defaultConnection: BlockchainConnection = {
  provider: null,
  signer: null,
  network: DEFAULT_NETWORK,
  account: null,
  chainId: null,
  isConnected: false,
  isTestnet: BLOCKCHAIN_SETTINGS.useTestnet
};

/**
 * Create a blockchain provider based on the network and settings
 */
export const createProvider = (network: BlockchainNetwork): ethers.Provider => {
  const networkConfig = NETWORK_CONFIG[network];
  const rpcUrl = BLOCKCHAIN_SETTINGS.useTestnet ? networkConfig.testnetRpcUrl : networkConfig.rpcUrl;
  
  return new ethers.JsonRpcProvider(rpcUrl);
};

/**
 * Create a fallback provider when wallet connection fails
 */
export const createFallbackProvider = (network: BlockchainNetwork): ethers.Provider => {
  const networkConfig = NETWORK_CONFIG[network];
  const rpcUrl = BLOCKCHAIN_SETTINGS.useTestnet ? networkConfig.testnetRpcUrl : networkConfig.rpcUrl;
  
  return new ethers.JsonRpcProvider(rpcUrl);
};

/**
 * Try connecting with fallback if wallet connection fails
 */
export const getProviderWithFallback = async (network: BlockchainNetwork): Promise<ethers.Provider> => {
  try {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      // Try to use browser wallet
      return new ethers.BrowserProvider(window.ethereum);
    } else {
      throw new Error('No browser wallet available');
    }
  } catch (error) {
    console.warn('Using fallback provider due to error:', error);
    // Fallback to RPC provider
    return createFallbackProvider(network);
  }
};

/**
 * Connect to wallet using browser extension (MetaMask, etc.)
 */
export const connectWallet = async (): Promise<BlockchainConnection> => {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot connect to wallet in non-browser environment');
    }
    
    // Check if ethereum object is available (MetaMask or other wallet)
    if (typeof window.ethereum === 'undefined') {
      throw new Error('No Ethereum wallet found. Please install MetaMask or another web3 wallet.');
    }
    
    // Request account access with better error handling
    let accounts: string[];
    try {
      accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts',
        params: []
      });
    } catch (requestError: any) {
      if (requestError.code === 4001) {
        throw new Error('User rejected the wallet connection request');
      } else if (requestError.code === -32002) {
        throw new Error('Wallet connection request is already pending. Please check your wallet.');
      } else {
        throw new Error(`Wallet connection failed: ${requestError.message || 'Unknown error'}`);
      }
    }
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available in wallet');
    }
    
    // Get provider and signer with retry logic
    let provider: ethers.BrowserProvider;
    let signer: ethers.Signer;
    let network: ethers.Network;
      try {
      provider = new ethers.BrowserProvider(window.ethereum);
      network = await provider.getNetwork(); // This will also detect the network
      signer = await provider.getSigner();
    } catch (providerError) {
      console.error('Failed to initialize provider:', providerError);
      throw new Error('Could not initialize wallet connection. Please refresh and try again.');
    }
    
    const chainId = network.chainId;
    const chainIdHex = '0x' + chainId.toString(16);
    
    // Map chainId to our network enum
    const detectedNetwork = getNetworkFromChainId(chainIdHex);
    
    // Return connected state
    return {
      provider,
      signer,
      network: detectedNetwork,
      account: accounts[0].toLowerCase(), // Normalize to lowercase
      chainId: chainIdHex,
      isConnected: true,
      isTestnet: BLOCKCHAIN_SETTINGS.useTestnet
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    // Return meaningful error information
    return { 
      ...defaultConnection,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get current blockchain connection status
 */
export const getConnectionStatus = async (): Promise<BlockchainConnection> => {
  try {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork(); // This will also detect the network
        const signer = await provider.getSigner();
        const chainId = network.chainId;
        const chainIdHex = '0x' + chainId.toString(16);
        
        return {
          provider,
          signer,
          network: getNetworkFromChainId(chainIdHex),
          account: accounts[0].toLowerCase(),
          chainId: chainIdHex,
          isConnected: true,
          isTestnet: BLOCKCHAIN_SETTINGS.useTestnet
        };
      }
    }
    
    return { ...defaultConnection };
  } catch (error) {
    console.error('Failed to get connection status:', error);
    return { ...defaultConnection };
  }
};

/**
 * Switch blockchain network
 */
export const switchNetwork = async (network: BlockchainNetwork): Promise<boolean> => {
  try {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const networkConfig = NETWORK_CONFIG[network];
      const chainId = BLOCKCHAIN_SETTINGS.useTestnet ? networkConfig.testnetChainId : networkConfig.chainId;
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        });
        
        return true;
      } catch (switchError: any) {
        // Error code 4902 means the network is not added to MetaMask
        if (switchError.code === 4902) {
          console.log('Network not found, attempting to add it...');
          return await addNetwork(network);
        } else if (switchError.code === 4001) {
          console.log('User rejected network switch');
          return false;
        } else {
          console.error('Failed to switch network:', switchError);
          throw switchError;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('Failed to switch network:', error);
    return false;
  }
};

/**
 * Add a new network to wallet
 */
export const addNetwork = async (network: BlockchainNetwork): Promise<boolean> => {
  try {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      const networkConfig = NETWORK_CONFIG[network];
      const isTestnet = BLOCKCHAIN_SETTINGS.useTestnet;
      
      const params = {
        chainId: isTestnet ? networkConfig.testnetChainId : networkConfig.chainId,
        chainName: isTestnet ? networkConfig.testnetName : networkConfig.name,
        rpcUrls: [isTestnet ? networkConfig.testnetRpcUrl : networkConfig.rpcUrl],
        blockExplorerUrls: [isTestnet ? networkConfig.testnetBlockExplorer : networkConfig.blockExplorer],
        nativeCurrency: {
          name: network === BlockchainNetwork.ETHEREUM ? 'Ether' : 
                 network === BlockchainNetwork.POLYGON ? 'MATIC' : 'AVAX',
          symbol: network === BlockchainNetwork.ETHEREUM ? 'ETH' : 
                    network === BlockchainNetwork.POLYGON ? 'MATIC' : 'AVAX',
          decimals: 18
        }
      };
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params]
      });
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to add network:', error);
    return false;
  }
};

/**
 * Map chain ID to network enum
 */
export const getNetworkFromChainId = (chainId: string): BlockchainNetwork => {
  switch (chainId.toLowerCase()) {
    case '0x1': // Ethereum Mainnet
    case '0xaa36a7': // Sepolia Testnet
      return BlockchainNetwork.ETHEREUM;
    case '0x89': // Polygon Mainnet
    case '0x13881': // Mumbai Testnet
      return BlockchainNetwork.POLYGON;
    case '0xa86a': // Avalanche Mainnet
    case '0xa869': // Avalanche Fuji Testnet
      return BlockchainNetwork.AVALANCHE;
    default:
      return DEFAULT_NETWORK; // Fallback to default
  }
};

// Define the window.ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}