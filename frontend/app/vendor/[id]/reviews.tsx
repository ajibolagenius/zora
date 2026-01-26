import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Star,
  SealCheck,
  PencilSimple,
  CaretDown,
  CaretUp,
} from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../../../constants/spacing';
import { FontSize, FontFamily } from '../../../constants/typography';
import { vendorService, reviewService, type Vendor, type Review } from '../../../services/mockDataService';

type SortOption = 'recent' | 'highest' | 'lowest' | 'helpful';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1';

export default function VendorReviewsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const vendorData = vendorService.getById(id);
      if (vendorData) {
        setVendor(vendorData);
        const vendorReviews = reviewService.getByVendor(id);
        setReviews(vendorReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    let filtered = [...reviews];

    // Filter by rating
    if (filterBy !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterBy));
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, sortBy, filterBy]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/vendor/${id}`);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleSort = (option: SortOption) => {
    setSortBy(option);
    setShowSortMenu(false);
  };

  const handleFilter = (option: FilterOption) => {
    setFilterBy(option);
    setShowFilterMenu(false);
  };

  const calculateRatingStats = () => {
    const total = reviews.length;
    if (total === 0) return { average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / total;
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return { average, distribution, total };
  };

  const stats = calculateRatingStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Vendor Reviews</Text>
          {vendor && (
            <Text style={styles.headerSubtitle}>{vendor.name}</Text>
          )}
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Rating Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryScore}>{stats.average.toFixed(1)}</Text>
            <View style={styles.summaryStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  color={star <= Math.floor(stats.average) ? Colors.secondary : Colors.borderDark}
                  weight="fill"
                />
              ))}
            </View>
            <Text style={styles.summaryCount}>{stats.total} {stats.total === 1 ? 'review' : 'reviews'}</Text>
          </View>
          
          <View style={styles.summaryRight}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.distribution[rating as keyof typeof stats.distribution];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <View key={rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>{rating}</Text>
                  <Star size={12} color={Colors.secondary} weight="fill" />
                  <View style={styles.ratingBarTrack}>
                    <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.ratingBarCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Filters and Sort */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterMenu(!showFilterMenu)}
              activeOpacity={0.8}
            >
              <Text style={styles.filterButtonText}>
                {filterBy === 'all' ? 'All Ratings' : `${filterBy} Stars`}
              </Text>
              {showFilterMenu ? (
                <CaretUp size={16} color={Colors.textPrimary} weight="bold" />
              ) : (
                <CaretDown size={16} color={Colors.textPrimary} weight="bold" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => setShowSortMenu(!showSortMenu)}
              activeOpacity={0.8}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === 'recent' ? 'Most Recent' : 
                 sortBy === 'highest' ? 'Highest Rated' :
                 sortBy === 'lowest' ? 'Lowest Rated' : 'Most Helpful'}
              </Text>
              {showSortMenu ? (
                <CaretUp size={16} color={Colors.textPrimary} weight="bold" />
              ) : (
                <CaretDown size={16} color={Colors.textPrimary} weight="bold" />
              )}
            </TouchableOpacity>
          </View>

          {/* Filter Menu */}
          {showFilterMenu && (
            <View style={styles.menuContainer}>
              {(['all', '5', '4', '3', '2', '1'] as FilterOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.menuItem,
                    filterBy === option && styles.menuItemActive,
                  ]}
                  onPress={() => handleFilter(option)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.menuItemText,
                    filterBy === option && styles.menuItemTextActive,
                  ]}>
                    {option === 'all' ? 'All Ratings' : `${option} Stars`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Sort Menu */}
          {showSortMenu && (
            <View style={styles.menuContainer}>
              {([
                { value: 'recent' as SortOption, label: 'Most Recent' },
                { value: 'highest' as SortOption, label: 'Highest Rated' },
                { value: 'lowest' as SortOption, label: 'Lowest Rated' },
                { value: 'helpful' as SortOption, label: 'Most Helpful' },
              ]).map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.menuItem,
                    sortBy === option.value && styles.menuItemActive,
                  ]}
                  onPress={() => handleSort(option.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.menuItemText,
                    sortBy === option.value && styles.menuItemTextActive,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Write Review Button */}
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => router.push(`/write-review?vendorId=${id}&vendorName=${encodeURIComponent(vendor?.name || '')}`)}
          activeOpacity={0.8}
        >
          <PencilSimple size={18} color={Colors.textPrimary} weight="bold" />
          <Text style={styles.writeReviewText}>Write a Review</Text>
        </TouchableOpacity>

        {/* Reviews List */}
        {filteredReviews.length > 0 ? (
          <View style={styles.reviewsList}>
            {filteredReviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerInitial}>
                      {review.user_name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.reviewMeta}>
                    <View style={styles.reviewNameRow}>
                      <Text style={styles.reviewerName}>{review.user_name}</Text>
                      {review.verified_purchase && (
                        <View style={styles.verifiedBadge}>
                          <SealCheck size={12} color={Colors.success} weight="fill" />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.reviewStarsRow}>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            color={star <= review.rating ? Colors.secondary : Colors.borderDark}
                            weight={star <= review.rating ? 'fill' : 'regular'}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewDate}>
                        {new Date(review.created_at).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {review.title && (
                  <Text style={styles.reviewTitle}>{review.title}</Text>
                )}
                
                <Text style={styles.reviewContent}>{review.content}</Text>

                {review.helpful_count > 0 && (
                  <Text style={styles.helpfulText}>
                    {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noReviews}>
            <Text style={styles.noReviewsText}>
              {filterBy !== 'all' 
                ? `No ${filterBy}-star reviews found.`
                : 'No reviews yet. Be the first to review!'}
            </Text>
            {filterBy === 'all' && (
              <TouchableOpacity
                style={styles.firstReviewButton}
                onPress={() => router.push(`/write-review?vendorId=${id}&vendorName=${encodeURIComponent(vendor?.name || '')}`)}
                activeOpacity={0.8}
              >
                <Text style={styles.firstReviewText}>Write a Review</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: Math.max(insets.bottom, Spacing.base) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.sm,
  },
  summaryLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.borderDark,
    minWidth: 100,
  },
  summaryScore: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: 40,
    color: Colors.textPrimary,
  },
  summaryStars: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: Spacing.xs,
  },
  summaryCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  summaryRight: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: Spacing.md,
    gap: Spacing.xs,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  ratingBarLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.textPrimary,
    width: 12,
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.borderDark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  ratingBarCount: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    width: 30,
    textAlign: 'right',
  },
  controlsContainer: {
    marginBottom: Spacing.md,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  filterButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  sortButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  menuContainer: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginTop: Spacing.xs,
    paddingVertical: Spacing.xs,
    ...Shadows.md,
  },
  menuItem: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  menuItemActive: {
    backgroundColor: Colors.primary + '20',
  },
  menuItemText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  menuItemTextActive: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.primary,
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  writeReviewText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  reviewsList: {
    gap: Spacing.md,
  },
  reviewCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  reviewerInitial: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  reviewerName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  verifiedText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.tiny,
    color: Colors.success,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewDate: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  reviewTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  reviewContent: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  helpfulText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  noReviews: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  noReviewsText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  firstReviewButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    ...Shadows.md,
  },
  firstReviewText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
