/**
 * API Client
 * Central client for making API requests with proper error handling
 */

import { ApiResponse } from '@/types';
import { AUTH_TOKEN_KEY } from '@/config';

// Default headers for API requests
const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Create a unified fetch wrapper with types and error handling
async function fetchWrapper<T>(
  url: string,
  method: string,
  data?: any,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    // Get auth token from storage if available
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    
    // Build headers
    const headers = {
      ...DEFAULT_HEADERS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    };
    
    // Configure request
    const config: RequestInit = {
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
    };
    
    // Make request
    const response = await fetch(url, config);
    
    // Parse JSON response if possible
    let responseData;
    const contentType = response.headers.get('Content-Type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Handle 401 (Unauthorized) responses
    if (response.status === 401) {
      // Clear token and trigger auth event
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('auth-state-changed'));
    }
    
    // Return formatted response
    return {
      data: response.ok ? responseData : undefined,
      error: !response.ok ? responseData?.message || response.statusText : undefined,
      status: response.status,
      success: response.ok,
      message: responseData?.message,
    };
  } catch (error) {
    // Handle network or other errors
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 0,
      success: false,
    };
  }
}

// API client with methods for each HTTP verb
export const apiClient = {
  get: <T>(url: string, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> => 
    fetchWrapper<T>(url, 'GET', undefined, customHeaders),
    
  post: <T>(url: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> => 
    fetchWrapper<T>(url, 'POST', data, customHeaders),
    
  put: <T>(url: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> => 
    fetchWrapper<T>(url, 'PUT', data, customHeaders),
    
  patch: <T>(url: string, data: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> => 
    fetchWrapper<T>(url, 'PATCH', data, customHeaders),
    
  delete: <T>(url: string, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> => 
    fetchWrapper<T>(url, 'DELETE', undefined, customHeaders),
};

export default apiClient; 