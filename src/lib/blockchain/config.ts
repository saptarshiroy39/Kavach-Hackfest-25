// Blockchain configuration

// Supported networks
export enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  AVALANCHE = 'avalanche'
}

// Network configuration
export const NETWORK_CONFIG = {
  [BlockchainNetwork.ETHEREUM]: {
    chainId: '0x1', // Mainnet
    rpcUrl: 'https://ethereum.publicnode.com',
    name: 'Ethereum Mainnet',
    blockExplorer: 'https://etherscan.io',
    testnetRpcUrl: 'https://eth-sepolia.public.blastapi.io',
    testnetName: 'Sepolia Testnet',
    testnetChainId: '0xaa36a7',
    testnetBlockExplorer: 'https://sepolia.etherscan.io'
  },
  [BlockchainNetwork.POLYGON]: {
    chainId: '0x89', // Polygon Mainnet
    rpcUrl: 'https://polygon-rpc.com',
    name: 'Polygon Mainnet',
    blockExplorer: 'https://polygonscan.com',
    testnetRpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
    testnetName: 'Mumbai Testnet',
    testnetChainId: '0x13881',
    testnetBlockExplorer: 'https://mumbai.polygonscan.com'
  },
  [BlockchainNetwork.AVALANCHE]: {
    chainId: '0xa86a', // Avalanche Mainnet
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    name: 'Avalanche C-Chain',
    blockExplorer: 'https://snowtrace.io',
    testnetRpcUrl: 'https://avalanche-fuji-c-chain.publicnode.com',
    testnetName: 'Avalanche Fuji Testnet',
    testnetChainId: '0xa869',
    testnetBlockExplorer: 'https://testnet.snowtrace.io'
  }
};

// Default network
export const DEFAULT_NETWORK = BlockchainNetwork.POLYGON;

// Smart contract addresses
export const CONTRACT_ADDRESSES = {
  [BlockchainNetwork.ETHEREUM]: {
    identityVerifier: '0x71C95911E9a5D330f4D621842EC243EE1343292e', // Sepolia test address
    securityEvents: '0x8947747Db5E8275A83A95Ae6269f54529Af1D77F'  // Sepolia test address
  },
  [BlockchainNetwork.POLYGON]: {
    identityVerifier: '0x4BCa3751324EeB5A8F2Bd7C8E7134716e71F33de', // Mumbai test address
    securityEvents: '0x2Ea127daE2A4CA58243D8ED81c21334D3FF3B9D0'  // Mumbai test address
  },
  [BlockchainNetwork.AVALANCHE]: {
    identityVerifier: '0x9A676e781A523b5d0C0e43731313A708CB607508', // Fuji test address 
    securityEvents: '0x05C6D78A7D25F186b599bcd96330cC9E5EFEC873'  // Fuji test address
  }
};

// App-specific settings
export const BLOCKCHAIN_SETTINGS = {
  useTestnet: true, // For development, use testnet
  autoConnect: false, // Don't auto connect on app startup (can cause issues)
  storageKey: 'kavach_blockchain_auth',
  requiredConfirmations: 1, // Reduce required confirmations for testnet
  fallbackProvider: true // Use fallback provider if wallet connection fails
}; 