import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    Clock,
    TrendUp,
    Filter,
    ChevronDown,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { useAdvancedSearch, useSearchPerformance } from '../../hooks/useAdvancedSearch';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface AdvancedSearchProps {
    className?: string;
    onSearch?: (query: string, results: any[]) => void;
    placeholder?: string;
    showFilters?: boolean;
    maxResults?: number;
}

export function AdvancedSearch({
    className,
    onSearch,
    placeholder = "Search for African products, food, clothing, crafts...",
    showFilters: initialShowFilters = true,
    maxResults = 10,
}: AdvancedSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showFiltersDropdown, setShowFiltersDropdown] = useState(initialShowFilters);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const {
        searchQuery,
        setSearchQuery,
        searchHistory,
        savedSearches,
        isSearching,
        performSearch,
        getSuggestions,
        clearSearchHistory,
        removeFromSearchHistory,
        getTrendingSearches,
    } = useAdvancedSearch({
        enableRecommendations: true,
        enableAnalytics: true,
        maxResults,
    });

    const { recordSearchPerformance } = useSearchPerformance();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    // Handle search input changes
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setShowSuggestions(value.length >= 2);

        if (value.length >= 2) {
            const startTime = performance.now();
            getSuggestions(value).then(results => {
                setSuggestions(results.map(r => r.text));
                recordSearchPerformance(performance.now() - startTime, true);
            });
        } else {
            setSuggestions([]);
        }
    }, [setSearchQuery, getSuggestions, recordSearchPerformance]);

    // Handle search submission
    const handleSearch = useCallback(async (queryOverride?: string) => {
        const queryToSearch = queryOverride || searchQuery;
        if (!queryToSearch.trim()) return;

        const startTime = performance.now();
        setIsOpen(false);
        setShowSuggestions(false);
        // Ensure state matches what we are searching (if triggered by click)
        if (queryOverride) {
            setSearchQuery(queryOverride);
        }

        try {
            const filters = {
                category: selectedCategory || undefined,
                minPrice: selectedPriceRange ? parseFloat(selectedPriceRange.split('-')[0]) : undefined,
                maxPrice: selectedPriceRange ? parseFloat(selectedPriceRange.split('-')[1]) : undefined,
                region: selectedRegion || undefined,
            };

            const result = await performSearch(queryToSearch, filters);
            setSearchResults(result.results);
            setRecommendations(result.recommendations);

            recordSearchPerformance(performance.now() - startTime, true);
            onSearch?.(queryToSearch, result.results);
        } catch (error) {
            recordSearchPerformance(performance.now() - startTime, false);
        }
    }, [searchQuery, selectedCategory, selectedPriceRange, selectedRegion, performSearch, recordSearchPerformance, onSearch, setSearchQuery]);

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback((suggestion: string) => {
        handleSearch(suggestion);
    }, [handleSearch]);

    // Handle history item selection
    const handleHistorySelect = useCallback((item: any) => {
        handleSearch(item.query);
    }, [handleSearch]);

    // Handle trending search selection
    const handleTrendingSelect = useCallback((trending: string) => {
        handleSearch(trending);
    }, [handleSearch]);

    // Clear search
    const handleClear = useCallback(() => {
        setSearchQuery('');
        setShowSuggestions(false);
        setSearchResults([]);
        setRecommendations([]);
    }, [setSearchQuery]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const trendingSearches = getTrendingSearches();

    return (
        <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
            {/* Search Input */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary transition-colors"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            } else if (e.key === 'Escape') {
                                setShowSuggestions(false);
                            }
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 p-1 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-0 top-0 h-12 px-6 rounded-l-none"
                >
                    {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    ) : (
                        <ArrowRight className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Advanced Search Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                    >
                        {/* Filters */}
                        {initialShowFilters && (
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-sm">Filters</h3>
                                    <button
                                        onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                                        className="text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <Filter className="h-4 w-4 inline mr-1" />
                                        {showFiltersDropdown ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                {showFiltersDropdown && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {/* Category Filter */}
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="px-3 py-2 text-sm border rounded-md bg-background"
                                        >
                                            <option value="">All Categories</option>
                                            <option value="food">Food & Groceries</option>
                                            <option value="clothing">Clothing & Fashion</option>
                                            <option value="art">Art & Crafts</option>
                                            <option value="textiles">Textiles</option>
                                            <option value="spices">Spices & Seasonings</option>
                                        </select>

                                        {/* Price Range Filter */}
                                        <select
                                            value={selectedPriceRange}
                                            onChange={(e) => setSelectedPriceRange(e.target.value)}
                                            className="px-3 py-2 text-sm border rounded-md bg-background"
                                        >
                                            <option value="">Any Price</option>
                                            <option value="0-25">Under $25</option>
                                            <option value="25-50">$25 - $50</option>
                                            <option value="50-100">$50 - $100</option>
                                            <option value="100-500">$100 - $500</option>
                                            <option value="500-1000">$500 - $1000</option>
                                        </select>

                                        {/* Region Filter */}
                                        <select
                                            value={selectedRegion}
                                            onChange={(e) => setSelectedRegion(e.target.value)}
                                            className="px-3 py-2 text-sm border rounded-md bg-background"
                                        >
                                            <option value="">All Regions</option>
                                            <option value="nigeria">Nigeria</option>
                                            <option value="ghana">Ghana</option>
                                            <option value="ethiopia">Ethiopia</option>
                                            <option value="kenya">Kenya</option>
                                            <option value="south-africa">South Africa</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Search Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="p-4 border-b">
                                <div className="flex items-center mb-2">
                                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                                    <h3 className="font-semibold text-sm">Suggestions</h3>
                                </div>
                                <div className="space-y-1">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionSelect(suggestion)}
                                            className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search History */}
                        {searchHistory.length > 0 && (
                            <div className="p-4 border-b">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <h3 className="font-semibold text-sm">Recent Searches</h3>
                                    </div>
                                    <button
                                        onClick={clearSearchHistory}
                                        className="text-xs text-muted-foreground hover:text-foreground"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {searchHistory.slice(0, 5).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group"
                                        >
                                            <button
                                                onClick={() => handleHistorySelect(item)}
                                                className="flex-1 text-left"
                                            >
                                                {item.query}
                                            </button>
                                            <button
                                                onClick={() => removeFromSearchHistory(item.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trending Searches */}
                        <div className="p-4">
                            <div className="flex items-center mb-2">
                                <TrendUp className="h-4 w-4 mr-2 text-primary" />
                                <h3 className="font-semibold text-sm">Trending Searches</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {trendingSearches.slice(0, 8).map((trending, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => handleTrendingSelect(trending)}
                                    >
                                        {trending}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
