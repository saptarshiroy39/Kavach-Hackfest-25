/**
 * Validation Utilities
 * Helper functions for validating data
 */

import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from '@/config';

/**
 * Validate an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a password based on strength criteria
 * Returns an object with validity and reason if invalid
 */
export const validatePassword = (password: string): { isValid: boolean; reason?: string } => {
  if (!password) {
    return { isValid: false, reason: 'Password is required' };
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      reason: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` 
    };
  }
  
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { 
      isValid: false, 
      reason: `Password cannot exceed ${PASSWORD_MAX_LENGTH} characters` 
    };
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      reason: 'Password must contain at least one uppercase letter'
    };
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      reason: 'Password must contain at least one lowercase letter'
    };
  }
  
  // Check for numbers
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      reason: 'Password must contain at least one number'
    };
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      reason: 'Password must contain at least one special character'
    };
  }
  
  return { isValid: true };
};

/**
 * Calculate password strength on a scale of 1-5
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (!password) return strength;
  
  // Length
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Uppercase
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Numbers
  if (/[0-9]/.test(password)) strength += 1;
  
  // Special characters
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return Math.min(strength, 5);
};

/**
 * Validate a username
 */
export const validateUsername = (username: string): { isValid: boolean; reason?: string } => {
  if (!username) {
    return { isValid: false, reason: 'Username is required' };
  }
  
  if (username.length < USERNAME_MIN_LENGTH) {
    return { 
      isValid: false, 
      reason: `Username must be at least ${USERNAME_MIN_LENGTH} characters long` 
    };
  }
  
  if (username.length > USERNAME_MAX_LENGTH) {
    return { 
      isValid: false, 
      reason: `Username cannot exceed ${USERNAME_MAX_LENGTH} characters` 
    };
  }
  
  // Check for valid characters (alphanumeric, underscore, hyphen)
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      isValid: false,
      reason: 'Username can only contain letters, numbers, underscores, and hyphens'
    };
  }
  
  return { isValid: true };
};

/**
 * Validate a URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Validate a phone number (basic validation)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Check if length is valid (10-15 digits)
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate a credit card number using Luhn algorithm
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 13 || digits.length > 19) return false;
  
  // Luhn algorithm implementation
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through digits in reverse
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

/**
 * Validate if a string is a valid hash (SHA-256 format)
 */
export const isValidSha256Hash = (hash: string): boolean => {
  const sha256Regex = /^[a-f0-9]{64}$/i;
  return sha256Regex.test(hash);
};

/**
 * Validate if a string is a valid Ethereum address
 */
export const isValidEthereumAddress = (address: string): boolean => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
}; 