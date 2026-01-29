import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';
import type { Product } from '../types/supabase';
import { wishlistService } from '../services/wishlistService';
import { useAuthStore } from './authStore';

interface WishlistState {
  items: Product[];
  isLoading: boolean;

  // Actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  syncWithDatabase: () => Promise<void>;
  setItems: (items: Product[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addToWishlist: (product: Product) => {
        const { items } = get();
        // Check if already in wishlist
        if (items.find((item) => item.id === product.id)) {
          return;
        }
        set({ items: [...items, product] });
        
        // Sync with database if available
        get().syncWithDatabase();
      },

      removeFromWishlist: (productId: string) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== productId) });
        
        // Sync with database if available
        get().syncWithDatabase();
      },

      isInWishlist: (productId: string) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      toggleWishlist: (product: Product) => {
        const { isInWishlist, addToWishlist, removeFromWishlist } = get();
        if (isInWishlist(product.id)) {
          removeFromWishlist(product.id);
        } else {
          addToWishlist(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
        get().syncWithDatabase();
      },

      syncWithDatabase: async () => {
        const { items } = get();
        const { user } = useAuthStore.getState();
        
        if (!user?.user_id) {
          return;
        }

        try {
          set({ isLoading: true });
          
          // Sync each item with database
          const productIds = items.map((item) => item.id);
          await wishlistService.syncWishlist(user.user_id, productIds);
        } catch (error) {
          console.error('Error syncing wishlist:', error);
          // Don't throw - wishlist is still functional offline
        } finally {
          set({ isLoading: false });
        }
      },

      setItems: (items: Product[]) => {
        set({ items });
      },
    }),
    {
      name: 'zora-wishlist-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
