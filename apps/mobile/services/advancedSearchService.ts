import { productService } from './supabaseService';
import type { Product, ProductFilters } from '../types';

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
    private static readonly MAX_SEARCH_HISTORY = 50;
    private static readonly MAX_SAVED_SEARCHES = 20;
    private static readonly TRENDING_SEARCHES = ['jollof rice', 'egusi stew', 'suya spice', 'palm oil', 'akara fufu', 'injera bread', 'shito peri peri'];

    /**
     * Enhanced search with multiple algorithms
     */
    static async searchProducts(query: string, userId?: string, filters?: ProductFilters): Promise<{
        results: Product[];
        suggestions: SearchSuggestion[];
        analytics: SearchAnalytics;
    }> {
        const startTime = Date.now();

        try {
            // Log search analytics
            const analytics: SearchAnalytics = {
                query,
                timestamp: startTime,
                userId,
                resultCount: 0,
            };

            // Execute search with different strategies based on query
            const [basicResults, suggestions] = await this.executeSearchStrategies(query, filters);

            // Generate personalized recommendations
            const recommendations = await this.generatePersonalizedRecommendations(userId, query, basicResults);

            // Update analytics
            analytics.resultCount = basicResults.length;
            analytics.sessionDuration = Date.now() - startTime;

            return {
                results: basicResults,
                suggestions,
                recommendations,
                analytics,
            };
        } catch (error) {
            console.error('Advanced search error:', error);
            throw error;
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

        const results = await Promise.all(searchStrategies.map(strategy => strategy()));

        // Combine and deduplicate results
        const allResults = results.flat();
        const uniqueResults = Array.from(new Map(allResults.map(p => [p.id, p])).values());

        // Generate suggestions based on results
        const suggestions = this.generateSuggestions(query, uniqueResults);

        return [uniqueResults, suggestions];
    }

    /**
     * Basic text search with exact matching
     */
    private static async basicSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
        const allProducts = await productService.getAll();

        let filtered = allProducts;

        // Apply filters
        if (filters) {
            filtered = this.applyProductFilters(filtered, filters);
        }

        // Basic text search
        if (query.trim()) {
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

            filtered = filtered.filter(product => {
                const searchText = `${product.name} ${product.description || ''} ${product.category || ''}`.toLowerCase();

                return searchTerms.every(term => searchText.includes(term));
            });
        }

        return filtered;
    }

    /**
     * Fuzzy search for typos and variations
     */
    private static async fuzzySearch(query: string, filters?: ProductFilters): Promise<Product[]> {
        const allProducts = await productService.getAll();

        if (!query.trim()) return [];

        const searchTerms = query.toLowerCase().split(' ');

        // Simple fuzzy matching implementation
        return allProducts.filter(product => {
            const searchText = `${product.name} ${product.description || ''}`.toLowerCase();

            // Calculate fuzzy match score
            let score = 0;
            for (const term of searchTerms) {
                if (searchText.includes(term)) {
                    score += term.length * 2; // Exact match gets higher score
                } else if (this.isFuzzyMatch(term, searchText)) {
                    score += term.length * 1; // Fuzzy match gets lower score
                }
            }

            return score >= Math.max(...searchTerms.map(t => t.length)) * 0.3;
        });
    }

    /**
     * Semantic search understanding intent
     */
    private static async semanticSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
        const allProducts = await productService.getAll();

        if (!query.trim()) return [];

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
            // (Only if semantic intent was NOT found, or as a secondary check)
            return productText.includes(lowerQuery);
        });
    }

    /**
     * Category-based search optimization
     */
    private static async categoryBasedSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
        const allProducts = await productService.getAll();

        if (!filters?.category) return [];

        // Get products in the searched category
        const categoryProducts = allProducts.filter(p =>
            p.category?.toLowerCase() === filters.category.toLowerCase()
        );

        // Boost category products in search results
        const otherProducts = allProducts.filter(p =>
            p.category?.toLowerCase() !== filters.category.toLowerCase()
        );

        // Search within category products first, then others
        const searchInCategory = query.toLowerCase();
        const categoryResults = categoryProducts.filter(product =>
            `${product.name} ${product.description || ''}`.toLowerCase().includes(searchInCategory)
        );

        const otherResults = otherProducts.filter(product =>
            `${product.name} ${product.description || ''}`.toLowerCase().includes(searchInCategory)
        );

        return [...categoryResults, ...otherResults];
    }

    /**
     * Trending and popular products search
     */
    private static async trendingSearch(query: string, filters?: ProductFilters): Promise<Product[]> {
        const allProducts = await productService.getAll();

        // If query matches trending items, prioritize them
        const matchingTrending = this.TRENDING_SEARCHES.filter(trending =>
            query.toLowerCase().includes(trending.toLowerCase())
        );

        if (matchingTrending.length > 0) {
            const trendingProducts = allProducts.filter(product =>
                matchingTrending.some(trending =>
                    product.name.toLowerCase().includes(trending.toLowerCase()) ||
                    product.description?.toLowerCase().includes(trending.toLowerCase())
                )
            );

            return trendingProducts.slice(0, 10); // Limit trending results
        }

        // Otherwise, do normal search
        return this.basicSearch(query, filters);
    }

    /**
     * Generate intelligent suggestions
     */
    private static generateSuggestions(query: string, results: Product[]): SearchSuggestion[] {
        const suggestions: SearchSuggestion[] = [];
        const queryLower = query.toLowerCase();

        // Add trending suggestions if query is short
        if (query.length <= 3) {
            this.TRENDING_SEARCHES.slice(0, 5).forEach(trending => {
                suggestions.push({
                    id: `trending-${trending}`,
                    text: trending,
                    type: 'trending',
                    popularity: Math.random() * 100,
                    metadata: { trending: true },
                });
            });
        }

        // Add category suggestions based on query
        const categories = [...new Set(results.map(p => p.category).filter(Boolean))];
        categories.slice(0, 3).forEach(category => {
            suggestions.push({
                id: `category-${category}`,
                text: `Browse ${category}`,
                type: 'category',
                category,
            });
        });

        // Add product suggestions from results
        const topResults = results.slice(0, 5);
        topResults.forEach((product, index) => {
            const score = this.calculateSuggestionScore(query, product);
            suggestions.push({
                id: product.id,
                text: product.name,
                type: 'product',
                popularity: index === 0 ? 100 : 100 - (index * 20),
                vendor: {
                    id: product.vendor_id,
                    name: product.vendor?.shop_name || 'Unknown Vendor',
                    logo_url: product.vendor?.cover_image_url,
                },
            });
        });

        // Add "did you mean" suggestions for common typos
        const commonTypos = this.getCommonTypos(query);
        commonTypos.forEach(typo => {
            suggestions.push({
                id: `typo-${typo}`,
                text: `Did you mean: ${typo}?`,
                type: 'product',
            });
        });

        return suggestions;
    }

    /**
     * Calculate suggestion relevance score
     */
    private static calculateSuggestionScore(query: string, product: Product): number {
        const queryLower = query.toLowerCase();
        const productName = product.name.toLowerCase();
        const productDesc = (product.description || '').toLowerCase();

        let score = 0;

        // Exact name match
        if (productName === queryLower) score += 50;

        // Partial name match
        if (productName.includes(queryLower)) score += 30;

        // Description match
        if (productDesc.includes(queryLower)) score += 20;

        // Category match
        if (product.category && product.category.toLowerCase().includes(queryLower)) score += 15;

        // Length bonus (shorter queries get more specific matches)
        if (queryLower.length <= 3) score += 10;

        return score;
    }

    /**
     * Get common typo corrections
     */
    private static getCommonTypos(query: string): string[] {
        const typoMap: Record<string, string> = {
            'jollof': 'jollof rice',
            'egusi': 'egusi stew',
            'suya': 'suya spice',
            'palm': 'palm oil',
            'akara': 'akara fufu',
            'fufu': 'fufu',
            'injera': 'injera bread',
            'shito': 'shito peri peri',
            'bread': 'injera bread',
        };

        return Object.keys(typoMap).filter(key =>
            query.toLowerCase().includes(key) && typoMap[key] !== query.toLowerCase()
        );
    }

    /**
     * Check if two strings are fuzzy matches
     */
    private static isFuzzyMatch(str1: string, str2: string): boolean {
        if (str1.length === 0 || str2.length === 0) return false;

        let matches = 0;
        const maxDistance = Math.floor(Math.max(str1.length, str2.length) / 3);

        for (let i = 0; i < str1.length; i++) {
            for (let j = 0; j < str2.length; j++) {
                if (str1[i] === str2[j]) {
                    matches++;
                }
            }
        }

        return matches >= Math.max(str1.length, str2.length) - maxDistance;
    }

    /**
     * Apply product filters to results
     */
    private static applyProductFilters(products: Product[], filters?: ProductFilters): Product[] {
        if (!filters) return products;

        return products.filter(product => {
            // Category filter
            if (filters.category && product.category?.toLowerCase() !== filters.category.toLowerCase()) {
                return false;
            }

            // Region filter
            if (filters.region && product.cultural_region &&
                !product.cultural_region.toLowerCase().includes(filters.region.toLowerCase())) {
                return false;
            }

            // Price range filter
            if (filters.minPrice !== undefined && product.price < filters.minPrice) {
                return false;
            }
            if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
                return false;
            }

            // Rating filter
            if (filters.minRating !== undefined && (product.rating || 0) < filters.minRating) {
                return false;
            }

            // Stock filter
            if (filters.inStock && !product.in_stock) {
                return false;
            }

            return true;
        });
    }

    /**
     * Generate personalized recommendations based on user history and preferences
     */
    private static async generatePersonalizedRecommendations(
        userId: string | undefined,
        query: string,
        searchResults: Product[]
    ): Promise<PersonalizedRecommendation[]> {

        if (!userId) return [];

        try {
            // This would integrate with user's purchase history, view history, and preferences
            // For now, return basic recommendations based on search results

            const recommendations: PersonalizedRecommendation[] = [];

            // Recommend products from same category as searched items
            const searchCategories = [...new Set(searchResults.map(p => p.category).filter(Boolean))];
            const sameCategoryProducts = searchResults.filter(product =>
                searchCategories.includes(product.category)
            );

            sameCategoryProducts.slice(0, 3).forEach(product => {
                recommendations.push({
                    productId: product.id,
                    score: 85,
                    reason: 'Similar category product',
                    category: product.category || 'general',
                    basedOn: 'similar_products',
                });
            });

            // Recommend highly rated products
            const highRatedProducts = searchResults
                .filter(p => (p.rating || 0) >= 4.5)
                .slice(0, 2);

            highRatedProducts.forEach(product => {
                recommendations.push({
                    productId: product.id,
                    score: 90,
                    reason: 'Highly rated product',
                    category: product.category || 'general',
                    basedOn: 'view_history',
                });
            });

            return recommendations;
        } catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }
}
