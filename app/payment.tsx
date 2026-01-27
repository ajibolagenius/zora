import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CreditCard,
  Wallet,
  CheckCircle,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Heights } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { AnimationDuration, AnimationEasing } from '../constants';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { orderService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  paymentService, 
  klarnaService, 
  clearpayService,
  type PaymentMethod,
  type PaymentResult,
} from '../services/paymentService';

type PaymentMethodType = 'card' | 'klarna' | 'clearpay';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, subtotal, total, deliveryFee, serviceFee, discount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('card');
  const [useZoraCredit, setUseZoraCredit] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

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
          name: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.product?.price || 0,
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
        setProcessingStep('Creating order...');
        
        // Create order in database
        let createdOrderId = paymentData.orderId;
        if (isSupabaseConfigured() && user?.user_id) {
          try {
            const orderData = {
              user_id: user.user_id,
              status: 'pending' as const,
              payment_status: 'paid' as const,
              items: items.map(item => ({
                product_id: item.product_id,
                vendor_id: item.vendor_id,
                name: item.product?.name || item.name || 'Unknown Product',
                image_url: item.product?.image_url || '',
                quantity: item.quantity,
                price: item.product?.price || item.price || 0,
              })),
              subtotal: subtotal || 0,
              delivery_fee: deliveryFee || 0,
              service_fee: serviceFee || 0.50,
              discount: discount || (useZoraCredit ? zoraCredit : 0),
              total: finalTotal,
              currency: 'GBP',
              delivery_option: 'delivery' as const,
              payment_method: selectedMethod === 'card' ? 'card' : selectedMethod,
            };

            const createdOrder = await orderService.create(orderData);
            if (createdOrder) {
              createdOrderId = createdOrder.id;
            }
          } catch (error) {
            console.error('Error creating order:', error);
            // Continue with payment orderId if order creation fails
          }
        }
        
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
                    params: { orderId: createdOrderId },
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
              params: { orderId: createdOrderId },
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

  // Build payment methods list
  const paymentMethods = [
    { 
      id: 'card' as PaymentMethodType, 
      name: 'Credit or Debit Card', 
      subtitle: undefined,
      available: true,
    },
    { 
      id: 'klarna' as PaymentMethodType, 
      name: 'Klarna.', 
      subtitle: klarnaPayIn3 ? klarnaPayIn3.description : 'Pay in 3 interest-free installments', 
      bgColor: '#FFB3C7', 
      textColor: '#000',
      available: klarnaPayIn3?.available ?? true,
    },
    { 
      id: 'clearpay' as PaymentMethodType, 
      name: 'Clearpay', 
      subtitle: clearpayInfo?.description || '4 interest-free payments', 
      bgColor: '#B2FCE4', 
      textColor: '#000',
      available: clearpayInfo?.available ?? true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.processingText}>{processingStep}</Text>
            <Text style={styles.processingSubtext}>Please don't close this screen</Text>
          </View>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <ArrowLeft size={22} color={Colors.textPrimary} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <Animated.ScrollView 
        style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Zora Credits Card */}
        <View style={styles.zoraCreditCard}>
          <View style={styles.zoraCreditLeft}>
            <View style={styles.zoraCreditIconContainer}>
              <Wallet size={20} color={Colors.textPrimary} weight="duotone" />
            </View>
            <View style={styles.zoraCreditInfo}>
              <Text style={styles.zoraCreditTitle}>Zora Credits</Text>
              <Text style={styles.zoraCreditBalance}>Balance: £{zoraCredit.toFixed(2)}</Text>
            </View>
          </View>
          <Switch
            value={useZoraCredit}
            onValueChange={setUseZoraCredit}
            trackColor={{ false: Colors.white10, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
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
                    <View style={[styles.methodLogo, method.bgColor && { backgroundColor: method.bgColor }]}>
                      {method.id === 'card' && (
                        <CreditCard size={20} color={Colors.textPrimary} weight="duotone" />
                      )}
                      {method.id === 'klarna' && (
                        <Text style={styles.klarnaText}>Kl.</Text>
                      )}
                      {method.id === 'clearpay' && (
                        <Text style={styles.clearpayText}>cp</Text>
                      )}
                    </View>
                    
                    {/* Method Name */}
                    <View style={styles.methodInfo}>
                      <Text style={[styles.methodName, !isAvailable && styles.methodNameDisabled]}>
                        {method.name}
                      </Text>
                      {method.subtitle && (
                        <Text style={[styles.methodSubtitle, !isAvailable && styles.methodSubtitleDisabled]}>
                          {method.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  {/* Radio */}
                  {isAvailable && (
                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.section}>
          <View style={styles.orderSummaryCard}>
            <Text style={styles.orderSummaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>£{(subtotal || 80.00).toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRowDashed}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>£4.99</Text>
            </View>
            
            {useZoraCredit && (
              <View style={styles.summaryRow}>
                <View style={styles.summaryLabelWithIcon}>
                  <CheckCircle size={14} color={Colors.primary} weight="fill" />
                  <Text style={styles.summaryLabelCredit}>Zora Credits</Text>
                </View>
                <Text style={styles.summaryValueCredit}>-£{zoraCredit.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.summaryRowDashed}>
              <Text style={styles.summaryLabel}>Taxes</Text>
              <Text style={styles.summaryValue}>£0.00</Text>
            </View>
          </View>
        </View>

        {/* Secured Badge */}
        <View style={styles.securedBadge}>
          <Lock size={14} color={Colors.textMuted} weight="fill" />
          <Text style={styles.securedBadgeText}>ENCRYPTED & SECURE</Text>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 140 }} />
      </Animated.ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.footerTotalRow}>
          <Text style={styles.footerTotalLabel}>Total to pay</Text>
          <Text style={styles.footerTotalValue}>£{finalTotal.toFixed(2)}</Text>
        </View>
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
    backgroundColor: Colors.black80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  processingCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '80%',
  },
  processingText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
  },
  processingSubtext: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardDark,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  // Zora Credit Card
  zoraCreditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  zoraCreditLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  zoraCreditIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoraCreditInfo: {
    gap: 2,
  },
  zoraCreditTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  zoraCreditBalance: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  
  // Radio Button
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
  
  // Payment Methods
  methodsContainer: {
    gap: Spacing.md,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
  },
  methodCardDisabled: {
    opacity: 0.5,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  methodLogo: {
    width: 48,
    height: 36,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  methodNameDisabled: {
    color: Colors.textMuted,
  },
  methodSubtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  methodSubtitleDisabled: {
    color: Colors.textMuted,
  },
  klarnaText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: '#000',
  },
  clearpayText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: '#000',
  },
  
  // Order Summary Card
  orderSummaryCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  orderSummaryTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryRowDashed: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    borderStyle: 'dashed',
  },
  summaryLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
  },
  summaryLabelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  summaryLabelCredit: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  summaryValueCredit: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.primary,
  },
  
  // Secured Badge
  securedBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  securedBadgeText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.tiny,
    color: Colors.textMuted,
    letterSpacing: 1,
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
    borderTopColor: Colors.borderDark,
  },
  footerTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  footerTotalLabel: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
  },
  footerTotalValue: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  payButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: Heights.button,
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
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
});
