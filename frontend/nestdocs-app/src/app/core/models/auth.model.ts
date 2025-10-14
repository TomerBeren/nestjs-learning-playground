/**
 * Login credentials DTO
 */
export interface LoginDto {
  username: string;
  password: string;
}

/**
 * Login response with JWT token
 */
export interface LoginResponse {
  access_token: string;
}

/**
 * Authenticated user profile
 */
export interface AuthProfile {
  userId: number;
  username: string;
  email?: string;
}
