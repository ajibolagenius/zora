import { productsService } from '@zora/api-client';
import type { Product, ProductFilters } from '@zora/api-client';

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

export interface SearchAnalytics {
  query: string;
  timestamp: number;
  resultCount: number;
  clickedResultIndex?: number;
  sessionDuration?: number;
  userId?: string;
}

export interface PersonalizedRecommendation {
  productId: string;
  score: number;
  reason: string;
  category: string;
  basedOn: 'purchase_history' | 'view_history' | 'cultural_preference' | 'location' | 'similar_products';
}

export class AdvancedSearchService {
  private static readonly TRENDING_SEARCHES = [
    'jollof rice',
    'egusi soup',
    'suya spice',
    'african print fabric',
    'shea butter',
    'nigerian groceries',
    'ghanaian textiles',
    'ethiopian coffee',
    'kenyan crafts',
    'african art',
  ];

  /**
   * Enhanced search with multiple strategies
   */
  static async searchProducts(
    query: string,
    userId?: string,
    filters?: ProductFilters
  ): Promise<{
    results: Product[];
    suggestions: SearchSuggestion[];
    analytics: SearchAnalytics;
    recommendations: PersonalizedRecommendation[];
  }> {
    try {
      // Execute search with different strategies based on query
      const [basicResults, suggestions] = await this.executeSearchStrategies(query, filters);

      // Generate personalized recommendations
      const recommendations = await this.generatePersonalizedRecommendations(userId, query, basicResults);

      // Create analytics record
      const analytics: SearchAnalytics = {
        query,
        timestamp: Date.now(),
        resultCount: basicResults.length,
      };

      return {
        results: basicResults,
        suggestions,
        analytics,
        recommendations,
      };
    } catch (error) {
      console.error('Advanced search error:', error);
      return {
        results: [],
        suggestions: [],
        analytics: { query, timestamp: Date.now(), resultCount: 0 },
        recommendations: []
      };
    }
  }

  /**
   * Execute multiple search strategies
   */
  private static async executeSearchStrategies(
    query: string,
    filters?: ProductFilters
  ): Promise<[Product[], SearchSuggestion[]]> {
    const searchStrategies = [
      () => this.basicSearch(query, filters),
      () => this.fuzzySearch(query, filters),
      () => this.semanticSearch(query, filters),
      () => this.categoryBasedSearch(query, filters),
      () => this.trendingSearch(query, filters),
    ];

    const results = await Promise.allSettled(searchStrategies.map(strategy => strategy()));

    // Combine unique results
    const allResults = results
      .filter((result): result is PromiseFulfilledResult<Product[]> => result.status === 'fulfilled')
      .flatMap(result => result.value);

    const uniqueResults = this.deduplicateResults(allResults);

    // Generate suggestions based on results
    const suggestions = this.generateSuggestions(query, uniqueResults);

    return [uniqueResults, suggestions];
  }

  /**
   * Basic text search
   */
  private static async basicSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      const response = await productsService.getAll({
        search: query,
        ...filters,
        limit: 20,
      });
      return response.data || [];
    } catch (error) {
      console.error('Basic search error:', error);
      return [];
    }
  }

  /**
   * Fuzzy search for typos and variations
   */
  private static async fuzzySearch(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      // Generate fuzzy variations
      const variations = this.generateFuzzyVariations(query);

      const results = await Promise.all(
        variations.map(variation =>
          productsService.getAll({
            search: variation,
            ...filters,
            limit: 10,
          })
        )
      );

      return results.flatMap(response => response.data || []);
    } catch (error) {
      console.error('Fuzzy search error:', error);
      return [];
    }
  }

  /**
   * Semantic search for intent understanding
   */
  private static async semanticSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      // Get all products for semantic analysis
      const allProductsResponse = await productsService.getAll({
        ...filters,
        limit: 100,
      });
      const allProducts = allProductsResponse.data || [];

      const lowerQuery = query.toLowerCase();

      // Define semantic patterns
      const foodPatterns = ['food', 'cook', 'recipe', 'ingredient', 'meal', 'dish', 'rice', 'stew', 'soup', 'spice'];
      const clothingPatterns = ['cloth', 'wear', 'fashion', 'style', 'outfit', 'dress', 'shirt', 'fabric', 'textile'];
      const culturalPatterns = ['african', 'nigerian', 'ghanaian', 'ethiopian', 'kenyan'];

      // Determine query intent
      const isFoodQuery = foodPatterns.some(pattern => lowerQuery.includes(pattern));
      const isClothingQuery = clothingPatterns.some(pattern => lowerQuery.includes(pattern));
      const isCulturalQuery = culturalPatterns.some(pattern => lowerQuery.includes(pattern));

      return allProducts.filter(product => {
        const productText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();

        // 1. If query implies a category, prioritize products in that category
        if (isFoodQuery) {
          const isFoodProduct = product.category?.toLowerCase() === 'food' ||
            product.category?.toLowerCase() === 'groceries' ||
            product.category?.toLowerCase() === 'spices' ||
            productText.includes('food') || productText.includes('ingredient');
          if (isFoodProduct) return true;
        }

        if (isClothingQuery) {
          const isClothingProduct = product.category?.toLowerCase() === 'fashion' ||
            product.category?.toLowerCase() === 'clothing' ||
            product.category?.toLowerCase() === 'textiles' ||
            productText.includes('cloth') || productText.includes('wear');
          if (isClothingProduct) return true;
        }

        // 2. If query implies a culture/region, prioritize products from that region
        if (isCulturalQuery) {
          // Extract which culture is being queried
          const matchedCultures = culturalPatterns.filter(p => lowerQuery.includes(p));
          const isFromRegion = matchedCultures.some(culture => productText.includes(culture));
          if (isFromRegion) return true;
        }

        // 3. Fallback: Basic text match if semantic intent doesn't match this product
        return productText.includes(lowerQuery);
      });
    } catch (error) {
      console.error('Semantic search error:', error);
      return [];
    }
  }

  /**
   * Category-based search optimization
   */
  private static async categoryBasedSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      // Identify category keywords in query
      const categoryKeywords = this.extractCategoryKeywords(query);

      if (categoryKeywords.length === 0) return [];

      // Search for products in identified categories
      const results = await Promise.all(
        categoryKeywords.map(category =>
          productsService.getAll({
            category,
            ...filters,
            limit: 10,
          })
        )
      );

      return results.flatMap(response => response.data || []);
    } catch (error) {
      console.error('Category-based search error:', error);
      return [];
    }
  }

  /**
   * Trending search integration
   */
  private static async trendingSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
    try {
      // Check if query matches trending searches
      const matchingTrending = this.TRENDING_SEARCHES.filter(trending =>
        trending.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(trending.toLowerCase())
      );

      if (matchingTrending.length === 0) return [];

      // Boost results for trending searches
      const results = await Promise.all(
        matchingTrending.map(trending =>
          productsService.getAll({
            search: trending,
            ...filters,
            limit: 5,
          })
        )
      );

      return results.flatMap(response => response.data || []);
    } catch (error) {
      console.error('Trending search error:', error);
      return [];
    }
  }

  /**
   * Generate search suggestions
   */
  private static generateSuggestions(query: string, results: Product[]): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Product suggestions
    results.slice(0, 5).forEach(product => {
      suggestions.push({
        id: product.id,
        text: product.name,
        type: 'product',
        category: product.category,
        vendor: {
          id: product.vendor_id,
          name: product.vendor?.name || 'Unknown Vendor',
          logo_url: product.vendor?.logo_url,
        },
        popularity: Math.random() * 100,
      });
    });

    // Category suggestions
    const categories = [...new Set(results.map(p => p.category).filter(Boolean))];
    categories.slice(0, 3).forEach(category => {
      suggestions.push({
        id: `category-${category}`,
        text: category!,
        type: 'category',
        popularity: Math.random() * 80,
      });
    });

    // Trending suggestions
    const trendingMatches = this.TRENDING_SEARCHES.filter(trending =>
      trending.toLowerCase().includes(queryLower) &&
      !suggestions.some(s => s.text.toLowerCase() === trending.toLowerCase())
    );

    trendingMatches.slice(0, 3).forEach(trending => {
      suggestions.push({
        id: `trending-${trending}`,
        text: trending,
        type: 'trending',
        popularity: 95 + Math.random() * 5,
        metadata: { trending: true },
      });
    });

    return suggestions.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  /**
   * Generate personalized recommendations
   */
  private static async generatePersonalizedRecommendations(
    userId: string | undefined,
    query: string,
    results: Product[]
  ): Promise<PersonalizedRecommendation[]> {
    if (!userId || results.length === 0) return [];

    // Mock personalized recommendations (in production, this would use ML)
    const recommendations: PersonalizedRecommendation[] = [];

    results.slice(0, 5).forEach((product, index) => {
      const reasons = [
        'Based on your viewing history',
        'Similar to items you liked',
        'Popular in your area',
        'Trending in your community',
        'Matches your cultural preferences',
      ];

      recommendations.push({
        productId: product.id,
        score: 0.8 - (index * 0.1),
        reason: reasons[index % reasons.length],
        category: product.category || 'General',
        basedOn: ['view_history', 'similar_products', 'location', 'cultural_preference', 'purchase_history'][index % 5] as any,
      });
    });

    return recommendations;
  }

  /**
   * Generate fuzzy search variations
   */
  private static generateFuzzyVariations(query: string): string[] {
    const variations = [query];

    // Common African food/cultural term variations
    const commonVariations: Record<string, string[]> = {
      'jollof': ['jollof rice', 'jolof', 'jolof rice'],
      'egusi': ['egusi soup', 'egusi seed', 'egusi stew'],
      'suya': ['suya spice', 'suya meat', 'nigerian suya'],
      'fabric': ['textile', 'cloth', 'print'],
      'art': ['craft', 'handmade', 'traditional'],
    };

    const lowerQuery = query.toLowerCase();

    for (const [key, synonyms] of Object.entries(commonVariations)) {
      if (lowerQuery.includes(key)) {
        synonyms.forEach(variation => {
          if (!variations.includes(variation)) {
            variations.push(variation);
          }
        });
      }
    }

    return variations;
  }

  /**
   * Extract category keywords from query
   */
  private static extractCategoryKeywords(query: string): string[] {
    const categoryMap: Record<string, string> = {
      'food': 'food',
      'cook': 'food',
      'recipe': 'food',
      'ingredient': 'groceries',
      'spice': 'spices',
      'cloth': 'clothing',
      'fashion': 'fashion',
      'wear': 'clothing',
      'fabric': 'textiles',
      'art': 'art',
      'craft': 'art',
      'handmade': 'art',
    };

    const keywords: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const [keyword, category] of Object.entries(categoryMap)) {
      if (lowerQuery.includes(keyword)) {
        keywords.push(category);
      }
    }

    return [...new Set(keywords)];
  }

  /**
   * Deduplicate search results
   */
  private static deduplicateResults(results: Product[]): Product[] {
    const seen = new Set<string>();
    return results.filter(product => {
      if (seen.has(product.id)) {
        return false;
      }
      seen.add(product.id);
      return true;
    });
  }

  /**
   * Get trending searches
   */
  static getTrendingSearches(): string[] {
    return this.TRENDING_SEARCHES;
  }

  /**
   * Record search analytics
   */
  static async recordSearchAnalytics(analytics: SearchAnalytics): Promise<void> {
    try {
      // In production, this would send to analytics service
      console.log('Search analytics recorded:', analytics);
    } catch (error) {
      console.error('Failed to record search analytics:', error);
    }
  }
}
