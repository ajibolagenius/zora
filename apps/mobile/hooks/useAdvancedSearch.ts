import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdvancedSearchService, type SearchSuggestion, SearchAnalytics, PersonalizedRecommendation } from '../services/advancedSearchService';
import type { Product, ProductFilters } from '../types';

export interface UseAdvancedSearchOptions {
    userId?: string;
    enableRecommendations?: boolean;
    enableAnalytics?: boolean;
    maxResults?: number;
}

export interface SearchSuggestion {
    id: string;
    text: string;
    type: 'product' | 'category' | 'vendor' | 'trending';
    category?: string;
    vendor?: {
        id: string;
        name: string;
        logo_url?: string;
    };
    popularity?: number;
    metadata?: {
        trending?: boolean;
        recentlyViewed?: boolean;
        isSponsored?: boolean;
    };
}

export interface SearchHistory {
    id: string;
    query: string;
    timestamp: number;
    resultCount: number;
    filters?: ProductFilters;
}

export function useAdvancedSearch(options: UseAdvancedSearchOptions = {}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
    const [savedSearches, setSavedSearches] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Enhanced search function
    const performSearch = useCallback(async (query: string, filters?: ProductFilters) => {
        if (!query.trim()) return;

        setIsSearching(true);

        try {
            const result = await AdvancedSearchService.searchProducts(query, options.userId, filters);

            // Update search history
            if (query.trim()) {
                setSearchHistory(prev => {
                    const newHistory: SearchHistory[] = [
                        { id: Date.now().toString(), query, timestamp: Date.now(), resultCount: result.results.length, filters },
                        ...prev.slice(0, 19)
                    ];
                    return newHistory;
                });
            }

            // Save to saved searches if significant
            if (query.length > 3 && result.results.length > 0) {
                setSavedSearches(prev => {
                    const exists = prev.some(s => s === query);
                    if (!exists) {
                        return [...prev, query];
                    }
                    return prev;
                });
            }

            return result;
        } catch (error) {
            console.error('Advanced search error:', error);
            return { results: [], suggestions: [], analytics: null, recommendations: [] };
        } finally {
            setIsSearching(false);
        }
    }, [options]);

    // Get search suggestions with debouncing
    const getSuggestions = useCallback(async (query: string) => {
        if (query.length < 2) return [];

        try {
            const result = await AdvancedSearchService.searchProducts(query, options.userId);
            return result.suggestions.filter(s => s.type === 'product').slice(0, 5);
        } catch (error) {
            console.error('Error getting suggestions:', error);
            return [];
        }
    }, [options]);

    // Clear search history
    const clearSearchHistory = useCallback(() => {
        setSearchHistory([]);
    }, []);

    // Clear saved searches
    const clearSavedSearches = useCallback(() => {
        setSavedSearches([]);
    }, []);

    // Save search to history
    const saveSearch = useCallback((query: string) => {
        if (!query.trim()) return;

        setSearchHistory(prev => {
            const newHistory: SearchHistory[] = [
                { id: Date.now().toString(), query, timestamp: Date.now(), resultCount: 0 },
                ...prev.slice(0, 19)
            ];
            return newHistory;
        });
    }, []);

    // Remove item from search history
    const removeFromSearchHistory = useCallback((id: string) => {
        setSearchHistory(prev => prev.filter(item => item.id !== id));
    }, []);

    // Get trending searches
    const getTrendingSearches = useCallback((): string[] => {
        return AdvancedSearchService.TRENDING_SEARCHES.slice(0, 10);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        searchHistory,
        savedSearches,
        isSearching,
        performSearch,
        getSuggestions,
        clearSearchHistory,
        clearSavedSearches,
        saveSearch,
        removeFromSearchHistory,
        getTrendingSearches,
    };
}
