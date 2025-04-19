/**
 * Blockchain utility functions for Project Hackfest-25
 * 
 * This module provides functions to interact with the SecurityEventLog smart contract
 */

const Web3 = require('web3');
const SecurityEventLog = require('../build/contracts/SecurityEventLog.json');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

class BlockchainClient {
  constructor(providerUrl = 'http://localhost:8545') {
    this.web3 = new Web3(providerUrl);
    this.contract = null;
    this.contractAddress = null;
    this.account = null;
  }

  /**
   * Initialize the blockchain client with a contract address and account
   * @param {string} contractAddress - The address of the deployed SecurityEventLog contract
   * @param {string} privateKey - The private key for the account (optional)
   */
  async init(contractAddress = null, privateKey = null) {
    try {
      // If contract address is not provided, get from deployed contracts
      if (!contractAddress) {
        const networkId = await this.web3.eth.net.getId();
        const deployedNetwork = SecurityEventLog.networks[networkId];
        if (!deployedNetwork) {
          throw new Error('Contract not deployed on the connected network');
        }
        contractAddress = deployedNetwork.address;
      }
      
      this.contractAddress = contractAddress;
      this.contract = new this.web3.eth.Contract(
        SecurityEventLog.abi,
        contractAddress
      );

      // Setup account
      if (privateKey) {
        // Use provided private key
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.web3.eth.accounts.wallet.add(account);
        this.account = account.address;
      } else {
        // Use first account from node
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
      }

      console.log(`Blockchain client initialized with contract at ${this.contractAddress}`);
      console.log(`Using account: ${this.account}`);
      
      return true;
    } catch (error) {
      console.error('Error initializing blockchain client:', error);
      return false;
    }
  }

  /**
   * Log a security event to the blockchain
   * @param {string} eventType - Type of security event (e.g., "INTRUSION", "DATA_BREACH")
   * @param {object} eventData - Object containing event details
   * @returns {Promise<string>} - The event ID of the logged event
   */
  async logSecurityEvent(eventType, eventData) {
    try {
      // Convert eventData to string if it's an object
      const eventDataStr = typeof eventData === 'object' 
        ? JSON.stringify(eventData) 
        : eventData;

      // Create transaction
      const tx = this.contract.methods.logEvent(eventType, eventDataStr);
      
      // Estimate gas
      const gas = await tx.estimateGas({ from: this.account });
      
      // Send transaction
      const receipt = await tx.send({
        from: this.account,
        gas: Math.round(gas * 1.2) // Add 20% gas buffer
      });
      
      // Extract event ID from logs
      const eventId = receipt.events.EventLogged.returnValues.eventId;
      
      console.log(`Security event logged with ID: ${eventId}`);
      return eventId;
    } catch (error) {
      console.error('Error logging security event:', error);
      throw error;
    }
  }

  /**
   * Verify the integrity of a logged security event
   * @param {string} eventId - The ID of the event to verify
   * @param {object|string} eventData - The event data to verify against the stored hash
   * @returns {Promise<boolean>} - True if the data matches the stored hash
   */
  async verifySecurityEvent(eventId, eventData) {
    try {
      // Convert eventData to string if it's an object
      const eventDataStr = typeof eventData === 'object' 
        ? JSON.stringify(eventData) 
        : eventData;

      // Call verify function
      const isValid = await this.contract.methods.verifyEvent(eventId, eventDataStr).call({
        from: this.account
      });
      
      return isValid;
    } catch (error) {
      console.error('Error verifying security event:', error);
      throw error;
    }
  }

  /**
   * Get the details of a logged security event
   * @param {string} eventId - The ID of the event to retrieve
   * @returns {Promise<object>} - The event details
   */
  async getSecurityEvent(eventId) {
    try {
      const [id, reporter, timestamp, eventType, eventData, dataHash] = 
        await this.contract.methods.getEvent(eventId).call({ from: this.account });
      
      // Parse event data if it's JSON
      let parsedEventData;
      try {
        parsedEventData = JSON.parse(eventData);
      } catch (e) {
        parsedEventData = eventData;
      }
      
      return {
        id,
        reporter,
        timestamp: new Date(timestamp * 1000).toISOString(),
        eventType,
        eventData: parsedEventData,
        dataHash
      };
    } catch (error) {
      console.error('Error getting security event:', error);
      throw error;
    }
  }

  /**
   * Get all logged security events
   * @returns {Promise<Array>} - Array of event details
   */
  async getAllSecurityEvents() {
    try {
      const eventCount = await this.contract.methods.getEventCount().call();
      const events = [];
      
      for (let i = 0; i < eventCount; i++) {
        const eventId = await this.contract.methods.getEventIdAtIndex(i).call();
        const eventDetails = await this.getSecurityEvent(eventId);
        events.push(eventDetails);
      }
      
      return events;
    } catch (error) {
      console.error('Error getting all security events:', error);
      throw error;
    }
  }
}

module.exports = BlockchainClient;
