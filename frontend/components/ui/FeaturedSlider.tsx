import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';

import { UiConfig } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - UiConfig.screenPadding * 2;
const CARD_MARGIN = UiConfig.cardMargin;

// Generic banner interface that works with both types and mockDataService
interface SliderBanner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  badge?: string;
  badge_style?: string;
  cta_text: string;
  cta_link?: string;
}

interface FeaturedSliderProps {
  banners: SliderBanner[];
  onBannerPress?: (banner: SliderBanner) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export const FeaturedSlider: React.FC<FeaturedSliderProps> = ({
  banners,
  onBannerPress,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const activeIndexRef = useRef(0); // Track index without causing re-renders

  // Keep ref in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Auto-play functionality - runs independently of manual scrolling
  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  const renderBanner = ({ item, index }: { item: SliderBanner; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.bannerCard}
        onPress={() => onBannerPress?.(item)}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: item.image_url }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(34, 23, 16, 0.4)', 'rgba(34, 23, 16, 0.95)']}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        />
        <View style={styles.bannerContent}>
          {item.badge && (
            <View style={[
              styles.badge,
              item.badge_style === 'secondary' && styles.badgeSecondary,
              item.badge_style === 'warning' && styles.badgeWarning,
            ]}>
              <Text style={styles.badgeText}>{item.badge.toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle} numberOfLines={2}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaText}>{item.cta_text}</Text>
            <ArrowRight size={18} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + CARD_MARGIN,
          offset: (CARD_WIDTH + CARD_MARGIN) * index,
          index,
        })}
      />
      
      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => {
            const inputRange = [
              (index - 1) * CARD_WIDTH,
              index * CARD_WIDTH,
              (index + 1) * CARD_WIDTH,
            ];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.base,
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: 260,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginRight: CARD_MARGIN,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardDark,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
  },
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  badgeSecondary: {
    backgroundColor: Colors.secondary,
  },
  badgeWarning: {
    backgroundColor: Colors.warning,
  },
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontFamily: FontFamily.display,
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    fontFamily: FontFamily.body,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: FontSize.small,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
    gap: Spacing.sm,
  },
  ctaText: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.small,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
});

export default FeaturedSlider;
