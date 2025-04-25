/**
 * Configuration Index
 * Central export point for all configuration settings
 */

export * from './api-keys';
export * from './app-config';
export * from './api-endpoints';

// Global Types
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'hi' | 'zh' | 'ja';

// Constants
export const SESSION_STORAGE_KEY = 'kavach-session';
export const AUTH_TOKEN_KEY = 'auth-token';
export const USER_ROLE_KEY = 'user-role';
export const THEME_KEY = 'kavach-theme';
export const LANGUAGE_KEY = 'kavach-language';

// Validation Constants
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20; 