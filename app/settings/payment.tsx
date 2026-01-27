import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Trash,
  CheckCircle,
  Bank,
  Wallet,
} from 'phosphor-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { FontSize, FontFamily, LetterSpacing } from '../../constants/typography';
import { useAuthStore } from '../../stores/authStore';
import { realtimeService } from '../../services/realtimeService';
import { isSupabaseConfigured } from '../../lib/supabase';

// Available colors from Design System for randomized icons
const DESIGN_SYSTEM_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.success,
  Colors.info,
  Colors.badgeEcoFriendly,
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

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'applepay' | 'googlepay';
  last4: string;
  expiry: string;
  isDefault: boolean;
  color: string;
}

const PAYMENT_METHODS_BASE: Omit<PaymentMethod, 'color'>[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '03/25', isDefault: false },
];

const getCardIcon = (type: string) => {
  switch (type) {
    case 'visa':
      return { color: '#1A1F71', label: 'VISA' };
    case 'mastercard':
      return { color: '#EB001B', label: 'MC' };
    case 'applepay':
      return { color: '#000000', label: 'Pay' };
    case 'googlepay':
      return { color: '#4285F4', label: 'G Pay' };
    default:
      return { color: Colors.textMuted, label: 'Card' };
  }
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { user, checkAuth } = useAuthStore();
  const [methods, setMethods] = useState(PAYMENT_METHODS_BASE);

  // Subscribe to real-time profile updates (for any payment-related preferences)
  useEffect(() => {
    if (!isSupabaseConfigured() || !user?.user_id) return;

    const unsubscribe = realtimeService.subscribeToTable(
      'profiles',
      'UPDATE',
      async (payload) => {
        if (payload.new?.id === user.user_id) {
          // Profile was updated, refresh user data
          await checkAuth();
        }
      },
      `id=eq.${user.user_id}`
    );

    return () => {
      if (unsubscribe) {
        unsubscribe.then((unsub) => {
          if (typeof unsub === 'function') {
            unsub();
          }
        });
      }
    };
  }, [user?.user_id]);

  // Assign random colors to payment methods
  const paymentMethods = useMemo(() => {
    const shuffledColors = shuffleArray(DESIGN_SYSTEM_COLORS);
    return methods.map((method, index) => ({
      ...method,
      color: shuffledColors[index % shuffledColors.length],
    }));
  }, [methods]);

  const handleSetDefault = (id: string) => {
    setMethods(methods.map(m => ({
      ...m,
      isDefault: m.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setMethods(methods.filter(m => m.id !== id)),
        },
      ]
    );
  };

  const handleAddCard = () => {
    Alert.alert('Add Card', 'Card addition feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          <View style={styles.cardsList}>
            {paymentMethods.map((method) => {
              const cardInfo = getCardIcon(method.type);
              return (
                <View
                  key={method.id}
                  style={[
                    styles.cardItem,
                    method.isDefault && styles.cardItemDefault,
                  ]}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.cardIconContainer, { backgroundColor: cardInfo.color }]}>
                      <Text style={styles.cardIconText}>{cardInfo.label}</Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardNumber}>•••• •••• •••• {method.last4}</Text>
                      <Text style={styles.cardExpiry}>Expires {method.expiry}</Text>
                    </View>
                  </View>
                  <View style={styles.cardActions}>
                    {method.isDefault ? (
                      <View style={styles.defaultBadge}>
                        <CheckCircle size={16} color={Colors.primary} weight="duotone" />
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.setDefaultText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(method.id)}
                      activeOpacity={0.8}
                    >
                      <Trash size={20} color={Colors.error} weight="duotone" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Add Card Button */}
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={handleAddCard}
              activeOpacity={0.8}
            >
              <View style={styles.addCardIcon}>
                <Plus size={24} color={Colors.primary} weight="bold" />
              </View>
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Payment Options</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem} activeOpacity={0.8}>
              <View style={[styles.optionIcon, { backgroundColor: `${Colors.secondary}20` }]}>
                <Wallet size={24} color={Colors.secondary} weight="duotone" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Apple Pay</Text>
                <Text style={styles.optionSubtitle}>Not connected</Text>
              </View>
              <Text style={styles.optionAction}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} activeOpacity={0.8}>
              <View style={[styles.optionIcon, { backgroundColor: `${Colors.info}20` }]}>
                <Wallet size={24} color={Colors.info} weight="duotone" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Google Pay</Text>
                <Text style={styles.optionSubtitle}>Not connected</Text>
              </View>
              <Text style={styles.optionAction}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} activeOpacity={0.8}>
              <View style={[styles.optionIcon, { backgroundColor: `${Colors.success}20` }]}>
                <Bank size={24} color={Colors.success} weight="duotone" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Bank Transfer</Text>
                <Text style={styles.optionSubtitle}>Pay directly from bank</Text>
              </View>
              <Text style={styles.optionAction}>Setup</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zora Credit */}
        <View style={styles.creditCard}>
          <View style={styles.creditHeader}>
            <Text style={styles.creditTitle}>Zora Credit</Text>
            <Text style={styles.creditBalance}>£{user?.zora_credits?.toFixed(2) || '12.50'}</Text>
          </View>
          <Text style={styles.creditDescription}>
            Use your Zora credit balance for faster checkout. Earn credit through referrals and rewards.
          </Text>
          <TouchableOpacity
            style={styles.creditButton}
            onPress={() => router.push('/rewards')}
            activeOpacity={0.8}
          >
            <Text style={styles.creditButtonText}>View Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
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
    padding: Spacing.base,
    gap: Spacing['2xl'],
  },

  // Section
  section: {
    gap: Spacing.base,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.xs,
  },

  // Cards List
  cardsList: {
    gap: Spacing.md,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  cardItemDefault: {
    borderColor: `${Colors.primary}40`,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardIconContainer: {
    width: 48,
    height: 32,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.tiny,
    color: Colors.textPrimary,
    letterSpacing: LetterSpacing.wide,
  },
  cardInfo: {
    gap: 2,
  },
  cardNumber: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  cardExpiry: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  defaultText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.caption,
    color: Colors.primary,
  },
  setDefaultButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.md,
  },
  setDefaultText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Add Card Button
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: `${Colors.primary}0D`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: `${Colors.primary}40`,
  },
  addCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.primary,
  },

  // Options List
  optionsList: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  optionSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  optionAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },

  // Credit Card
  creditCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: `${Colors.secondary}33`,
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  creditTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: Colors.secondary,
  },
  creditBalance: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h2,
    color: Colors.textPrimary,
  },
  creditDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  creditButton: {
    backgroundColor: `${Colors.secondary}20`,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  creditButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.secondary,
  },
});
