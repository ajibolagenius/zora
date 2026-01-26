import axios, { AxiosInstance } from 'axios';
import { ApiConfig, ApiHeaders } from '../constants';

/**
 * External API client for third-party services
 * Note: For Supabase operations, use the supabaseService instead
 */

// Create a base API client for external services
export const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: ApiConfig.timeout,
    headers: {
      'Content-Type': ApiHeaders.contentType,
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.log('[API] Unauthorized request');
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Generic API client (can be used for external services)
export const api = createApiClient('');

export default api;
