import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AdvancedSearchService, type SearchSuggestion, SearchAnalytics, PersonalizedRecommendation } from '../services/advancedSearchService';
import type { Product, ProductFilters } from '@zora/api-client';

export interface UseAdvancedSearchOptions {
  userId?: string;
  enableRecommendations?: boolean;
  enableAnalytics?: boolean;
  maxResults?: number;
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

      // Record analytics if enabled
      if (options.enableAnalytics && result.analytics) {
        await AdvancedSearchService.recordSearchAnalytics(result.analytics);
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
  const saveSearch = useCallback((query: string, filters?: ProductFilters) => {
    if (!query.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory: SearchHistory[] = [
        { id: Date.now().toString(), query, timestamp: Date.now(), resultCount: 0, filters },
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
    return AdvancedSearchService.getTrendingSearches().slice(0, 10);
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

// Hook for search performance monitoring
export function useSearchPerformance() {
  const [metrics, setMetrics] = useState({
    averageSearchTime: 0,
    totalSearches: 0,
    successfulSearches: 0,
    errorRate: 0,
  });

  const recordSearchPerformance = useCallback((duration: number, success: boolean) => {
    setMetrics(prev => {
      const newTotalSearches = prev.totalSearches + 1;
      const newSuccessfulSearches = success ? prev.successfulSearches + 1 : prev.successfulSearches;
      const newAverageTime = (prev.averageSearchTime * prev.totalSearches + duration) / newTotalSearches;
      const newErrorRate = ((newTotalSearches - newSuccessfulSearches) / newTotalSearches) * 100;

      return {
        averageSearchTime: newAverageTime,
        totalSearches: newTotalSearches,
        successfulSearches: newSuccessfulSearches,
        errorRate: newErrorRate,
      };
    });
  }, []);

  return {
    metrics,
    recordSearchPerformance,
  };
}
