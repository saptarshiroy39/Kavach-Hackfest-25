/**
 * Format Utilities
 * Helper functions for formatting data
 */

import { format, formatDistance, formatRelative } from 'date-fns';

/**
 * Format a date to a standard format
 */
export const formatDate = (date: string | Date, formatStr = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date relative to now (e.g. "2 days ago")
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a date relative to a base date
 */
export const formatRelativeDateToBase = (date: string | Date, baseDate: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const baseDateObj = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;
    return formatRelative(dateObj, baseDateObj);
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

/**
 * Format a number with commas for thousands separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Format a file size in bytes to a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format a URL to remove protocol and trailing slash
 */
export const formatUrl = (url: string): string => {
  return url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
};

/**
 * Format a credit card number to hide all but last 4 digits
 */
export const formatCreditCard = (cardNumber: string): string => {
  const last4 = cardNumber.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

/**
 * Format a string to truncate if longer than maxLength
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Format a phone number to standard format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if cannot format
  return phoneNumber;
}; 