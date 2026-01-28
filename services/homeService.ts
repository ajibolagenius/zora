/**
 * Home Service
 * Handles database operations for home screen with real-time updates
 */

import { getSupabaseFrom, isSupabaseConfigured } from '../lib/supabase';
import { realtimeService } from './realtimeService';
import { vendorService, productService } from './supabaseService';
import { onboardingService } from './onboardingService';
import mockDatabase from '../data/mock_database.json';
import type { Vendor, Product } from '../types/supabase';
import type { Region } from './onboardingService';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  badge: string;
  badge_style: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  order: number;
}

export interface HomeData {
  banners: Banner[];
  regions: Region[];
  featured_vendors: Vendor[];
  popular_products: Product[];
}

export const homeService = {
  /**
   * Fetch all home screen data
   * Optimized to fetch in parallel for faster loading
   */
  getHomeData: async (userRegion?: string): Promise<HomeData> => {
    // Fetch banners (using mock data for now - can be moved to DB later)
    const banners = mockDatabase.banners
      ?.filter((b: any) => b.is_active)
      .sort((a: any, b: any) => a.order - b.order) || [];

    // Fetch all data in parallel for faster loading
    const [regions, featured_vendors, popular_products] = await Promise.all([
      onboardingService.getRegions(),
      vendorService.getFeatured(userRegion, 10),
      productService.getFeatured(userRegion, 20),
    ]);

    return {
      banners,
      regions,
      featured_vendors,
      popular_products,
    };
  },

  /**
   * Fetch more products for infinite scrolling
   */
  getMoreProducts: async (
    userRegion?: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      // For mock data, return empty array after initial batch
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    // Fetch products with pagination
    let query = fromMethod('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching more products:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Subscribe to real-time updates for home screen data
   */
  subscribeToHomeUpdates: async (
    callback: (data: Partial<HomeData>) => void,
    userRegion?: string
  ): Promise<() => void> => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to vendors updates
    if (isSupabaseConfigured()) {
      const unsubVendors = await realtimeService.subscribeToTable(
        'vendors',
        '*',
        async () => {
          const featured_vendors = await vendorService.getFeatured(userRegion, 10);
          callback({ featured_vendors });
        }
      );
      if (unsubVendors) unsubscribers.push(unsubVendors);
    }

    // Subscribe to products updates
    if (isSupabaseConfigured()) {
      const unsubProducts = await realtimeService.subscribeToTable(
        'products',
        '*',
        async () => {
          const popular_products = await productService.getFeatured(userRegion, 20);
          callback({ popular_products });
        }
      );
      if (unsubProducts) unsubscribers.push(unsubProducts);
    }

    // Subscribe to regions updates
    const unsubRegions = onboardingService.subscribeToRegions((regions) => {
      callback({ regions });
    });
    if (unsubRegions) unsubscribers.push(unsubRegions);

    // Return unsubscribe function
    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === 'function') {
          unsub();
        }
      });
    };
  },

  /**
   * Get user's default delivery address for location display
   */
  getUserLocation: async (userId: string): Promise<{ city: string; postcode: string } | null> => {
    if (!isSupabaseConfigured()) {
      return { city: 'London', postcode: 'SW9 7AB' }; // Default mock location
    }

    const addresses = await onboardingService.getUserAddresses(userId);
    const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];

    if (defaultAddress) {
      return {
        city: defaultAddress.city,
        postcode: defaultAddress.postcode,
      };
    }

    return null;
  },
};
