import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CreditCard,
  CaretDown,
  CaretUp,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { useCartStore } from '../stores/cartStore';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_CARD = '#3A2A21';
const SURFACE_DARK = '#2D1E18';

type PaymentMethod = 'saved' | 'card' | 'klarna' | 'clearpay' | 'applepay' | 'googlepay';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: 'card', bgColor: 'rgba(255,255,255,0.05)' },
  { id: 'klarna', name: 'Klarna', subtitle: 'Pay in 3 interest-free', bgColor: '#FFB3C7', textColor: '#000' },
  { id: 'clearpay', name: 'Clearpay', subtitle: 'Pay in 4', bgColor: '#B2FCE4', textColor: '#000' },
  { id: 'applepay', name: 'Apple Pay', bgColor: '#FFFFFF', textColor: '#000' },
  { id: 'googlepay', name: 'Google Pay', bgColor: '#FFFFFF', textColor: '#000' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { subtotal, total } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('saved');
  const [useZoraCredit, setUseZoraCredit] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  
  const zoraCredit = 12.50;
  const finalTotal = useZoraCredit ? Math.max(0, (total || 45.49) - zoraCredit) : (total || 45.49);

  const handlePay = () => {
    // TODO: Navigate to order confirmation when implemented
    console.log('Processing payment...');
    // router.push('/order-confirmation');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <Text style={styles.stepText}>STEP 2/3</Text>
          </View>
          
          {/* Trust Badge */}
          <View style={styles.trustBadge}>
            <Lock size={14} color="#bc9a9a" weight="fill" />
            <Text style={styles.trustBadgeText}>SECURE CHECKOUT</Text>
          </View>
        </View>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Card Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Card</Text>
          <TouchableOpacity
            style={[
              styles.savedCardContainer,
              selectedMethod === 'saved' && styles.savedCardContainerSelected,
            ]}
            onPress={() => setSelectedMethod('saved')}
            activeOpacity={0.8}
          >
            {/* Radio indicator */}
            <View style={styles.savedCardRadio}>
              <View style={[
                styles.radioOuter,
                selectedMethod === 'saved' && styles.radioOuterSelected,
              ]}>
                {selectedMethod === 'saved' && <View style={styles.radioInner} />}
              </View>
            </View>
            
            {/* Card Info */}
            <View style={styles.savedCardInner}>
              <View style={styles.visaLogo}>
                <Text style={styles.visaText}>VISA</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardNumber}>Visa ending in 4242</Text>
                <Text style={styles.cardExpiry}>Expires 12/25</Text>
              </View>
            </View>
            
            {/* Edit Link */}
            <View style={styles.savedCardFooter}>
              <TouchableOpacity>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.methodsContainer}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardSelected,
                  ]}
                  onPress={() => setSelectedMethod(method.id as PaymentMethod)}
                  activeOpacity={0.8}
                >
                  <View style={styles.methodLeft}>
                    {/* Method Icon/Logo */}
                    <View style={[styles.methodLogo, { backgroundColor: method.bgColor }]}>
                      {method.id === 'card' && (
                        <CreditCard size={20} color="rgba(255,255,255,0.8)" weight="regular" />
                      )}
                      {method.id === 'klarna' && (
                        <Text style={styles.klarnaText}>Klarna.</Text>
                      )}
                      {method.id === 'clearpay' && (
                        <Text style={styles.clearpayText}>Clear{'\n'}Pay</Text>
                      )}
                      {method.id === 'applepay' && (
                        <Text style={styles.applePayText}> Pay</Text>
                      )}
                      {method.id === 'googlepay' && (
                        <Text style={styles.googlePayText}>G Pay</Text>
                      )}
                    </View>
                    
                    {/* Method Name */}
                    <View>
                      <Text style={styles.methodName}>{method.name}</Text>
                      {method.subtitle && (
                        <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  
                  {/* Radio */}
                  <View style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Zora Credit Toggle */}
        <View style={styles.section}>
          <View style={styles.zoraCreditCard}>
            <View style={styles.zoraCreditInfo}>
              <Text style={styles.zoraCreditTitle}>Use Zora Credit</Text>
              <View style={styles.zoraCreditAmount}>
                <Text style={styles.zoraCreditValue}>£{zoraCredit.toFixed(2)}</Text>
                <Text style={styles.zoraCreditLabel}>Available balance</Text>
              </View>
            </View>
            <Switch
              value={useZoraCredit}
              onValueChange={setUseZoraCredit}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: ZORA_RED }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Order Summary Accordion */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.orderSummaryHeader}
            onPress={() => setShowOrderSummary(!showOrderSummary)}
            activeOpacity={0.8}
          >
            <Text style={styles.orderSummaryTitle}>Order Summary</Text>
            <View style={styles.orderSummaryRight}>
              <Text style={styles.orderSummaryTotal}>£{finalTotal.toFixed(2)}</Text>
              {showOrderSummary ? (
                <CaretUp size={20} color="rgba(255,255,255,0.5)" weight="bold" />
              ) : (
                <CaretDown size={20} color="rgba(255,255,255,0.5)" weight="bold" />
              )}
            </View>
          </TouchableOpacity>
          
          {showOrderSummary && (
            <View style={styles.orderSummaryContent}>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal (3 items)</Text>
                <Text style={styles.summaryValue}>£{(subtotal || 57.99).toFixed(2)}</Text>
              </View>
              {useZoraCredit && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelCredit}>Zora Credit</Text>
                  <Text style={styles.summaryValueCredit}>-£{zoraCredit.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValueFree}>Free</Text>
              </View>
            </View>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePay}
          activeOpacity={0.9}
        >
          <Text style={styles.payButtonText}>Pay £{finalTotal.toFixed(2)}</Text>
          <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <View style={styles.securedBy}>
          <Lock size={12} color="rgba(255,255,255,0.3)" weight="fill" />
          <Text style={styles.securedByText}>SECURED BY STRIPE</Text>
        </View>
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
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: ZORA_RED,
    letterSpacing: 2,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: ZORA_CARD,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  trustBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 9,
    color: '#bc9a9a',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: 28,
    color: Colors.textPrimary,
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
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginLeft: 4,
  },
  
  // Saved Card
  savedCardContainer: {
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    padding: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  savedCardContainerSelected: {
    borderColor: ZORA_RED,
  },
  savedCardRadio: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  savedCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.md,
    padding: Spacing.base,
  },
  visaLogo: {
    width: 56,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visaText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 16,
    color: '#1a1f71',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  cardDetails: {
    flex: 1,
  },
  cardNumber: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  cardExpiry: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  savedCardFooter: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: 6,
  },
  editLink: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  
  // Payment Methods
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  methodCardSelected: {
    borderColor: ZORA_RED,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  methodLogo: {
    width: 56,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  methodName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  methodSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  klarnaText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: '#000',
  },
  clearpayText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 8,
    color: '#000',
    textAlign: 'center',
    lineHeight: 10,
    textTransform: 'uppercase',
  },
  applePayText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: '#000',
  },
  googlePayText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 11,
    color: '#000',
  },
  
  // Zora Credit
  zoraCreditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SURFACE_DARK,
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  zoraCreditInfo: {
    gap: 4,
  },
  zoraCreditTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  zoraCreditAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoraCreditValue: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  zoraCreditLabel: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  
  // Order Summary
  orderSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: Spacing.base,
  },
  orderSummaryTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.7)',
  },
  orderSummaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderSummaryTotal: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  orderSummaryContent: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    marginTop: -1,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  summaryValue: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  summaryLabelCredit: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: ZORA_RED,
  },
  summaryValueCredit: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: 12,
    color: ZORA_RED,
  },
  summaryValueFree: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: ZORA_RED,
    borderRadius: BorderRadius.full,
    paddingVertical: 16,
  },
  payButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  securedBy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  securedByText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 9,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
});
