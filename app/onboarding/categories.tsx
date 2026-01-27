import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  CookingPot,
  Leaf,
  Coffee,
  TShirt,
  Palette,
  Sparkle,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius, Heights } from '../../constants/spacing';
import { FontSize, FontFamily } from '../../constants/typography';
import { AnimationDuration, AnimationEasing } from '../../constants';

const CATEGORIES = [
  {
    id: 'traditional-ingredients',
    name: 'Traditional\nIngredients',
    icon: CookingPot,
  },
  {
    id: 'spices-seasonings',
    name: 'Spices &\nSeasonings',
    icon: Leaf,
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: Coffee,
  },
  {
    id: 'beauty-skincare',
    name: 'Beauty &\nSkincare',
    icon: Sparkle,
  },
  {
    id: 'fashion-textiles',
    name: 'Fashion &\nTextiles',
    icon: TShirt,
  },
  {
    id: 'art-crafts',
    name: 'Art & Crafts',
    icon: Palette,
  },
];

// Available colors from Design System
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,        // #CC0000 - Zora Red
  Colors.secondary,      // #FFCC00 - Zora Yellow
  Colors.success,        // #22C55E - Green
  Colors.info,           // #3B82F6 - Blue
  Colors.badgeEcoFriendly, // #14B8A6 - Teal
];

// Shuffle array function for random color assignment
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Assign random colors to categories (shuffled once per render)
const getCategoriesWithColors = () => {
  const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
  return CATEGORIES.map((category, index) => ({
    ...category,
    color: shuffledColors[index % shuffledColors.length],
  }));
};

export default function CategoriesScreen() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(140, (width - Spacing.base * 2 - Spacing.md) / 2);
  
  // Get categories with random colors assigned (computed once on mount)
  const categoriesWithColors = useMemo(() => getCategoriesWithColors(), []);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: AnimationDuration.default,
        easing: AnimationEasing.standard,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: AnimationDuration.default,
        easing: AnimationEasing.standard,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    router.push('/onboarding/location');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Step 2 of 3</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What Are You{'\n'}Looking For?</Text>
          <Text style={styles.subtitle}>
            Select the categories that interest you most to personalize your feed.
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Categories Grid */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.grid}>
            {categoriesWithColors.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    { width: cardWidth, height: cardWidth * 0.9 },
                    isSelected && styles.categoryCardSelected,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                  activeOpacity={0.8}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Check size={12} color={Colors.textPrimary} weight="bold" />
                    </View>
                  )}
                  
                  {/* Icon with random color from design system */}
                  <IconComponent
                    size={28}
                    color={category.color}
                    weight="duotone"
                  />
                  
                  {/* Name */}
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCategories.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedCategories.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.black40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 100,
    height: 3,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    fontFamily: FontFamily.body,
    color: Colors.textMuted,
    fontSize: FontSize.caption,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.white08,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  categoryCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
    gap: Spacing.sm,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
    fontSize: FontSize.caption,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    color: Colors.textPrimary,
    fontSize: FontSize.body,
  },
});
