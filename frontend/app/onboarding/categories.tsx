import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CookingPot,
  Leaf,
  Coffee,
  TShirt,
  Palette,
  Flower,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontWeight } from '../../constants/typography';

const CATEGORIES = [
  {
    id: 'traditional-ingredients',
    name: 'Traditional Ingredients',
    icon: CookingPot,
  },
  {
    id: 'spices-seasonings',
    name: 'Spices & Seasonings',
    icon: Leaf,
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: Coffee,
  },
  {
    id: 'fashion-textiles',
    name: 'Fashion & Textiles',
    icon: TShirt,
  },
  {
    id: 'art-crafts',
    name: 'Art & Crafts',
    icon: Palette,
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: Flower,
  },
];

export default function CategoriesScreen() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { width } = useWindowDimensions();
  const cardWidth = Math.max(140, (width - Spacing.base * 2 - Spacing.md) / 2);

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Step 2 of 3</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What Are You Looking For?</Text>
        <Text style={styles.subtitle}>
          Select the categories that interest you most to personalize your feed.
        </Text>
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  { width: cardWidth, height: cardWidth },
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => toggleCategory(category.id)}
                activeOpacity={0.8}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Check size={14} color={Colors.textPrimary} weight="bold" />
                  </View>
                )}
                
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <IconComponent
                    size={32}
                    color={Colors.primary}
                    weight="duotone"
                  />
                </View>
                
                {/* Name */}
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

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
          <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
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
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: FontSize.caption,
    marginTop: Spacing.xs,
  },
  titleContainer: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.body,
    color: Colors.textMuted,
    lineHeight: 24,
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
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryName: {
    color: Colors.textPrimary,
    fontSize: FontSize.small,
    fontWeight: FontWeight.semiBold,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
  },
});
