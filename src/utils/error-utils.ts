/**
 * Error Handling Utilities
 * Helper functions for handling and reporting errors
 */

/**
 * Custom error class with additional fields
 */
export class AppError extends Error {
  public code: string;
  public status: number;
  public context?: Record<string, any>;
  
  constructor(
    message: string, 
    code = 'UNKNOWN_ERROR', 
    status = 500, 
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.context = context;
    
    // Ensure instanceof works correctly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error codes enum
 */
export enum ErrorCode {
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  
  // API errors
  API_ERROR = 'API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Security errors
  SECURITY_ERROR = 'SECURITY_ERROR',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  
  // System errors
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

/**
 * Convert HTTP status code to error code
 */
export const statusToErrorCode = (status: number): ErrorCode => {
  switch (status) {
    case 400:
      return ErrorCode.INVALID_INPUT;
    case 401:
      return ErrorCode.UNAUTHORIZED;
    case 403:
      return ErrorCode.FORBIDDEN;
    case 404:
      return ErrorCode.NOT_FOUND;
    case 409:
      return ErrorCode.ALREADY_EXISTS;
    case 422:
      return ErrorCode.VALIDATION_ERROR;
    case 500:
    default:
      return ErrorCode.SYSTEM_ERROR;
  }
};

/**
 * Safely log errors without revealing sensitive information
 */
export const safeErrorLog = (error: any, context?: Record<string, any>): void => {
  // Filter out sensitive information
  const sanitizedContext = context ? sanitizeErrorData(context) : undefined;
  
  // Log error
  console.error(
    'Error:', 
    error instanceof Error ? error.message : 'Unknown error',
    'Context:', 
    sanitizedContext || {}
  );
  
  // Log stack trace in development
  if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
    console.error('Stack:', error.stack);
  }
};

/**
 * Sanitize error data to remove sensitive information
 */
const sensitiveKeys = [
  'password', 'token', 'secret', 'key', 'auth', 'credential', 'jwt', 
  'session', 'cookie', 'pin', 'ssn', 'credit', 'card', 'cvv'
];

export const sanitizeErrorData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Check if key contains sensitive information
    const isSensitive = sensitiveKeys.some(sensKey => 
      key.toLowerCase().includes(sensKey.toLowerCase())
    );
    
    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeErrorData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Format error for display to users
 */
export const formatUserError = (error: any): { message: string; code?: string } => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'ERROR',
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'ERROR',
    };
  }
  
  return {
    message: 'An unexpected error occurred. Please try again later.',
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Global error handler for async functions
 */
export const asyncErrorHandler = <T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<T> => {
  return asyncFn().catch(error => {
    if (errorHandler) {
      errorHandler(error);
    } else {
      safeErrorLog(error);
    }
    throw error;
  });
}; 