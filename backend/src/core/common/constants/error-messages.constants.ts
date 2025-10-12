/**
 * Standard error messages used throughout the application
 */
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid credentials provided',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_EXPIRED: 'Token has expired',
    TOKEN_INVALID: 'Invalid token',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_FORMAT: 'Invalid format',
    MIN_LENGTH: 'Minimum length not met',
    MAX_LENGTH: 'Maximum length exceeded',
  },
  RESOURCE: {
    NOT_FOUND: 'Resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    FORBIDDEN: 'Access to this resource is forbidden',
  },
  GRAPHQL: {
    COMPLEXITY_EXCEEDED: 'Query complexity limit exceeded',
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to access this field',
  },
} as const;
