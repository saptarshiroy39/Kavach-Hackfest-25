import { ethers } from 'ethers';
import { BlockchainNetwork, CONTRACT_ADDRESSES } from './config';
import { BlockchainConnection } from './connection';

// Identity verifier contract ABI
export const IDENTITY_VERIFIER_ABI = [
  // Read functions
  "function isVerified(address user) external view returns (bool)",
  "function getVerificationStatus(address user) external view returns (uint8)",
  "function getVerificationTimestamp(address user) external view returns (uint256)",
  "function getUserIdentityHash(address user) external view returns (bytes32)",
  "function getUserTrustScore(address user) external view returns (uint256)",
  
  // Write functions
  "function verifyIdentity(bytes32 identityHash, bytes calldata signature) external returns (bool)",
  "function revokeVerification(address user) external",
  "function updateIdentityHash(bytes32 newIdentityHash, bytes calldata signature) external returns (bool)",
  
  // Events
  "event IdentityVerified(address indexed user, bytes32 identityHash, uint256 timestamp)",
  "event VerificationRevoked(address indexed user, uint256 timestamp)",
  "event IdentityUpdated(address indexed user, bytes32 newIdentityHash, uint256 timestamp)"
];

// Security events contract ABI
export const SECURITY_EVENTS_ABI = [
  // Read functions
  "function getSecurityEventCount(address user) external view returns (uint256)",
  "function getSecurityEvent(address user, uint256 index) external view returns (uint8 eventType, bytes32 dataHash, uint256 timestamp, bool isResolved)",
  "function getUserSecurityScore(address user) external view returns (uint256)",
  
  // Write functions
  "function recordSecurityEvent(address user, uint8 eventType, bytes32 dataHash) external returns (uint256)",
  "function resolveSecurityEvent(address user, uint256 eventId) external returns (bool)",
  "function acknowledgeSecurityEvent(uint256 eventId) external returns (bool)",
  
  // Events
  "event SecurityEventRecorded(address indexed user, uint256 indexed eventId, uint8 eventType, uint256 timestamp)",
  "event SecurityEventResolved(address indexed user, uint256 indexed eventId, uint256 timestamp)",
  "event SecurityEventAcknowledged(address indexed user, uint256 indexed eventId, uint256 timestamp)"
];

/**
 * Get identity verifier contract
 */
export const getIdentityVerifierContract = (connection: BlockchainConnection) => {
  if (!connection.signer || !connection.provider) {
    throw new Error('No blockchain connection available');
  }
  
  const network = connection.network;
  const contractAddress = CONTRACT_ADDRESSES[network].identityVerifier;
  
  return new ethers.Contract(
    contractAddress,
    IDENTITY_VERIFIER_ABI,
    connection.signer
  );
};

/**
 * Get security events contract
 */
export const getSecurityEventsContract = (connection: BlockchainConnection) => {
  if (!connection.signer || !connection.provider) {
    throw new Error('No blockchain connection available');
  }
  
  const network = connection.network;
  const contractAddress = CONTRACT_ADDRESSES[network].securityEvents;
  
  return new ethers.Contract(
    contractAddress,
    SECURITY_EVENTS_ABI,
    connection.signer
  );
};

// Interface definitions for contract returns
export interface VerificationStatus {
  isVerified: boolean;
  status: number; // 0: Not verified, 1: Pending, 2: Verified, 3: Revoked
  timestamp: number;
  identityHash: string;
  trustScore: number;
}

export interface SecurityEvent {
  eventId: number;
  eventType: number; // 0: Login, 1: Password change, 2: Security alert, 3: Settings change
  dataHash: string;
  timestamp: number;
  isResolved: boolean;
  isAcknowledged: boolean;
}

/**
 * Get user verification status
 */
export const getUserVerificationStatus = async (
  connection: BlockchainConnection,
  userAddress: string
): Promise<VerificationStatus> => {
  try {
    const contract = getIdentityVerifierContract(connection);
    
    const [isVerified, status, timestamp, identityHash, trustScore] = await Promise.all([
      contract.isVerified(userAddress),
      contract.getVerificationStatus(userAddress),
      contract.getVerificationTimestamp(userAddress),
      contract.getUserIdentityHash(userAddress),
      contract.getUserTrustScore(userAddress)
    ]);
    
    return {
      isVerified,
      status,
      timestamp: Number(timestamp),
      identityHash,
      trustScore: Number(trustScore)
    };
  } catch (error) {
    console.error('Failed to get verification status:', error);
    return {
      isVerified: false,
      status: 0,
      timestamp: 0,
      identityHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      trustScore: 0
    };
  }
};

/**
 * Verify user identity on blockchain
 */
export const verifyUserIdentity = async (
  connection: BlockchainConnection,
  identityHash: string,
  signature: string
): Promise<boolean> => {
  try {
    const contract = getIdentityVerifierContract(connection);
    
    const tx = await contract.verifyIdentity(identityHash, signature);
    await tx.wait(2); // Wait for 2 confirmations
    
    return true;
  } catch (error) {
    console.error('Failed to verify identity:', error);
    return false;
  }
};

/**
 * Get user security events
 */
export const getUserSecurityEvents = async (
  connection: BlockchainConnection,
  userAddress: string
): Promise<SecurityEvent[]> => {
  try {
    const contract = getSecurityEventsContract(connection);
    
    const eventCount = Number(await contract.getSecurityEventCount(userAddress));
    const events: SecurityEvent[] = [];
    
    for (let i = 0; i < eventCount; i++) {
      const [eventType, dataHash, timestamp, isResolved] = await contract.getSecurityEvent(userAddress, i);
      
      events.push({
        eventId: i,
        eventType: Number(eventType),
        dataHash,
        timestamp: Number(timestamp),
        isResolved,
        isAcknowledged: false // This would need a separate call to check
      });
    }
    
    return events;
  } catch (error) {
    console.error('Failed to get security events:', error);
    return [];
  }
};

/**
 * Record a security event on blockchain
 */
export const recordSecurityEvent = async (
  connection: BlockchainConnection,
  userAddress: string,
  eventType: number,
  dataHash: string
): Promise<number> => {
  try {
    const contract = getSecurityEventsContract(connection);
    
    const tx = await contract.recordSecurityEvent(userAddress, eventType, dataHash);
    const receipt = await tx.wait(2); // Wait for 2 confirmations
    
    // Find the event ID from the receipt
    const event = receipt.events.find(e => e.event === 'SecurityEventRecorded');
    if (event && event.args) {
      return Number(event.args.eventId);
    }
    
    return -1;
  } catch (error) {
    console.error('Failed to record security event:', error);
    return -1;
  }
}; 