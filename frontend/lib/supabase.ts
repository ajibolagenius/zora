import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Database } from '../types/supabase';

// Supabase configuration
// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

// Initialize with null, will be created lazily when needed
let supabaseInstance: SupabaseClient<Database> | null = null;

// Lazy initialization to avoid SSR issues with AsyncStorage
const getSupabaseClient = async (): Promise<SupabaseClient<Database>> => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

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
  } else {
    // On client side, use AsyncStorage for auth persistence
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

  return supabaseInstance;
};

// Create a synchronous client for initial rendering (without storage)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Export async client getter for full auth functionality
export { getSupabaseClient };

// Export types for convenience
export type { Database };
