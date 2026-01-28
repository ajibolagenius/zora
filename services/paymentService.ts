/**
 * Payment Service
 * Handles Stripe payment integrations
 */

import { Platform } from 'react-native';

// Configuration
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key_here';

// Check if payment providers are configured
const isStripeConfigured = () => !STRIPE_PUBLISHABLE_KEY.includes('your_stripe');

// Payment method types
export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

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
        
      default:
        return { success: false, error: 'Invalid payment method' };
    }
  },
};

export default paymentService;
