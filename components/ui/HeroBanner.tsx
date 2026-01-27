import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Banner } from '../../types';
import { LazyImage } from './LazyImage';

const { width } = Dimensions.get('window');

interface HeroBannerProps {
  banner: Banner;
  onPress?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.95}>
      <LazyImage
        source={banner.image_url}
        style={styles.image}
        contentFit="cover"
        showLoader={false}
      />
      {/* Gradient overlay for text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(34, 23, 16, 0.4)', 'rgba(34, 23, 16, 0.95)']}
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      />
      <View style={styles.content}>
        {banner.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{banner.badge.toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title}>{banner.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>{banner.subtitle}</Text>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
          <Text style={styles.ctaText}>{banner.cta_text}</Text>
          <ArrowRight size={18} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 260,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: Spacing.base,
  },
  image: {
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
  content: {
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
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FontFamily.display,
    color: Colors.textPrimary,
    fontSize: FontSize.h2,
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  subtitle: {
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
});

export default HeroBanner;
