/**
 * Type Definitions Index
 * Central export point for all types
 */

// Re-export all types from their respective files
export * from './auth';
export * from './security';

// Common shared types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface ThemeConfig {
  name: string;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    card: string;
    border: string;
    accent: string;
  };
}

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  action?: {
    label: string;
    url: string;
  };
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'; 