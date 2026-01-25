import React, { useState } from 'react';
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
import { FontSize, FontFamily } from '../../constants/typography';

// Zora Brand Colors
const ZORA_RED = '#CC0000';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#342418';
const BACKGROUND_DARK = '#221710';
const MUTED_TEXT = '#bc9a9a';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'applepay' | 'googlepay';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
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
      return { color: MUTED_TEXT, label: 'Card' };
  }
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState(PAYMENT_METHODS);

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
            {methods.map((method) => {
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
                        <CheckCircle size={16} color={ZORA_RED} weight="fill" />
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                      >
                        <Text style={styles.setDefaultText}>Set Default</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(method.id)}
                    >
                      <Trash size={20} color="#EF4444" weight="regular" />
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
                <Plus size={24} color={ZORA_RED} weight="bold" />
              </View>
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Other Payment Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Payment Options</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIcon}>
                <Wallet size={24} color={ZORA_YELLOW} weight="fill" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Apple Pay</Text>
                <Text style={styles.optionSubtitle}>Not connected</Text>
              </View>
              <Text style={styles.optionAction}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIcon}>
                <Wallet size={24} color="#4285F4" weight="fill" />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Google Pay</Text>
                <Text style={styles.optionSubtitle}>Not connected</Text>
              </View>
              <Text style={styles.optionAction}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem}>
              <View style={styles.optionIcon}>
                <Bank size={24} color="#22C55E" weight="fill" />
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
            <Text style={styles.creditBalance}>£12.50</Text>
          </View>
          <Text style={styles.creditDescription}>
            Use your Zora credit balance for faster checkout. Earn credit through referrals and rewards.
          </Text>
          <TouchableOpacity
            style={styles.creditButton}
            onPress={() => router.push('/rewards')}
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
    backgroundColor: BACKGROUND_DARK,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    backgroundColor: `${BACKGROUND_DARK}F2`,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
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
    padding: Spacing.base,
    gap: 32,
  },

  // Section
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: FontFamily.display,
    fontSize: 20,
    color: Colors.textPrimary,
    paddingHorizontal: 4,
  },

  // Cards List
  cardsList: {
    gap: 12,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardItemDefault: {
    borderColor: `${ZORA_RED}40`,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIconContainer: {
    width: 48,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 10,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
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
    fontSize: 12,
    color: MUTED_TEXT,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 12,
    color: ZORA_RED,
  },
  setDefaultButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.sm,
  },
  setDefaultText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: MUTED_TEXT,
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
    gap: 16,
    backgroundColor: 'rgba(204, 0, 0, 0.05)',
    borderRadius: BorderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: `${ZORA_RED}40`,
  },
  addCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(204, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: ZORA_RED,
  },

  // Options List
  optionsList: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
    fontSize: 12,
    color: MUTED_TEXT,
  },
  optionAction: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },

  // Credit Card
  creditCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: `${ZORA_YELLOW}20`,
  },
  creditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  creditTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.body,
    color: ZORA_YELLOW,
  },
  creditBalance: {
    fontFamily: FontFamily.display,
    fontSize: 24,
    color: Colors.textPrimary,
  },
  creditDescription: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: MUTED_TEXT,
    lineHeight: 20,
    marginBottom: 16,
  },
  creditButton: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  creditButtonText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: ZORA_YELLOW,
  },
});
