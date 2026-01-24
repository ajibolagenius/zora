import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';
import { BorderRadius, Spacing } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { Banner } from '../../types';
import { Button } from './Button';

const { width } = Dimensions.get('window');

interface HeroBannerProps {
  banner: Banner;
  onPress?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banner, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: banner.image_url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.gradient} />
      <View style={styles.content}>
        {banner.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{banner.badge}</Text>
          </View>
        )}
        <Text style={styles.title}>{banner.title}</Text>
        <Text style={styles.subtitle}>{banner.subtitle}</Text>
        <Button
          title={banner.cta_text}
          variant="primary"
          size="medium"
          style={styles.button}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 200,
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
    height: '80%',
    backgroundColor: 'rgba(34, 23, 16, 0.7)',
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
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.tiny,
  },
  title: {
    fontFamily: FontFamily.display,
    color: Colors.textPrimary,
    fontSize: FontSize.h3,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.small,
    marginBottom: Spacing.md,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default HeroBanner;
