/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  data: string;
}
