/**
 * Onboarding Service
 * Handles database operations for onboarding flow:
 * - Heritage/Regions selection
 * - Product categories selection
 * - Delivery location setup
 */

import { getSupabaseFrom, getSupabaseRpc, isSupabaseConfigured } from '../lib/supabase';
import { getSupabaseClient } from '../lib/supabase';
import { realtimeService } from './realtimeService';

export interface Region {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  flag_emoji: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  country: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
}

export const onboardingService = {
  /**
   * Fetch all active regions from database
   */
  getRegions: async (): Promise<Region[]> => {
    if (!isSupabaseConfigured()) {
      // Return mock regions for development
      return [
        {
          id: 'west-africa',
          name: 'West Africa',
          slug: 'west-africa',
          description: 'Nigeria, Ghana, Senegal, Mali...',
          flag_emoji: '🇬🇭',
          image_url: null,
          display_order: 1,
        },
        {
          id: 'east-africa',
          name: 'East Africa',
          slug: 'east-africa',
          description: 'Kenya, Ethiopia, Tanzania, Uganda...',
          flag_emoji: '🇰🇪',
          image_url: null,
          display_order: 2,
        },
        {
          id: 'southern-africa',
          name: 'Southern Africa',
          slug: 'southern-africa',
          description: 'South Africa, Zimbabwe, Botswana...',
          flag_emoji: '🇿🇦',
          image_url: null,
          display_order: 3,
        },
        {
          id: 'central-africa',
          name: 'Central Africa',
          slug: 'central-africa',
          description: 'Congo, Cameroon, Gabon...',
          flag_emoji: '🇨🇲',
          image_url: null,
          display_order: 4,
        },
        {
          id: 'north-africa',
          name: 'North Africa',
          slug: 'north-africa',
          description: 'Morocco, Egypt, Tunisia, Algeria...',
          flag_emoji: '🇪🇬',
          image_url: null,
          display_order: 5,
        },
      ];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    const { data, error } = await fromMethod('regions')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching regions:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Fetch all active categories from database
   */
  getCategories: async (): Promise<Category[]> => {
    if (!isSupabaseConfigured()) {
      // Return mock categories for development
      return [
        {
          id: 'traditional-ingredients',
          name: 'Traditional Ingredients',
          slug: 'traditional-ingredients',
          description: 'Authentic African ingredients',
          icon: null,
          image_url: null,
          display_order: 1,
        },
        {
          id: 'spices-seasonings',
          name: 'Spices & Seasonings',
          slug: 'spices-seasonings',
          description: 'African spices and seasonings',
          icon: null,
          image_url: null,
          display_order: 2,
        },
        {
          id: 'beverages',
          name: 'Beverages',
          slug: 'beverages',
          description: 'African drinks',
          icon: null,
          image_url: null,
          display_order: 3,
        },
        {
          id: 'beauty-skincare',
          name: 'Beauty & Skincare',
          slug: 'beauty-skincare',
          description: 'Natural beauty products',
          icon: null,
          image_url: null,
          display_order: 4,
        },
        {
          id: 'fashion-textiles',
          name: 'Fashion & Textiles',
          slug: 'fashion-textiles',
          description: 'African fabrics and clothing',
          icon: null,
          image_url: null,
          display_order: 5,
        },
        {
          id: 'art-crafts',
          name: 'Art & Crafts',
          slug: 'art-crafts',
          description: 'Handmade African art',
          icon: null,
          image_url: null,
          display_order: 6,
        },
      ];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    const { data, error } = await fromMethod('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Save selected regions to user profile
   */
  saveHeritageSelection: async (userId: string, regionSlugs: string[]): Promise<void> => {
    if (!isSupabaseConfigured()) {
      console.log('Mock: Saving heritage selection:', regionSlugs);
      return;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return;
    }

    const { error } = await fromMethod('profiles')
      .update({
        cultural_interests: regionSlugs,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving heritage selection:', error);
      throw error;
    }
  },

  /**
   * Save selected categories to user profile
   */
  saveCategorySelection: async (userId: string, categorySlugs: string[]): Promise<void> => {
    if (!isSupabaseConfigured()) {
      console.log('Mock: Saving category selection:', categorySlugs);
      return;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return;
    }

    const { error } = await fromMethod('profiles')
      .update({
        preferred_categories: categorySlugs,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving category selection:', error);
      throw error;
    }
  },

  /**
   * Save delivery address
   */
  saveDeliveryAddress: async (
    userId: string,
    addressData: {
      label: string;
      full_name: string;
      phone: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      postcode: string;
      country?: string;
      latitude?: number;
      longitude?: number;
      is_default?: boolean;
    }
  ): Promise<Address> => {
    if (!isSupabaseConfigured()) {
      console.log('Mock: Saving delivery address:', addressData);
      return {
        id: 'mock-address-' + Date.now(),
        user_id: userId,
        ...addressData,
        address_line2: addressData.address_line2 || null,
        country: addressData.country || 'United Kingdom',
        is_default: addressData.is_default ?? true,
        latitude: addressData.latitude || null,
        longitude: addressData.longitude || null,
      } as Address;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      throw new Error('Supabase client not available');
    }

    // If setting as default, unset other defaults first
    if (addressData.is_default) {
      await fromMethod('addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_default', true);
    }

    const { data, error } = await fromMethod('addresses')
      .insert({
        user_id: userId,
        label: addressData.label,
        full_name: addressData.full_name,
        phone: addressData.phone,
        address_line1: addressData.address_line1,
        address_line2: addressData.address_line2 || null,
        city: addressData.city,
        postcode: addressData.postcode,
        country: addressData.country || 'United Kingdom',
        latitude: addressData.latitude || null,
        longitude: addressData.longitude || null,
        is_default: addressData.is_default ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving delivery address:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get nearby vendors based on location
   */
  getNearbyVendors: async (
    latitude: number,
    longitude: number,
    radiusKm: number = 10
  ): Promise<any[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const rpcMethod = await getSupabaseRpc();
    if (!rpcMethod) {
      return [];
    }

    const { data, error } = await rpcMethod('get_nearby_vendors', {
      user_lat: latitude,
      user_lng: longitude,
      radius_km: radiusKm,
    });

    if (error) {
      console.error('Error fetching nearby vendors:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Subscribe to regions updates
   */
  subscribeToRegions: (callback: (regions: Region[]) => void) => {
    if (!isSupabaseConfigured()) {
      return () => { }; // Return no-op unsubscribe
    }

    realtimeService.subscribeToTable('regions', '*', (payload) => {
      // Refetch regions when updated
      onboardingService.getRegions().then(callback);
    });

    // Return unsubscribe function
    return () => {
      // Unsubscribe handled by realtimeService
    };
  },

  /**
   * Subscribe to categories updates
   */
  subscribeToCategories: (callback: (categories: Category[]) => void) => {
    if (!isSupabaseConfigured()) {
      return () => { }; // Return no-op unsubscribe
    }

    realtimeService.subscribeToTable('categories', '*', (payload) => {
      // Refetch categories when updated
      onboardingService.getCategories().then(callback);
    });

    // Return unsubscribe function
    return () => {
      // Unsubscribe handled by realtimeService
    };
  },

  /**
   * Subscribe to user address updates
   */
  subscribeToAddresses: (userId: string, callback: (addresses: Address[]) => void) => {
    if (!isSupabaseConfigured()) {
      return () => { }; // Return no-op unsubscribe
    }

    realtimeService.subscribeToTable(
      'addresses',
      '*',
      (payload) => {
        // Refetch addresses when updated
        onboardingService.getUserAddresses(userId).then(callback);
      },
      `user_id=eq.${userId}`
    );

    // Return unsubscribe function
    return () => {
      // Unsubscribe handled by realtimeService
    };
  },

  /**
   * Get user addresses
   */
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    const { data, error } = await fromMethod('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }

    return data || [];
  },
};
