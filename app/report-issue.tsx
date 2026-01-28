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
  ActivityIndicator,
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
import { AnimationDuration, AnimationEasing, PlaceholderImages } from '../constants';
import { orderService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { safeGoBack } from '../lib/navigationHelpers';

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
  quantity?: number;
}

export default function ReportIssueScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ orderId?: string }>();
  const { user } = useAuthStore();
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!params.orderId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const order = await orderService.getById(params.orderId);
        if (order && order.items) {
          const items = Array.isArray(order.items) 
            ? order.items 
            : typeof order.items === 'object' 
              ? Object.values(order.items) 
              : [];
          
          const formattedItems: OrderItem[] = items.map((item: any, index: number) => ({
            id: item.product_id || item.id || `item-${index}`,
            name: item.name || 'Unknown Product',
            price: item.price || 0,
            image: item.image_url || item.image || PlaceholderImages.image200,
            quantity: item.quantity || 1,
          }));
          
          setOrderItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching order items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [params.orderId]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleContinue = () => {
    if (!selectedIssueType || selectedItems.length === 0) return;
    
    router.push({
      pathname: '/dispute-details',
      params: {
        orderId: params.orderId,
        issueType: selectedIssueType,
        selectedItems: selectedItems.join(','),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => safeGoBack(router, '/(tabs)/orders')}
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : orderItems.length > 0 ? (
            <View style={styles.itemsList}>
              {orderItems.map((item) => {
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
                        <Text style={styles.itemPrice}>£{item.price.toFixed(2)} {item.quantity && item.quantity > 1 ? `(x${item.quantity})` : ''}</Text>
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
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found for this order</Text>
            </View>
          )}
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
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.black30,
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
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
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
    borderColor: Colors.borderDark,
  },
  issueTypeItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.white20,
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
    borderTopColor: Colors.borderDark,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
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
    borderColor: Colors.white20,
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
    borderTopColor: Colors.borderDark,
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
    backgroundColor: Colors.primary + '66', // 40% opacity
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
