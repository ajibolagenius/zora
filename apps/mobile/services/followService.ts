/**
 * Follow Service
 * Handles database operations for following vendors
 */

import { getSupabaseFrom, isSupabaseConfigured } from '../lib/supabase';

export const followService = {
  /**
   * Check if user is following a vendor
   */
  isFollowing: async (userId: string, vendorId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // For mock mode, check localStorage or return false
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const follows = JSON.parse(localStorage.getItem('vendor_follows') || '[]');
          return follows.some((f: any) => f.user_id === userId && f.vendor_id === vendorId);
        }
      } catch {
        // Ignore localStorage errors
      }
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    try {
      const { data, error } = await fromMethod('vendor_follows')
        .select('id')
        .eq('user_id', userId)
        .eq('vendor_id', vendorId)
        .maybeSingle();

      if (error) {
        // If table doesn't exist (42P01), return false gracefully
        if (error.code === '42P01') {
          console.warn('vendor_follows table does not exist. Please run migration to create it.');
          return false;
        }
        console.error('Error checking follow status:', error);
        return false;
      }

      return !!data;
    } catch (error: any) {
      // Handle any unexpected errors
      if (error?.code === '42P01') {
        console.warn('vendor_follows table does not exist. Please run migration to create it.');
        return false;
      }
      console.error('Error checking follow status:', error);
      return false;
    }
  },

  /**
   * Follow a vendor
   */
  follow: async (userId: string, vendorId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // For mock mode, store in localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const follows = JSON.parse(localStorage.getItem('vendor_follows') || '[]');
          if (!follows.some((f: any) => f.user_id === userId && f.vendor_id === vendorId)) {
            follows.push({ user_id: userId, vendor_id: vendorId, created_at: new Date().toISOString() });
            localStorage.setItem('vendor_follows', JSON.stringify(follows));
          }
          return true;
        }
      } catch {
        // Ignore localStorage errors
      }
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    try {
      const { error } = await fromMethod('vendor_follows')
        .insert({
          user_id: userId,
          vendor_id: vendorId,
        })
        .select()
        .single();

      if (error) {
        // If table doesn't exist (42P01), return false gracefully
        if (error.code === '42P01') {
          console.warn('vendor_follows table does not exist. Please run migration to create it.');
          return false;
        }
        // If it's a unique constraint error, already following - that's okay
        if (error.code !== '23505') {
          console.error('Error following vendor:', error);
          return false;
        }
      }

      return true;
    } catch (error: any) {
      // Handle any unexpected errors
      if (error?.code === '42P01') {
        console.warn('vendor_follows table does not exist. Please run migration to create it.');
        return false;
      }
      console.error('Error following vendor:', error);
      return false;
    }
  },

  /**
   * Unfollow a vendor
   */
  unfollow: async (userId: string, vendorId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      // For mock mode, remove from localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const follows = JSON.parse(localStorage.getItem('vendor_follows') || '[]');
          const filtered = follows.filter((f: any) => !(f.user_id === userId && f.vendor_id === vendorId));
          localStorage.setItem('vendor_follows', JSON.stringify(filtered));
          return true;
        }
      } catch {
        // Ignore localStorage errors
      }
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    try {
      const { error } = await fromMethod('vendor_follows')
        .delete()
        .eq('user_id', userId)
        .eq('vendor_id', vendorId);

      if (error) {
        // If table doesn't exist (42P01), return false gracefully
        if (error.code === '42P01') {
          console.warn('vendor_follows table does not exist. Please run migration to create it.');
          return false;
        }
        console.error('Error unfollowing vendor:', error);
        return false;
      }

      return true;
    } catch (error: any) {
      // Handle any unexpected errors
      if (error?.code === '42P01') {
        console.warn('vendor_follows table does not exist. Please run migration to create it.');
        return false;
      }
      console.error('Error unfollowing vendor:', error);
      return false;
    }
  },

  /**
   * Get all vendors a user is following
   */
  getFollowing: async (userId: string): Promise<string[]> => {
    if (!isSupabaseConfigured()) {
      // For mock mode, get from localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const follows = JSON.parse(localStorage.getItem('vendor_follows') || '[]');
          return follows
            .filter((f: any) => f.user_id === userId)
            .map((f: any) => f.vendor_id);
        }
      } catch {
        // Ignore localStorage errors
      }
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    try {
      const { data, error } = await fromMethod('vendor_follows')
        .select('vendor_id')
        .eq('user_id', userId);

      if (error) {
        // If table doesn't exist (42P01), return empty array gracefully
        if (error.code === '42P01') {
          console.warn('vendor_follows table does not exist. Please run migration to create it.');
          return [];
        }
        console.error('Error fetching following list:', error);
        return [];
      }

      return (data || []).map((item: any) => item.vendor_id);
    } catch (error: any) {
      // Handle any unexpected errors
      if (error?.code === '42P01') {
        console.warn('vendor_follows table does not exist. Please run migration to create it.');
        return [];
      }
      console.error('Error fetching following list:', error);
      return [];
    }
  },
};
