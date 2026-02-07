import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
    Animated,
    Keyboard,
    useWindowDimensions,
    StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    MagnifyingGlass,
    ArrowLeft,
    X,
    SlidersHorizontal,
    Star,
    ClockCounterClockwise,
    TrendUp,
    Check,
    CaretDown,
    Bell,
} from 'phosphor-react-native';
import { Colors, Spacing, BorderRadius, Heights, TouchTarget, ComponentDimensions } from '../constants';
import { FontSize, FontFamily } from '../constants';
import { AnimationDuration, AnimationEasing } from '../constants';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { ZoraLogo } from '../components/ZoraLogo';
import { generatePageMetaTags } from '../lib/metaTags';

export default function AdvancedSearchScreen() {
    const router = useRouter();
    const { height: screenHeight } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const {
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
    } = useAdvancedSearch({ enableAnalytics: true });

    const [showFilters, setShowFilters] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showTrending, setShowTrending] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (searchQuery.length >= 2) {
            getSuggestions(searchQuery).then(results => {
                setSuggestions(results.map(r => r.text));
            });
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, getSuggestions]);

    // Handle search submission
    const handleSearch = useCallback(() => {
        if (searchQuery.trim()) {
            Keyboard.dismiss();
            performSearch(searchQuery);
        }
    }, [performSearch]);

    // Handle suggestion selection
    const handleSuggestionPress = useCallback((suggestion: string) => {
        setSearchQuery(suggestion);
        setSelectedSuggestion(null);
        setShowTrending(false);
        Keyboard.dismiss();
        performSearch(suggestion);
    }, []);

    // Handle trending search
    const handleTrendingPress = useCallback((trending: string) => {
        setSearchQuery(trending);
        setSelectedSuggestion(null);
        setShowHistory(false);
        setShowTrending(false);
        Keyboard.dismiss();
        performSearch(trending);
    }, []);

    // Handle filter toggle
    const toggleFilters = useCallback(() => {
        setShowFilters(prev => !prev);
    }, []);

    // Handle history toggle
    const toggleHistory = useCallback(() => {
        setShowHistory(prev => !prev);
    }, []);

    // Handle trending toggle
    const toggleTrending = useCallback(() => {
        setShowTrending(prev => !prev);
    }, []);

    // Clear search
    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSelectedSuggestion(null);
        Keyboard.dismiss();
    }, []);

    // Render suggestion chip
    const renderSuggestionChip = (suggestion: string, index: number) => (
        <TouchableOpacity
            key={index}
            style={{
                backgroundColor: Colors.cardDark,
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: BorderRadius.full,
                marginRight: Spacing.sm,
                borderWidth: 1,
                borderColor: Colors.borderOutline,
            }}
            onPress={() => handleSuggestionPress(suggestion)}
        >
            <Text
                style={{
                    fontSize: FontSize.small,
                    color: Colors.textPrimary,
                    fontFamily: FontFamily.body,
                }}
                numberOfLines={1}
            >
                {suggestion}
            </Text>
        </TouchableOpacity>
    );

    // Render search input
    const renderSearchInput = () => (
        <View style={styles.searchContainer}>
            <MagnifyingGlass size={20} color={Colors.textMuted} weight="regular" />
            <TextInput
                style={styles.searchInput}
                placeholder="Search for products, categories, vendors..."
                placeholderTextColor={Colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => setSelectedSuggestion(null)}
                autoFocus
                returnKeyType="search"
            />

            {/* Clear button */}
            {searchQuery.length > 0 && (
                <TouchableOpacity
                    onPress={clearSearch}
                    style={styles.clearButton}
                >
                    <X size={18} color={Colors.textMuted} weight="bold" />
                </TouchableOpacity>
            )}

            {/* Filter button */}
            <TouchableOpacity
                onPress={toggleFilters}
                style={styles.filterButton}
            >
                <SlidersHorizontal size={20} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
        </View>
    );

    // Render search suggestions
    const renderSearchSuggestions = () => {
        if (searchQuery.length >= 2) {
            return (
                <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsTitle}>Suggestions</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {suggestions.map((suggestion, index) => renderSuggestionChip(suggestion, index))}
                    </ScrollView>
                </View>
            );
        }
        return null;
    };

    // Render trending searches
    const renderTrendingSearches = () => {
        const trendingSearches = getTrendingSearches();

        return (
            <View style={styles.trendingContainer}>
                <Text style={styles.trendingTitle}>Trending Searches</Text>
                <View style={styles.trendingList}>
                    {trendingSearches.map((trending, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.trendingItem}
                            onPress={() => handleTrendingPress(trending)}
                        >
                            <View style={styles.trendingItemContent}>
                                <ClockCounterClockwise size={16} color={Colors.textMuted} weight="duotone" />
                                <Text style={styles.trendingText}>{trending}</Text>
                                <TrendUp size={12} color="#CC0000" weight="fill" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };

    // Render search history
    const renderSearchHistory = () => {
        return (
            <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={() => clearSearchHistory()}>
                        <Text style={styles.historyClearButton}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {searchHistory.slice(0, 10).map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.historyItem}
                            onPress={() => {
                                setSearchQuery(item.query);
                                setSelectedSuggestion(item.query);
                            }}
                        >
                            <View style={styles.historyItemContent}>
                                <Text style={styles.historyQuery}>{item.query}</Text>
                                <Text style={styles.historyMeta}>
                                    {item.resultCount} results • {new Date(item.timestamp).toLocaleDateString()}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.historyRemoveButton}
                                onPress={() => removeFromSearchHistory(item.id)}
                            >
                                <X size={16} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    // Render filters modal
    const renderFiltersModal = () => {
        return (
            <Modal
                visible={showFilters}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowFilters(false)}
            >
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <X size={24} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Advanced Search Filters</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.filtersContent}>
                            <Text style={styles.filterSectionTitle}>Search Options</Text>

                            {/* Search suggestions toggle */}
                            <View style={styles.filterOption}>
                                <Text style={styles.filterLabel}>Smart Suggestions</Text>
                                <Text style={styles.filterValue}>Enabled</Text>
                            </View>

                            {/* Analytics toggle */}
                            <View style={styles.filterOption}>
                                <Text style={styles.filterLabel}>Search Analytics</Text>
                                <Text style={styles.filterValue}>Enabled</Text>
                            </View>

                            {/* Personalized recommendations toggle */}
                            <View style={styles.filterOption}>
                                <Text style={styles.filterLabel}>Personalized Recommendations</Text>
                                <Text style={styles.filterValue}>Enabled</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setShowFilters(false)}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    };

    // Render trending modal
    const renderTrendingModal = () => {
        const trendingSearches = getTrendingSearches();

        return (
            <Modal
                visible={showTrending}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowTrending(false)}
            >
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
                    {/* Header */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowTrending(false)}>
                            <X size={24} color={Colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Trending Searches</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.trendingList}>
                            {trendingSearches.map((trending, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.trendingItem}
                                    onPress={() => handleTrendingPress(trending)}
                                >
                                    <View style={styles.trendingItemContent}>
                                        <ClockCounterClockwise size={16} color={Colors.textMuted} weight="duotone" />
                                        <Text style={styles.trendingText}>{trending}</Text>
                                        <TrendUp size={12} color="#CC0000" weight="fill" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={styles.applyButton}
                            onPress={() => setShowTrending(false)}
                        >
                            <Text style={styles.applyButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <ZoraLogo width={32} height={32} outlineColor={Colors.textPrimary} />
                    <Text style={styles.headerTitle}>Advanced Search</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => setShowHistory(true)}>
                        <ClockCounterClockwise size={20} color={Colors.textMuted} weight="duotone" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowTrending(true)}>
                        <TrendUp size={20} color="#CC0000" weight="fill" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Input */}
            {renderSearchInput()}

            {/* Search Suggestions */}
            {renderSearchSuggestions()}

            {/* Loading indicator */}
            {isSearching && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Searching...</Text>
                </View>
            )}

            {/* Results */}
            <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
                {/* This would render actual search results */}
                <Text style={styles.resultsTitle}>Search Results</Text>
                <Text style={styles.resultsSubtitle}>Try searching for products, categories, or vendors</Text>
            </ScrollView>

            {/* Footer */}
            <View style={{ height: 100 }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundDark,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.cardDark,
        borderBottomLeftRadius: BorderRadius['2xl'],
        borderBottomRightRadius: BorderRadius['2xl'],
    },
    headerContent: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
    },
    headerIcons: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    headerIconButton: {
        width: TouchTarget.min,
        height: TouchTarget.min,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        marginHorizontal: Spacing.base,
        marginTop: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: Spacing.sm,
        backgroundColor: Colors.cardDark,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontSize: FontSize.body,
        color: Colors.textPrimary,
        height: Heights.input,
    },
    clearButton: {
        position: 'absolute',
        right: Spacing.sm,
        top: Spacing.sm,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    suggestionsContainer: {
        marginTop: Spacing.sm,
        paddingHorizontal: Spacing.base,
    },
    suggestionsTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    suggestionsList: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.lg,
    },
    resultsTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    resultsSubtitle: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    loadingText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        marginTop: Spacing.sm,
    },
    historyContainer: {
        flex: 1,
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.lg,
    },
    historyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    historyTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
    },
    historyClearButton: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.cardDark,
    },
    clearButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
        fontSize: FontSize.small,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardDark,
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    historyItemContent: {
        flex: 1,
        marginLeft: Spacing.sm,
    },
    historyQuery: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        flex: 1,
    },
    historyMeta: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.tiny,
        color: Colors.textMuted,
        marginTop: 2,
    },
    historyRemoveButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.black40,
    },
    trendingContainer: {
        flex: 1,
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.lg,
    },
    trendingTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    trendingList: {
        gap: Spacing.sm,
    },
    trendingItem: {
        backgroundColor: Colors.cardDark,
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendingItemContent: {
        marginLeft: Spacing.sm,
    },
    trendingText: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        flex: 1,
    },
    modal: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        backgroundColor: Colors.cardDark,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderBottomLeftRadius: BorderRadius['2xl'],
        borderBottomRightRadius: BorderRadius['2xl'],
    },
    modalTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h3,
        color: Colors.textPrimary,
        paddingVertical: Spacing.sm,
    },
    filtersContent: {
        flex: 1,
        paddingHorizontal: Spacing.base,
    },
    filterSectionTitle: {
        fontFamily: FontFamily.displaySemiBold,
        fontSize: FontSize.h4,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.backgroundDark,
        padding: Spacing.sm,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing.sm,
    },
    filterLabel: {
        fontFamily: FontFamily.body,
        fontSize: FontSize.small,
        color: Colors.textMuted,
        flex: 1,
    },
    filterValue: {
        fontFamily: FontFamily.bodySemiBold,
        fontSize: FontSize.small,
        color: Colors.textPrimary,
        marginRight: Spacing.sm,
    },
    modalFooter: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: Spacing.lg,
    },
    applyButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.lg,
    },
    applyButtonText: {
        fontFamily: FontFamily.bodySemiBold,
        color: Colors.textPrimary,
        fontSize: FontSize.small,
    },
});
