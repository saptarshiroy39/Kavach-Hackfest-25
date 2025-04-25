/**
 * Storage Utilities
 * Helper functions for working with localStorage and sessionStorage
 */

/**
 * Store a value in localStorage with type safety
 */
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

/**
 * Retrieve a value from localStorage with type safety
 */
export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error getting localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove an item from localStorage
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Store a value in sessionStorage with type safety
 */
export const setSessionStorage = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error setting sessionStorage:', error);
  }
};

/**
 * Retrieve a value from sessionStorage with type safety
 */
export const getSessionStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = sessionStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error getting sessionStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove an item from sessionStorage
 */
export const removeSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage:', error);
  }
};

/**
 * Clear all items from localStorage and sessionStorage
 */
export const clearAllStorage = (): void => {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

/**
 * Check if storage is available
 */
export const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const testKey = `__storage_test__${Math.random()}`;
    storage.setItem(testKey, 'test');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get total localStorage usage in bytes
 */
export const getLocalStorageUsage = (): number => {
  let total = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          total += key.length + value.length;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating localStorage usage:', error);
  }
  return total;
}; 