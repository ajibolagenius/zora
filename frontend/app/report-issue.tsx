import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Check,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

interface IssueType {
  id: string;
  label: string;
}

const ISSUE_TYPES: IssueType[] = [
  { id: 'missing', label: 'Missing items' },
  { id: 'wrong', label: 'Wrong items' },
  { id: 'damaged', label: 'Damaged items' },
  { id: 'quality', label: 'Quality issue' },
  { id: 'other', label: 'Other' },
];

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

// Mock order items
const ORDER_ITEMS: OrderItem[] = [
  {
    id: '1',
    name: 'Plantain Chips',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200',
  },
  {
    id: '2',
    name: 'Jollof Rice Spice Mix',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  },
  {
    id: '3',
    name: 'Fufu Flour',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200',
  },
  {
    id: '4',
    name: 'Egusi Soup Base',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200',
  },
  {
    id: '5',
    name: 'Palm Oil (1L)',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
  },
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>(['2']);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleContinue = () => {
    console.log('Continue with issue:', selectedIssueType);
    console.log('Selected items:', selectedItems);
    router.push('/dispute-details');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report an Issue</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Issue Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is the issue?</Text>
          <View style={styles.issueTypesList}>
            {ISSUE_TYPES.map((issue) => {
              const isSelected = selectedIssueType === issue.id;

              return (
                <TouchableOpacity
                  key={issue.id}
                  style={[
                    styles.issueTypeItem,
                    isSelected && styles.issueTypeItemSelected,
                  ]}
                  onPress={() => setSelectedIssueType(issue.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text
                    style={[
                      styles.issueTypeLabel,
                      isSelected && styles.issueTypeLabelSelected,
                    ]}
                  >
                    {issue.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>  

        {/* Spacer */}
        <View style={{ height: 16 }} />

        {/* Item Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select affected items</Text>
          <View style={styles.itemsList}>
            {ORDER_ITEMS.map((item) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemRow}
                  onPress={() => toggleItemSelection(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.itemLeft}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Check size={16} color={Colors.textPrimary} weight="bold" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom padding for button */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedIssueType || selectedItems.length === 0) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={!selectedIssueType || selectedItems.length === 0}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  headerRight: {
    width: 44,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },

  // Sections
  section: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },

  // Issue Types List
  issueTypesList: {
    gap: Spacing.md,
  },
  issueTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  issueTypeItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
  issueTypeLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  issueTypeLabelSelected: {
    color: Colors.textPrimary,
  },

  // Items List
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardDark,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: Heights.button,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(204, 0, 0, 0.4)',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  continueButtonText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
