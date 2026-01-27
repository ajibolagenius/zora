/**
 * Wishlist Service
 * Handles database operations for wishlist/favorites
 */

import { getSupabaseFrom, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types/supabase';

export const wishlistService = {
  /**
   * Get user's wishlist items
   */
  getUserWishlist: async (userId: string): Promise<Product[]> => {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return [];
    }

    const { data, error } = await fromMethod('wishlist_items')
      .select('product_id, products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishlist:', error);
      return [];
    }

    // Extract products from the joined data
    return (data || [])
      .map((item: any) => item.products)
      .filter((product: Product | null) => product !== null);
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    const { error } = await fromMethod('wishlist_items')
      .insert({
        user_id: userId,
        product_id: productId,
      })
      .select()
      .single();

    if (error) {
      // If it's a unique constraint error, item already exists - that's okay
      if (error.code !== '23505') {
        console.error('Error adding to wishlist:', error);
        return false;
      }
    }

    return true;
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    const { error } = await fromMethod('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }

    return true;
  },

  /**
   * Check if product is in wishlist
   */
  isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      return false;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return false;
    }

    const { data } = await fromMethod('wishlist_items')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .limit(1);

    return (data?.length || 0) > 0;
  },

  /**
   * Sync local wishlist with database
   */
  syncWishlist: async (userId: string, productIds: string[]): Promise<void> => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const fromMethod = await getSupabaseFrom();
    if (!fromMethod) {
      return;
    }

    // Get current database wishlist
    const { data: dbItems } = await fromMethod('wishlist_items')
      .select('product_id')
      .eq('user_id', userId);

    const dbProductIds = new Set((dbItems || []).map((item: any) => item.product_id));

    // Add items that are in local but not in database
    const toAdd = productIds.filter((id) => !dbProductIds.has(id));
    if (toAdd.length > 0) {
      await fromMethod('wishlist_items')
        .insert(
          toAdd.map((productId) => ({
            user_id: userId,
            product_id: productId,
          }))
        );
    }

    // Remove items that are in database but not in local
    const toRemove = Array.from(dbProductIds).filter((id) => !productIds.includes(id));
    if (toRemove.length > 0) {
      await fromMethod('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .in('product_id', toRemove);
    }
  },
};
