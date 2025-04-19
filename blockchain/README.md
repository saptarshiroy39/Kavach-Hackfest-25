# Blockchain Integration

This directory contains the blockchain components for Project Hackfest 25, which are used for secure, immutable logging of critical security events.

## Overview

The blockchain integration in this project serves to:
- Create immutable records of security incidents
- Provide tamper-proof audit trails
- Validate the integrity of security logs
- Enable secure sharing of threat intelligence

## Architecture

The implementation uses a private Ethereum blockchain with smart contracts to handle:
1. Event logging
2. Data verification
3. Access control
4. Consensus protocols

## Files

- `contracts/` - Contains Solidity smart contracts
- `scripts/` - Utility scripts for blockchain operations
- `config/` - Configuration files for the blockchain network
- `test/` - Test files for smart contracts

## Integration

The blockchain components integrate with the backend through the blockchain service defined in `backend/services/blockchain.js`.

## Setup

### Prerequisites
- Node.js v14+
- Truffle framework
- Ganache (for local development)
- MetaMask (for interacting with the blockchain)

### Installation
1. Install Truffle globally:
   ```
   npm install -g truffle
   ```

2. Install Ganache for local blockchain:
   ```
   npm install -g ganache-cli
   ```

3. Install project dependencies:
   ```
   npm install
   ```

### Development Workflow
1. Start the local blockchain:
   ```
   ganache-cli
   ```

2. Deploy the contracts:
   ```
   truffle migrate --reset
   ```

3. Run tests:
   ```
   truffle test
   ```

## Security Considerations

- Private keys should never be committed to version control
- Use environment variables for sensitive configuration
- Implement proper access controls on smart contracts
- Consider gas costs when designing contract functions
