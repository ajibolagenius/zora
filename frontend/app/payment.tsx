import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Platform,
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
  CheckCircle,
  Warning,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { useCartStore } from '../stores/cartStore';
import { 
  paymentService, 
  stripeService, 
  klarnaService, 
  clearpayService,
  type PaymentMethod,
  type PaymentResult,
} from '../services/paymentService';

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_CARD = '#3A2A21';
const SURFACE_DARK = '#2D1E18';
const SUCCESS_GREEN = '#22C55E';

type PaymentMethodType = 'saved' | 'card' | 'klarna' | 'clearpay' | 'apple_pay' | 'google_pay';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, subtotal, total, clearCart } = useCartStore();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('saved');
  const [useZoraCredit, setUseZoraCredit] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  
  const zoraCredit = 12.50;
  const orderTotal = total || 45.49;
  const finalTotal = useZoraCredit ? Math.max(0, orderTotal - zoraCredit) : orderTotal;
  
  // Get available payment methods based on order total
  const availablePaymentMethods = paymentService.getAvailablePaymentMethods(finalTotal);
  
  // Get Klarna payment options
  const klarnaOptions = klarnaService.getPaymentOptions(finalTotal);
  const klarnaPayIn3 = klarnaOptions.find(opt => opt.id === 'pay_in_3');
  
  // Get Clearpay installment info
  const clearpayInfo = clearpayService.getInstallmentInfo(finalTotal);

  const handlePay = async () => {
    setIsProcessing(true);
    
    try {
      // Prepare payment data
      const paymentData = {
        orderId: `ZAM-${Date.now()}`,
        amount: finalTotal,
        currency: 'gbp',
        customerEmail: 'customer@example.com',
        customerName: 'Jane Doe',
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          line1: '123 Zora Lane, Apartment 4B',
          city: 'London',
          postalCode: 'SE1 7PB',
          country: 'GB',
        },
      };
      
      // Map UI payment method to service payment method
      let serviceMethod: PaymentMethod;
      switch (selectedMethod) {
        case 'saved':
        case 'card':
          serviceMethod = 'card';
          setProcessingStep('Creating payment intent...');
          break;
        case 'apple_pay':
          serviceMethod = 'apple_pay';
          setProcessingStep('Launching Apple Pay...');
          break;
        case 'google_pay':
          serviceMethod = 'google_pay';
          setProcessingStep('Launching Google Pay...');
          break;
        case 'klarna':
          serviceMethod = 'klarna';
          setProcessingStep('Connecting to Klarna...');
          break;
        case 'clearpay':
          serviceMethod = 'clearpay';
          setProcessingStep('Connecting to Clearpay...');
          break;
        default:
          serviceMethod = 'card';
      }
      
      // Simulate card details for demo (in production, use Stripe card form)
      const mockCardDetails = {
        number: '4242424242424242',
        expMonth: 12,
        expYear: 2025,
        cvc: '123',
      };
      
      setProcessingStep('Processing payment...');
      
      // Process the payment
      const result: PaymentResult = await paymentService.processPayment(
        serviceMethod,
        paymentData,
        serviceMethod === 'card' ? mockCardDetails : { category: 'pay_in_3' }
      );
      
      if (result.success) {
        setProcessingStep('Payment successful!');
        
        // If requires action (e.g., Klarna/Clearpay redirect)
        if (result.requiresAction && result.actionUrl) {
          Alert.alert(
            'Redirect Required',
            'You will be redirected to complete your payment.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  // In production, open the URL in WebView or browser
                  // For demo, just navigate to confirmation
                  clearCart();
                  router.push({
                    pathname: '/order-confirmation',
                    params: { orderId: paymentData.orderId },
                  });
                },
              },
            ]
          );
        } else {
          // Payment complete, go to confirmation
          setTimeout(() => {
            clearCart();
            router.push({
              pathname: '/order-confirmation',
              params: { orderId: paymentData.orderId },
            });
          }, 1000);
        }
      } else {
        Alert.alert(
          'Payment Failed',
          result.error || 'An error occurred while processing your payment. Please try again.',
          [{ text: 'OK', onPress: () => setIsProcessing(false) }]
        );
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK', onPress: () => setIsProcessing(false) }]
      );
    }
  };

  // Build payment methods list dynamically
  const paymentMethods = [
    { 
      id: 'card' as PaymentMethodType, 
      name: 'Credit/Debit Card', 
      subtitle: 'Visa, Mastercard, Amex',
      icon: 'card', 
      bgColor: 'rgba(255,255,255,0.05)',
      available: true,
    },
    { 
      id: 'klarna' as PaymentMethodType, 
      name: 'Klarna', 
      subtitle: klarnaPayIn3 ? klarnaPayIn3.description : 'Pay in 3 interest-free', 
      bgColor: '#FFB3C7', 
      textColor: '#000',
      available: klarnaPayIn3?.available ?? false,
    },
    { 
      id: 'clearpay' as PaymentMethodType, 
      name: 'Clearpay', 
      subtitle: clearpayInfo?.description || 'Pay in 4', 
      bgColor: '#B2FCE4', 
      textColor: '#000',
      available: clearpayInfo?.available ?? false,
    },
  ];
  
  // Add platform-specific payment methods
  if (Platform.OS === 'ios') {
    paymentMethods.push({ 
      id: 'apple_pay' as PaymentMethodType, 
      name: 'Apple Pay', 
      subtitle: undefined,
      bgColor: '#FFFFFF', 
      textColor: '#000',
      available: true,
    });
  }
  
  if (Platform.OS === 'android') {
    paymentMethods.push({ 
      id: 'google_pay' as PaymentMethodType, 
      name: 'Google Pay', 
      subtitle: undefined,
      bgColor: '#FFFFFF', 
      textColor: '#000',
      available: true,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={ZORA_RED} />
            <Text style={styles.processingText}>{processingStep}</Text>
            <Text style={styles.processingSubtext}>Please don't close this screen</Text>
          </View>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isProcessing}
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
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const isAvailable = method.available;
              
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardSelected,
                    !isAvailable && styles.methodCardDisabled,
                  ]}
                  onPress={() => isAvailable && setSelectedMethod(method.id)}
                  activeOpacity={isAvailable ? 0.8 : 1}
                  disabled={!isAvailable}
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
                      {method.id === 'apple_pay' && (
                        <Text style={styles.applePayText}> Pay</Text>
                      )}
                      {method.id === 'google_pay' && (
                        <Text style={styles.googlePayText}>G Pay</Text>
                      )}
                    </View>
                    
                    {/* Method Name */}
                    <View style={styles.methodInfo}>
                      <Text style={[
                        styles.methodName,
                        !isAvailable && styles.methodNameDisabled
                      ]}>
                        {method.name}
                      </Text>
                      {method.subtitle && (
                        <Text style={[
                          styles.methodSubtitle,
                          !isAvailable && styles.methodSubtitleDisabled
                        ]}>
                          {method.subtitle}
                        </Text>
                      )}
                      {!isAvailable && (
                        <Text style={styles.unavailableText}>
                          Not available for this amount
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  {/* Radio */}
                  {isAvailable && (
                    <View style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  )}
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
          {useZoraCredit && (
            <View style={styles.creditAppliedBadge}>
              <CheckCircle size={16} color={SUCCESS_GREEN} weight="fill" />
              <Text style={styles.creditAppliedText}>
                £{zoraCredit.toFixed(2)} credit will be applied
              </Text>
            </View>
          )}
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
                <Text style={styles.summaryLabel}>Subtotal ({items.length || 3} items)</Text>
                <Text style={styles.summaryValue}>£{(subtotal || 57.99).toFixed(2)}</Text>
              </View>
              {useZoraCredit && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabelCredit}>Zora Credit</Text>
                  <Text style={styles.summaryValueCredit}>-£{zoraCredit.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValueFree}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelTotal}>Total</Text>
                <Text style={styles.summaryValueTotal}>£{finalTotal.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Method Info */}
        {selectedMethod === 'klarna' && klarnaPayIn3 && (
          <View style={styles.paymentInfoCard}>
            <Text style={styles.paymentInfoTitle}>Pay in 3 with Klarna</Text>
            <Text style={styles.paymentInfoText}>
              Split your purchase into 3 interest-free payments of £{(finalTotal / 3).toFixed(2)}.
              First payment today, then every 30 days.
            </Text>
          </View>
        )}
        
        {selectedMethod === 'clearpay' && clearpayInfo && (
          <View style={styles.paymentInfoCard}>
            <Text style={styles.paymentInfoTitle}>Pay in 4 with Clearpay</Text>
            <Text style={styles.paymentInfoText}>
              4 interest-free payments of £{clearpayInfo.installmentAmount.toFixed(2)}.
              First payment today, then fortnightly.
            </Text>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePay}
          activeOpacity={0.9}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>
            {isProcessing ? 'Processing...' : `Pay £${finalTotal.toFixed(2)}`}
          </Text>
          {!isProcessing && <ArrowRight size={20} color={Colors.textPrimary} weight="bold" />}
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
  
  // Processing Overlay
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  processingCard: {
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  processingText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginTop: 16,
  },
  processingSubtext: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 8,
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
  
  // Radio Button
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: ZORA_RED,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ZORA_RED,
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
  methodCardDisabled: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
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
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  methodNameDisabled: {
    color: Colors.textMuted,
  },
  methodSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  methodSubtitleDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
  unavailableText: {
    fontFamily: FontFamily.body,
    fontSize: 10,
    color: '#FF6B6B',
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
  creditAppliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingLeft: 4,
  },
  creditAppliedText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: SUCCESS_GREEN,
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
    marginVertical: Spacing.md,
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
    color: SUCCESS_GREEN,
  },
  summaryLabelTotal: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  summaryValueTotal: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  
  // Payment Info Card
  paymentInfoCard: {
    backgroundColor: 'rgba(255, 179, 199, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 199, 0.2)',
    marginBottom: Spacing.lg,
  },
  paymentInfoTitle: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paymentInfoText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    lineHeight: 18,
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
  payButtonDisabled: {
    opacity: 0.7,
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
