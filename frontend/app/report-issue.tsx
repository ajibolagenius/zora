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
  ArrowRight,
  Package,
  ArrowsLeftRight,
  Warning,
  ThumbsDown,
  DotsThreeCircle,
  CheckCircle,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_CARD = '#342418';
const SURFACE_DARK = '#231515';
const BACKGROUND_DARK = '#181010';
const MUTED_TEXT = '#bc9a9a';

interface IssueType {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
}

const ISSUE_TYPES: IssueType[] = [
  { id: 'missing', icon: Package, label: 'Missing items' },
  { id: 'wrong', icon: ArrowsLeftRight, label: 'Wrong items' },
  { id: 'damaged', icon: Warning, label: 'Damaged items' },
  { id: 'quality', icon: ThumbsDown, label: 'Quality issue' },
  { id: 'other', icon: DotsThreeCircle, label: 'Other issue' },
];

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

// Mock order items
const ORDER_ITEMS: OrderItem[] = [
  {
    id: '1',
    name: 'Jollof Seasoning Mix',
    quantity: 2,
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
  },
  {
    id: '2',
    name: 'Fresh Plantains (Ripe)',
    quantity: 1,
    price: 3.49,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200',
  },
  {
    id: '3',
    name: 'Palm Oil (500ml)',
    quantity: 1,
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
  },
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedIssueType, setSelectedIssueType] = useState<string>('missing');
  const [selectedItems, setSelectedItems] = useState<string[]>(['1']);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === ORDER_ITEMS.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(ORDER_ITEMS.map((item) => item.id));
    }
  };

  const handleContinue = () => {
    console.log('Continue with issue:', selectedIssueType);
    console.log('Selected items:', selectedItems);
    // Navigate to next step or submit
  };

  const isAllSelected = selectedItems.length === ORDER_ITEMS.length;

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
          <Text style={styles.sectionTitle}>What went wrong?</Text>
          <View style={styles.issueTypesGrid}>
            {ISSUE_TYPES.map((issue, index) => {
              const IconComponent = issue.icon;
              const isSelected = selectedIssueType === issue.id;
              const isOther = issue.id === 'other';

              return (
                <TouchableOpacity
                  key={issue.id}
                  style={[
                    styles.issueTypeCard,
                    isOther && styles.issueTypeCardWide,
                    isSelected && styles.issueTypeCardSelected,
                  ]}
                  onPress={() => setSelectedIssueType(issue.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.issueTypeTop}>
                    <View
                      style={[
                        styles.issueTypeIconContainer,
                        isSelected && styles.issueTypeIconContainerSelected,
                      ]}
                    >
                      <IconComponent
                        size={20}
                        color={isSelected ? ZORA_RED : 'rgba(255, 255, 255, 0.7)'}
                        weight="fill"
                      />
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}
                    >
                      {isSelected && (
                        <View style={styles.radioButtonInner} />
                      )}
                    </View>
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
        <View style={{ height: 32 }} />

        {/* Item Selection Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select affected items</Text>
            <TouchableOpacity onPress={selectAllItems}>
              <Text style={styles.selectAllText}>
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemsList}>
            {ORDER_ITEMS.map((item) => {
              const isSelected = selectedItems.includes(item.id);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isSelected && styles.itemCardSelected,
                  ]}
                  onPress={() => toggleItemSelection(item.id)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text
                      style={[
                        styles.itemName,
                        isSelected && styles.itemNameSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.itemDetails}>
                      Qty: {item.quantity} • £{item.price.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <CheckCircle size={20} color={Colors.textPrimary} weight="fill" />
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
            selectedItems.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.9}
          disabled={selectedItems.length === 0}
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(24, 16, 16, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerRight: {
    width: 44,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  selectAllText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: ZORA_RED,
    marginBottom: 16,
  },

  // Issue Types Grid
  issueTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  issueTypeCard: {
    width: '48%',
    aspectRatio: 1.4,
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 16,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  issueTypeCardWide: {
    width: '100%',
    aspectRatio: undefined,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  issueTypeCardSelected: {
    borderColor: ZORA_RED,
  },
  issueTypeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  issueTypeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueTypeIconContainerSelected: {
    backgroundColor: 'rgba(204, 0, 0, 0.2)',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: ZORA_RED,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ZORA_RED,
  },
  issueTypeLabel: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  issueTypeLabelSelected: {
    color: Colors.textPrimary,
  },

  // Items List
  itemsList: {
    gap: 8,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: BACKGROUND_DARK,
    borderRadius: BorderRadius.xl,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemCardSelected: {
    backgroundColor: SURFACE_DARK,
    borderColor: ZORA_RED,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: '#44403C',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  itemNameSelected: {
    fontFamily: FontFamily.bodyBold,
  },
  itemDetails: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#563939',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ZORA_RED,
    height: 56,
    borderRadius: 28,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(204, 0, 0, 0.5)',
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
});
