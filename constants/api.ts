// Zora African Market Design Tokens - API Endpoints & Configuration

/**
 * External API Endpoints
 * Third-party API endpoints used for data fetching
 */
export const ApiEndpoints = {
  // Meal Database API
  mealDb: 'https://www.themealdb.com/api/json/v1/1',
  // Foodish API (food images)
  foodish: 'https://foodish-api.com/api',
  // Platzi API (mock e-commerce)
  platzi: 'https://api.escuelajs.co/api/v1',
  // Dicebear API (avatar generation)
  dicebear: 'https://api.dicebear.com/7.x/avataaars/svg',
  // QR Code API
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/',
  // Google Maps
  googleMaps: 'https://maps.google.com',
} as const;

/**
 * API Configuration
 * Timeouts, retries, and other API-related constants
 */
export const ApiConfig = {
  // Request timeout in milliseconds
  timeout: 30000, // 30 seconds
  // Auth timeout in milliseconds
  authTimeout: 15000, // 15 seconds
  // Retry attempts
  maxRetries: 3,
  // Retry delay in milliseconds
  retryDelay: 1000,
} as const;

/**
 * HTTP Status Codes
 * Common HTTP status codes for reference
 */
export const HttpStatus = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessableEntity: 422,
  internalServerError: 500,
  serviceUnavailable: 503,
} as const;

/**
 * API Headers
 * Standard headers for API requests
 */
export const ApiHeaders = {
  contentType: 'application/json',
  accept: 'application/json',
} as const;

export default {
  endpoints: ApiEndpoints,
  config: ApiConfig,
  status: HttpStatus,
  headers: ApiHeaders,
};
