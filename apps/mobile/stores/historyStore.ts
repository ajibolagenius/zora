import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';
import { Product } from '../types';

interface HistoryState {
    recentlyViewed: Product[];
    searchHistory: string[];

    // Actions
    addToRecentlyViewed: (product: Product) => void;
    addToSearchHistory: (query: string) => void;
    clearHistory: () => void;
    clearSearchHistory: () => void;
}

const MAX_RECENT_ITEMS = 30;
const MAX_SEARCH_ITEMS = 15;

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            recentlyViewed: [],
            searchHistory: [],

            addToRecentlyViewed: (product) => {
                const { recentlyViewed } = get();
                // Remove duplicate if exists (move to top)
                const filtered = recentlyViewed.filter(p => p.id !== product.id);

                set({
                    recentlyViewed: [product, ...filtered].slice(0, MAX_RECENT_ITEMS),
                });
            },

            addToSearchHistory: (query) => {
                const trimmedQuery = query.trim();
                if (!trimmedQuery) return;

                const { searchHistory } = get();
                // Remove duplicate if exists
                const filtered = searchHistory.filter(q => q.toLowerCase() !== trimmedQuery.toLowerCase());

                set({
                    searchHistory: [trimmedQuery, ...filtered].slice(0, MAX_SEARCH_ITEMS),
                });
            },

            clearHistory: () => set({ recentlyViewed: [] }),
            clearSearchHistory: () => set({ searchHistory: [] }),
        }),
        {
            name: 'zora-history-storage',
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
