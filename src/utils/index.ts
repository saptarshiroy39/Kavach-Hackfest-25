/**
 * Utilities Index
 * Central export point for all utility functions
 */

// Re-export all utilities
export * from './format-utils';
export * from './validation-utils';
export * from './error-utils';
export * from './storage-utils';

// Common utility functions

/**
 * Generate a random ID
 */
export const generateId = (prefix = ''): string => {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Delay for the specified number of milliseconds
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  
  return function(...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
      
      previous = now;
      func(...args);
    } else if (timeout === null) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/**
 * Check if an object is empty
 */
export const isEmptyObject = (obj: Record<string, any>): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get browser and OS information
 */
export const getBrowserInfo = (): { browser: string; os: string } => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  
  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) {
    browser = 'Chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    browser = 'Safari';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browser = 'Firefox';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
    browser = 'Internet Explorer';
  } else if (userAgent.indexOf('Edge') > -1) {
    browser = 'Edge';
  }
  
  // Detect OS
  if (userAgent.indexOf('Windows') > -1) {
    os = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    os = 'MacOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    os = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    os = 'Android';
  } else if (userAgent.indexOf('iOS') > -1 || /iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS';
  }
  
  return { browser, os };
}; 