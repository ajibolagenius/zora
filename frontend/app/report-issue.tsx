import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Package,
  ArrowsLeftRight,
  Warning,
  ThumbsDown,
  DotsThreeCircle,
  Check,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_CARD = '#2e211a';
const SURFACE_DARK = '#231515';
const BACKGROUND_DARK = '#221710';
const MUTED_TEXT = '#bc9a9a';
const BORDER_COLOR = '#3b2d2d';

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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: BACKGROUND_DARK,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: 24,
  },

  // Sections
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 16,
  },

  // Issue Types List
  issueTypesList: {
    gap: 12,
  },
  issueTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: `${ZORA_CARD}80`,
    borderRadius: BorderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  issueTypeItemSelected: {
    borderColor: ZORA_RED,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#563939',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: ZORA_RED,
    backgroundColor: ZORA_RED,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textPrimary,
  },
  issueTypeLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  issueTypeLabelSelected: {
    color: Colors.textPrimary,
  },

  // Items List
  itemsList: {
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#333',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#563939',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkboxSelected: {
    backgroundColor: ZORA_RED,
    borderColor: ZORA_RED,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.base,
    paddingBottom: 32,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  continueButton: {
    backgroundColor: ZORA_RED,
    height: 52,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(204, 0, 0, 0.5)',
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
