import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '../types/supabase';

// Supabase configuration
// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Placeholder values that indicate unconfigured credentials
const PLACEHOLDER_URL = 'https://your-project.supabase.co';
const PLACEHOLDER_KEY = 'your_supabase_anon_key_here';

/**
 * Check if Supabase credentials are properly configured
 * @returns true if credentials appear valid, false otherwise
 */
export const isSupabaseConfigured = (): boolean => {
  // Check if URL is missing or is the placeholder
  if (!supabaseUrl || supabaseUrl === PLACEHOLDER_URL) {
    return false;
  }
  
  // Check if key is missing or is the placeholder
  if (!supabaseAnonKey || supabaseAnonKey === PLACEHOLDER_KEY) {
    return false;
  }
  
  // Basic URL format validation
  try {
    const url = new URL(supabaseUrl);
    if (!url.hostname.includes('supabase')) {
      return false;
    }
  } catch {
    return false;
  }
  
  return true;
};

/**
 * Get a descriptive error message for missing credentials
 */
export const getCredentialsError = (): string => {
  if (!supabaseUrl || supabaseUrl === PLACEHOLDER_URL) {
    return 'Supabase URL is not configured. Please update EXPO_PUBLIC_SUPABASE_URL in your .env file.';
  }
  if (!supabaseAnonKey || supabaseAnonKey === PLACEHOLDER_KEY) {
    return 'Supabase API key is not configured. Please update EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.';
  }
  return 'Supabase credentials are invalid. Please check your .env file configuration.';
};

// Initialize with null, will be created lazily when needed
let supabaseInstance: SupabaseClient<Database> | null = null;

// Lazy initialization to avoid SSR issues with AsyncStorage
const getSupabaseClient = async (): Promise<SupabaseClient<Database>> => {
  // Validate credentials before creating client
  if (!isSupabaseConfigured()) {
    throw new Error(getCredentialsError());
  }

  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    // Only import AsyncStorage when needed (not during SSR)
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      // During SSR, create a client without auth storage
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      });
    } else if (Platform.OS === 'web') {
      // On web client, use localStorage (no need for AsyncStorage)
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      });
    } else {
      // On native, use AsyncStorage for auth persistence
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      });
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Fallback to basic client without storage
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseInstance;
};

// For backwards compatibility, export a getter that returns the singleton instance
// This avoids creating multiple GoTrueClient instances
export const supabase = {
  get auth() {
    if (!supabaseInstance) {
      console.warn('Supabase client not initialized. Call getSupabaseClient() first.');
    }
    return supabaseInstance?.auth;
  },
  get from() {
    return supabaseInstance?.from.bind(supabaseInstance);
  },
};

// Export async client getter for full auth functionality
export { getSupabaseClient };

// Export types for convenience
export type { Database };
