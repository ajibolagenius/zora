/**
 * Payment Service
 * Handles Stripe, Klarna, and Clearpay payment integrations
 */

import { Platform } from 'react-native';
import { PaymentLimits } from '../constants';

// Configuration
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here';
const KLARNA_CLIENT_ID = process.env.EXPO_PUBLIC_KLARNA_CLIENT_ID || 'your_klarna_client_id_here';
const CLEARPAY_MERCHANT_ID = process.env.EXPO_PUBLIC_CLEARPAY_MERCHANT_ID || 'your_clearpay_merchant_id_here';

// Check if payment providers are configured
const isStripeConfigured = () => !STRIPE_PUBLISHABLE_KEY.includes('your_stripe');
const isKlarnaConfigured = () => !KLARNA_CLIENT_ID.includes('your_klarna');
const isClearpayConfigured = () => !CLEARPAY_MERCHANT_ID.includes('your_clearpay');

// Payment method types
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'klarna' | 'clearpay';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
  requiresAction?: boolean;
  actionUrl?: string;
}

export interface OrderPaymentData {
  orderId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

// ============== STRIPE SERVICE ==============
export const stripeService = {
  // Initialize Stripe (called once at app start)
  initialize: async () => {
    if (!isStripeConfigured()) {
      console.warn('Stripe is not configured. Payment will use mock mode.');
      return false;
    }
    
    // In a real app, you would initialize the Stripe SDK here
    // import { initStripe } from '@stripe/stripe-react-native';
    // await initStripe({ publishableKey: STRIPE_PUBLISHABLE_KEY });
    
    return true;
  },
  
  // Create a payment intent (should call your backend)
  createPaymentIntent: async (data: OrderPaymentData): Promise<PaymentIntent> => {
    if (!isStripeConfigured()) {
      // Mock payment intent for demo
      return {
        id: `pi_mock_${Date.now()}`,
        clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency,
        status: 'requires_payment_method',
      };
    }
    
    // In production, call your backend to create the payment intent
    // const response = await fetch('/api/payments/create-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // return response.json();
    
    // Mock for demo
    return {
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(data.amount * 100),
      currency: data.currency,
      status: 'requires_payment_method',
    };
  },
  
  // Confirm card payment
  confirmCardPayment: async (
    clientSecret: string,
    cardDetails: {
      number: string;
      expMonth: number;
      expYear: number;
      cvc: string;
    }
  ): Promise<PaymentResult> => {
    if (!isStripeConfigured()) {
      // Mock successful payment
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return {
        success: true,
        paymentIntentId: clientSecret.split('_secret_')[0],
      };
    }
    
    // In production, use the Stripe SDK
    // import { confirmPayment } from '@stripe/stripe-react-native';
    // const { paymentIntent, error } = await confirmPayment(clientSecret, {
    //   paymentMethodType: 'Card',
    //   paymentMethodData: { billingDetails: {} },
    // });
    
    // Mock for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      paymentIntentId: clientSecret.split('_secret_')[0],
    };
  },
  
  // Apple Pay
  confirmApplePay: async (
    clientSecret: string,
    merchantName: string
  ): Promise<PaymentResult> => {
    if (Platform.OS !== 'ios') {
      return { success: false, error: 'Apple Pay is only available on iOS' };
    }
    
    if (!isStripeConfigured()) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        paymentIntentId: clientSecret.split('_secret_')[0],
      };
    }
    
    // In production, use Stripe Apple Pay
    // import { presentApplePay, confirmApplePayPayment } from '@stripe/stripe-react-native';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      paymentIntentId: clientSecret.split('_secret_')[0],
    };
  },
  
  // Google Pay
  confirmGooglePay: async (
    clientSecret: string
  ): Promise<PaymentResult> => {
    if (Platform.OS !== 'android') {
      return { success: false, error: 'Google Pay is only available on Android' };
    }
    
    if (!isStripeConfigured()) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        paymentIntentId: clientSecret.split('_secret_')[0],
      };
    }
    
    // In production, use Stripe Google Pay
    // import { presentGooglePay, confirmGooglePayPayment } from '@stripe/stripe-react-native';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      paymentIntentId: clientSecret.split('_secret_')[0],
    };
  },
};

// ============== KLARNA SERVICE ==============
export const klarnaService = {
  isAvailable: () => isKlarnaConfigured(),
  
  // Create Klarna session
  createSession: async (data: OrderPaymentData): Promise<{
    sessionId: string;
    clientToken: string;
    paymentMethods: string[];
  }> => {
    if (!isKlarnaConfigured()) {
      // Mock Klarna session
      return {
        sessionId: `klarna_session_${Date.now()}`,
        clientToken: `klarna_token_${Math.random().toString(36).substr(2, 16)}`,
        paymentMethods: ['pay_later', 'pay_in_3', 'financing'],
      };
    }
    
    // In production, call Klarna API through your backend
    // const response = await fetch('/api/payments/klarna/create-session', { ... });
    
    return {
      sessionId: `klarna_session_${Date.now()}`,
      clientToken: `klarna_token_${Math.random().toString(36).substr(2, 16)}`,
      paymentMethods: ['pay_later', 'pay_in_3', 'financing'],
    };
  },
  
  // Authorize Klarna payment
  authorize: async (
    sessionId: string,
    paymentMethodCategory: 'pay_later' | 'pay_in_3' | 'financing'
  ): Promise<PaymentResult> => {
    if (!isKlarnaConfigured()) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: true,
        paymentIntentId: `klarna_auth_${Date.now()}`,
      };
    }
    
    // In production, use Klarna SDK or redirect to Klarna checkout
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      paymentIntentId: `klarna_auth_${Date.now()}`,
      requiresAction: true,
      actionUrl: `https://klarna.com/checkout/${sessionId}`,
    };
  },
  
  // Get available payment options for amount
  getPaymentOptions: (amount: number) => {
    const options = [];
    
    // Pay Later (Pay in 30 days)
    const payLaterLimits = PaymentLimits.payLater;
    options.push({
      id: 'pay_later',
      name: 'Pay Later',
      description: 'Pay in 30 days. No interest.',
      minAmount: payLaterLimits.minAmount,
      maxAmount: payLaterLimits.maxAmount,
      available: amount >= payLaterLimits.minAmount && amount <= payLaterLimits.maxAmount,
    });
    
    // Pay in 3
    const payIn3Limits = PaymentLimits.payIn3;
    if (amount >= payIn3Limits.minAmount) {
      const installment = (amount / 3).toFixed(2);
      options.push({
        id: 'pay_in_3',
        name: 'Pay in 3',
        description: `3 interest-free payments of £${installment}`,
        minAmount: payIn3Limits.minAmount,
        maxAmount: payIn3Limits.maxAmount,
        available: amount >= payIn3Limits.minAmount && amount <= payIn3Limits.maxAmount,
        installmentAmount: parseFloat(installment),
      });
    }
    
    // Financing (for larger amounts)
    const financingLimits = PaymentLimits.financing;
    if (amount >= financingLimits.minAmount) {
      options.push({
        id: 'financing',
        name: 'Financing',
        description: 'Spread the cost over 6-36 months',
        minAmount: financingLimits.minAmount,
        maxAmount: financingLimits.maxAmount,
        available: amount >= financingLimits.minAmount && amount <= financingLimits.maxAmount,
      });
    }
    
    return options;
  },
};

// ============== CLEARPAY SERVICE ==============
export const clearpayService = {
  isAvailable: () => isClearpayConfigured(),
  
  // Create Clearpay checkout
  createCheckout: async (data: OrderPaymentData): Promise<{
    token: string;
    redirectUrl: string;
    expires: string;
  }> => {
    if (!isClearpayConfigured()) {
      // Mock Clearpay checkout
      return {
        token: `clearpay_token_${Date.now()}`,
        redirectUrl: `https://portal.clearpay.co.uk/checkout/${Date.now()}`,
        expires: new Date(Date.now() + 3600000).toISOString(),
      };
    }
    
    // In production, call Clearpay API through your backend
    // const response = await fetch('/api/payments/clearpay/create-checkout', { ... });
    
    return {
      token: `clearpay_token_${Date.now()}`,
      redirectUrl: `https://portal.clearpay.co.uk/checkout/${Date.now()}`,
      expires: new Date(Date.now() + 3600000).toISOString(),
    };
  },
  
  // Capture Clearpay payment
  capturePayment: async (token: string): Promise<PaymentResult> => {
    if (!isClearpayConfigured()) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        paymentIntentId: `clearpay_payment_${Date.now()}`,
      };
    }
    
    // In production, call Clearpay capture API
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      paymentIntentId: `clearpay_payment_${Date.now()}`,
    };
  },
  
  // Get installment info
  getInstallmentInfo: (amount: number) => {
    if (amount < 10 || amount > 1000) {
      return null;
    }
    
    const installment = (amount / 4).toFixed(2);
    const payLaterLimits = PaymentLimits.payLater;
    return {
      available: true,
      installmentCount: 4,
      installmentAmount: parseFloat(installment),
      frequency: 'fortnightly',
      description: `4 interest-free payments of £${installment}`,
      minAmount: payLaterLimits.minAmount,
      maxAmount: payLaterLimits.maxAmount,
    };
  },
};

// ============== UNIFIED PAYMENT SERVICE ==============
export const paymentService = {
  // Get available payment methods for order
  getAvailablePaymentMethods: (amount: number): Array<{
    id: PaymentMethod;
    name: string;
    icon: string;
    available: boolean;
    description?: string;
  }> => {
    const methods = [
      {
        id: 'card' as PaymentMethod,
        name: 'Credit/Debit Card',
        icon: 'credit-card',
        available: true,
        description: 'Visa, Mastercard, Amex',
      },
    ];
    
    // Apple Pay (iOS only)
    if (Platform.OS === 'ios') {
      methods.push({
        id: 'apple_pay' as PaymentMethod,
        name: 'Apple Pay',
        icon: 'apple',
        available: true,
      });
    }
    
    // Google Pay (Android only)
    if (Platform.OS === 'android') {
      methods.push({
        id: 'google_pay' as PaymentMethod,
        name: 'Google Pay',
        icon: 'google',
        available: true,
      });
    }
    
    // Klarna
    const klarnaOptions = klarnaService.getPaymentOptions(amount);
    if (klarnaOptions.some(opt => opt.available)) {
      methods.push({
        id: 'klarna' as PaymentMethod,
        name: 'Klarna',
        icon: 'klarna',
        available: true,
        description: klarnaOptions.find(opt => opt.id === 'pay_in_3')?.description || 'Pay later or in instalments',
      });
    }
    
    // Clearpay
    const clearpayInfo = clearpayService.getInstallmentInfo(amount);
    if (clearpayInfo?.available) {
      methods.push({
        id: 'clearpay' as PaymentMethod,
        name: 'Clearpay',
        icon: 'clearpay',
        available: true,
        description: clearpayInfo.description,
      });
    }
    
    return methods;
  },
  
  // Process payment with selected method
  processPayment: async (
    method: PaymentMethod,
    data: OrderPaymentData,
    paymentDetails?: any
  ): Promise<PaymentResult> => {
    switch (method) {
      case 'card':
        const paymentIntent = await stripeService.createPaymentIntent(data);
        return stripeService.confirmCardPayment(paymentIntent.clientSecret, paymentDetails);
        
      case 'apple_pay':
        const appleIntent = await stripeService.createPaymentIntent(data);
        return stripeService.confirmApplePay(appleIntent.clientSecret, 'Zora African Market');
        
      case 'google_pay':
        const googleIntent = await stripeService.createPaymentIntent(data);
        return stripeService.confirmGooglePay(googleIntent.clientSecret);
        
      case 'klarna':
        const klarnaSession = await klarnaService.createSession(data);
        return klarnaService.authorize(klarnaSession.sessionId, paymentDetails?.category || 'pay_later');
        
      case 'clearpay':
        const clearpayCheckout = await clearpayService.createCheckout(data);
        return {
          success: true,
          requiresAction: true,
          actionUrl: clearpayCheckout.redirectUrl,
          paymentIntentId: clearpayCheckout.token,
        };
        
      default:
        return { success: false, error: 'Invalid payment method' };
    }
  },
};

export default paymentService;
