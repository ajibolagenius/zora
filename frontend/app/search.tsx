import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MagnifyingGlass,
  ArrowLeft,
  SlidersHorizontal,
  X,
  Star,
  Check,
  CaretDown,
  ClockCounterClockwise,
  TrendUp,
} from 'phosphor-react-native';
import { useProductSearch, useCategories, useRegions, usePriceRange, type ProductFilters } from '../hooks/useQueries';
import { Colors, TrendingSearches, SortOptions, RatingOptions, Placeholders, PlaceholderImages } from '../constants';

// Use constants from app.ts
const TRENDING_SEARCHES = TrendingSearches;
const SORT_OPTIONS = SortOptions.products;
const RATING_OPTIONS = RatingOptions;

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdown, setShowDropdown] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Palm oil', 'Garri', 'Suya spice'
  ]);
  const [isInputFocused, setIsInputFocused] = useState(true);
  
  // Filter state
  const [filters, setFilters] = useState<ProductFilters>({});
  const [tempFilters, setTempFilters] = useState<ProductFilters>({});
  
  // Fetch data
  const { data: categories = [] } = useCategories();
  const { data: regions = [] } = useRegions();
  const { data: priceRange } = usePriceRange();
  const { data: searchResults = [], isLoading, isFetching } = useProductSearch(searchQuery, filters);
  
  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.region) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating !== undefined) count++;
    if (filters.sortBy) count++;
    return count;
  }, [filters]);
  
  // Open filters modal
  const openFilters = useCallback(() => {
    setTempFilters({ ...filters });
    setShowFilters(true);
  }, [filters]);
  
  // Apply filters
  const applyFilters = useCallback(() => {
    setFilters({ ...tempFilters });
    setShowFilters(false);
  }, [tempFilters]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setTempFilters({});
  }, []);
  
  // Navigate to product
  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Handle selecting a suggestion
  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowDropdown(false);
    Keyboard.dismiss();
    // Add to recent searches
    if (!recentSearches.includes(suggestion)) {
      setRecentSearches(prev => [suggestion, ...prev.slice(0, 4)]);
    }
  };

  // Clear a recent search
  const removeRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  // Dynamic suggestions based on current query
  const dynamicSuggestions = useMemo(() => {
    if (searchQuery.length < 1) return [];
    const query = searchQuery.toLowerCase();
    return searchResults
      .slice(0, 5)
      .map(p => p.name);
  }, [searchQuery, searchResults]);

  // Should show dropdown
  const shouldShowDropdown = isInputFocused && (searchQuery.length < 2 || showDropdown);

  return (
    <View className="flex-1 bg-bg-dark">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-card-dark items-center justify-center"
          >
            <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          
          {/* Search Input */}
          <View className="flex-1 flex-row items-center bg-card-dark rounded-full px-4 h-12">
            <MagnifyingGlass size={20} color={Colors.textMuted} weight="regular" />
            <TextInput
              className="flex-1 ml-3 text-text-primary font-body text-base"
              placeholder={Placeholders.search.products}
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowDropdown(true);
              }}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={() => {
                setShowDropdown(false);
                if (searchQuery && !recentSearches.includes(searchQuery)) {
                  setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
                }
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setShowDropdown(true); }}>
                <X size={18} color={Colors.textMuted} weight="bold" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filter Button */}
          <TouchableOpacity
            onPress={openFilters}
            className="w-11 h-11 rounded-full bg-card-dark items-center justify-center relative"
          >
            <SlidersHorizontal size={22} color={Colors.textPrimary} weight="bold" />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-zora-red items-center justify-center">
                <Text className="text-white text-xs font-bold">{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Active Filters Pills */}
        {activeFilterCount > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 py-2"
            contentContainerStyle={{ gap: 8 }}
          >
            {filters.category && (
              <FilterPill
                label={filters.category}
                onRemove={() => setFilters(f => ({ ...f, category: undefined }))}
              />
            )}
            {filters.region && (
              <FilterPill
                label={filters.region}
                onRemove={() => setFilters(f => ({ ...f, region: undefined }))}
              />
            )}
            {filters.minRating && (
              <FilterPill
                label={`${filters.minRating}+ Stars`}
                onRemove={() => setFilters(f => ({ ...f, minRating: undefined }))}
              />
            )}
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <FilterPill
                label={`£${filters.minPrice || 0} - £${filters.maxPrice || '∞'}`}
                onRemove={() => setFilters(f => ({ ...f, minPrice: undefined, maxPrice: undefined }))}
              />
            )}
            {filters.sortBy && (
              <FilterPill
                label={SORT_OPTIONS.find(s => s.id === filters.sortBy)?.label || ''}
                onRemove={() => setFilters(f => ({ ...f, sortBy: undefined }))}
              />
            )}
            <TouchableOpacity
              onPress={() => setFilters({})}
              className="px-3 py-1.5 rounded-full border border-zora-red"
            >
              <Text className="text-zora-red text-sm font-medium">Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
        
        {/* Search Suggestions Dropdown */}
        {shouldShowDropdown && searchQuery.length < 2 && (
          <View className="px-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-text-primary text-base font-semibold">Recent Searches</Text>
                  <TouchableOpacity onPress={() => setRecentSearches([])}>
                    <Text className="text-zora-red text-sm">Clear</Text>
                  </TouchableOpacity>
                </View>
                <View className="gap-2">
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      className="flex-row items-center py-2"
                      onPress={() => handleSuggestionPress(search)}
                    >
                      <ClockCounterClockwise size={18} color={Colors.textMuted} weight="duotone" />
                      <Text className="flex-1 ml-3 text-text-primary text-sm">{search}</Text>
                      <TouchableOpacity 
                        onPress={() => removeRecentSearch(search)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <X size={16} color={Colors.textMuted} weight="bold" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Searches */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <TrendUp size={18} color="#CC0000" weight="fill" />
                <Text className="text-text-primary text-base font-semibold ml-2">Trending</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {TRENDING_SEARCHES.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    className="px-4 py-2 rounded-full border border-white/15"
                    onPress={() => handleSuggestionPress(search)}
                  >
                    <Text className="text-text-primary text-sm">{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Dynamic Suggestions Dropdown */}
        {isInputFocused && searchQuery.length >= 2 && showDropdown && dynamicSuggestions.length > 0 && (
          <View className="px-4 mb-4">
            <Text className="text-text-muted text-sm mb-2">Suggestions</Text>
            <View className="bg-card-dark rounded-xl overflow-hidden">
              {dynamicSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center py-3 px-4 ${index > 0 ? 'border-t border-white/5' : ''}`}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <MagnifyingGlass size={16} color={Colors.textMuted} weight="regular" />
                  <Text className="ml-3 text-text-primary text-sm">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Results Count */}
          {searchQuery.length >= 2 && (
            <Text className="text-text-muted text-sm mb-3">
              {isLoading ? 'Searching...' : `${searchResults.length} results found`}
            </Text>
          )}
          
          {/* Loading State */}
          {(isLoading || isFetching) && searchQuery.length >= 2 && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#C1272D" />
            </View>
          )}
          
          {/* Empty State */}
          {!isLoading && searchQuery.length >= 2 && searchResults.length === 0 && (
            <View className="py-12 items-center">
              <MagnifyingGlass size={48} color={Colors.textMuted} weight="duotone" />
              <Text className="text-text-primary text-lg font-semibold mt-4">No results found</Text>
              <Text className="text-text-muted text-sm mt-2 text-center">
                Try adjusting your search or filters
              </Text>
            </View>
          )}
          
          {/* Prompt to Search */}
          {searchQuery.length < 2 && (
            <View className="py-12 items-center">
              <MagnifyingGlass size={48} color={Colors.textMuted} weight="duotone" />
              <Text className="text-text-primary text-lg font-semibold mt-4">Search for products</Text>
              <Text className="text-text-muted text-sm mt-2 text-center">
                Enter at least 2 characters to search
              </Text>
            </View>
          )}
          
          {/* Results Grid */}
          {!isLoading && searchResults.length > 0 && (
            <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
              {searchResults.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => handleProductPress(product.id)}
                  className="w-1/2 p-1.5"
                  activeOpacity={0.8}
                >
                  <View className="bg-card-dark rounded-xl overflow-hidden">
                    <Image
                      source={{ uri: product.image_urls?.[0] || PlaceholderImages.image200 }}
                      className="w-full h-32"
                      resizeMode="cover"
                    />
                    <View className="p-3">
                      <Text className="text-text-primary text-sm font-semibold" numberOfLines={2}>
                        {product.name}
                      </Text>
                      <Text className="text-text-muted text-xs mt-1">{product.category}</Text>
                      <View className="flex-row items-center justify-between mt-2">
                        <Text className="text-zora-yellow text-base font-bold">
                          £{product.price.toFixed(2)}
                        </Text>
                        {product.rating && (
                          <View className="flex-row items-center gap-1">
                            <Star size={12} color="#FFCC00" weight="fill" />
                            <Text className="text-text-muted text-xs">{product.rating}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
      
      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilters(false)}
      >
        <View className="flex-1 bg-bg-dark">
          <SafeAreaView className="flex-1">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-card-dark">
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={Colors.textPrimary} weight="bold" />
              </TouchableOpacity>
              <Text className="text-text-primary text-lg font-bold">Filters</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text className="text-zora-red text-sm font-medium">Reset</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
              {/* Sort By */}
              <View className="py-4 border-b border-card-dark">
                <Text className="text-text-primary text-base font-semibold mb-3">Sort By</Text>
                <View className="gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => setTempFilters(f => ({ ...f, sortBy: option.id }))}
                      className={`flex-row items-center justify-between p-3 rounded-lg ${
                        tempFilters.sortBy === option.id ? 'bg-zora-red/20' : 'bg-card-dark'
                      }`}
                    >
                      <Text className="text-text-primary text-sm">{option.label}</Text>
                      {tempFilters.sortBy === option.id && (
                        <Check size={20} color="#C1272D" weight="bold" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Category Filter */}
              <View className="py-4 border-b border-card-dark">
                <Text className="text-text-primary text-base font-semibold mb-3">Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    <FilterChip
                      label="All"
                      selected={!tempFilters.category}
                      onPress={() => setTempFilters(f => ({ ...f, category: undefined }))}
                    />
                    {categories.map((cat) => (
                      <FilterChip
                        key={cat}
                        label={cat}
                        selected={tempFilters.category === cat}
                        onPress={() => setTempFilters(f => ({ ...f, category: cat }))}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              {/* Region Filter */}
              <View className="py-4 border-b border-card-dark">
                <Text className="text-text-primary text-base font-semibold mb-3">Region</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    <FilterChip
                      label="All Regions"
                      selected={!tempFilters.region}
                      onPress={() => setTempFilters(f => ({ ...f, region: undefined }))}
                    />
                    {regions.map((region) => (
                      <FilterChip
                        key={region}
                        label={region}
                        selected={tempFilters.region === region}
                        onPress={() => setTempFilters(f => ({ ...f, region: region }))}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              {/* Rating Filter */}
              <View className="py-4 border-b border-card-dark">
                <Text className="text-text-primary text-base font-semibold mb-3">Minimum Rating</Text>
                <View className="flex-row gap-2">
                  <FilterChip
                    label="Any"
                    selected={!tempFilters.minRating}
                    onPress={() => setTempFilters(f => ({ ...f, minRating: undefined }))}
                  />
                  {RATING_OPTIONS.map((rating) => (
                    <FilterChip
                      key={rating}
                      label={`${rating}+ ★`}
                      selected={tempFilters.minRating === rating}
                      onPress={() => setTempFilters(f => ({ ...f, minRating: rating }))}
                    />
                  ))}
                </View>
              </View>
              
              {/* Price Range */}
              <View className="py-4">
                <Text className="text-text-primary text-base font-semibold mb-3">Price Range</Text>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-text-muted text-xs mb-1">Min Price</Text>
                    <TextInput
                      className="bg-card-dark rounded-lg px-4 py-3 text-text-primary"
                      placeholder={`£${priceRange?.min || 0}`}
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      value={tempFilters.minPrice?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseFloat(text);
                        setTempFilters(f => ({ ...f, minPrice: isNaN(num) ? undefined : num }));
                      }}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-muted text-xs mb-1">Max Price</Text>
                    <TextInput
                      className="bg-card-dark rounded-lg px-4 py-3 text-text-primary"
                      placeholder={`£${priceRange?.max || 100}`}
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="numeric"
                      value={tempFilters.maxPrice?.toString() || ''}
                      onChangeText={(text) => {
                        const num = parseFloat(text);
                        setTempFilters(f => ({ ...f, maxPrice: isNaN(num) ? undefined : num }));
                      }}
                    />
                  </View>
                </View>
              </View>
              
              <View style={{ height: 100 }} />
            </ScrollView>
            
            {/* Apply Button */}
            <View className="px-4 py-4 border-t border-card-dark">
              <TouchableOpacity
                onPress={applyFilters}
                className="bg-zora-red rounded-xl py-4 items-center"
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-bold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

// Filter Pill Component
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View className="flex-row items-center bg-zora-red/20 rounded-full px-3 py-1.5 gap-2">
      <Text className="text-zora-red text-sm">{label}</Text>
      <TouchableOpacity onPress={onRemove}>
        <X size={14} color="#C1272D" weight="bold" />
      </TouchableOpacity>
    </View>
  );
}

// Filter Chip Component
function FilterChip({ 
  label, 
  selected, 
  onPress 
}: { 
  label: string; 
  selected: boolean; 
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full ${
        selected ? 'bg-zora-red' : 'bg-card-dark'
      }`}
      activeOpacity={0.8}
    >
      <Text className={`text-sm font-medium ${selected ? 'text-white' : 'text-text-primary'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
