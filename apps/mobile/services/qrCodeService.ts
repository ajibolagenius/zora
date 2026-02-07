/**
 * QR Code Service
 * Handles QR code generation and scanning for orders and promo codes
 */

import { Platform, Linking } from 'react-native';
import {
  QRCodeType,
  ScanResult,
  OrderQRData,
  PromoQRData,
  VendorQRData,
  ProductQRData,
  QRData
} from '@zora/types';

// Simple checksum for verification
const generateChecksum = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// ============== QR CODE GENERATOR ==============
export const qrCodeGenerator = {
  // Generate QR code value for order
  generateOrderQR: (orderId: string): string => {
    const timestamp = Date.now();
    const checksum = generateChecksum(`order_${orderId}_${timestamp}`);

    // Create a URL that can be scanned
    const baseUrl = 'zoramarket://';
    return `${baseUrl}order/${orderId}?t=${timestamp}&c=${checksum}`;
  },

  // Generate QR code value for promo code
  generatePromoQR: (promoCode: string): string => {
    const checksum = generateChecksum(`promo_${promoCode}`);

    const baseUrl = 'zoramarket://';
    return `${baseUrl}promo/${promoCode}?c=${checksum}`;
  },

  // Generate QR code for vendor (for in-store display)
  generateVendorQR: (vendorId: string): string => {
    const baseUrl = 'zoramarket://';
    return `${baseUrl}vendor/${vendorId}`;
  },

  // Generate QR code for product (for product labels)
  generateProductQR: (productId: string): string => {
    const baseUrl = 'zoramarket://';
    return `${baseUrl}product/${productId}`;
  },
};

// ============== QR CODE SCANNER ==============
export const qrCodeScanner = {
  // Parse scanned QR code
  parseQRCode: (scannedValue: string): ScanResult => {
    try {
      // Check if it's a Zora Market URL
      if (scannedValue.startsWith('zoramarket://')) {
        const url = scannedValue.replace('zoramarket://', '');
        const [path, queryString] = url.split('?');
        const [type, id] = path.split('/');

        // Parse query params
        const params: Record<string, string> = {};
        if (queryString) {
          queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = value;
          });
        }

        switch (type) {
          case 'order':
            const orderData: OrderQRData = {
              type: 'order',
              orderId: id,
              timestamp: params.t ? parseInt(params.t) : 0,
              checksum: params.c,
            };
            return {
              success: true,
              type: 'order',
              data: orderData,
            };

          case 'promo':
            const promoData: PromoQRData = {
              type: 'promo',
              promoCode: id,
              checksum: params.c,
            };
            return {
              success: true,
              type: 'promo',
              data: promoData,
            };

          case 'vendor':
            const vendorData: VendorQRData = {
              type: 'vendor',
              vendorId: id,
            };
            return {
              success: true,
              type: 'vendor',
              data: vendorData,
            };

          case 'product':
            const productData: ProductQRData = {
              type: 'product',
              productId: id,
            };
            return {
              success: true,
              type: 'product',
              data: productData,
            };

          default:
            return {
              success: false,
              error: 'Unknown QR code type',
            };
        }
      }

      // Check if it's a plain promo code (just text)
      if (/^[A-Z0-9]{4,20}$/.test(scannedValue.toUpperCase())) {
        const promoData: PromoQRData = {
          type: 'promo',
          promoCode: scannedValue.toUpperCase(),
        };
        return {
          success: true,
          type: 'promo',
          data: promoData,
        };
      }

      // Check if it's a URL
      if (scannedValue.startsWith('http')) {
        // External URL - could be a product link
        return {
          success: true,
          type: 'product',
          data: { url: scannedValue },
        };
      }

      return {
        success: false,
        error: 'Unrecognized QR code format',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse QR code',
      };
    }
  },

  // Verify order QR code (for delivery drivers)
  verifyOrderQR: async (scannedValue: string, expectedOrderId: string): Promise<{
    valid: boolean;
    error?: string;
  }> => {
    const result = qrCodeScanner.parseQRCode(scannedValue);

    if (!result.success || result.type !== 'order') {
      return { valid: false, error: 'Invalid order QR code' };
    }

    const data = result.data as OrderQRData; // Casting since we checked type

    if (data.orderId !== expectedOrderId) {
      return { valid: false, error: 'Order ID does not match' };
    }

    // Verify checksum
    const timestamp = data.timestamp;
    const expectedChecksum = generateChecksum(`order_${expectedOrderId}_${timestamp}`);

    if (data.checksum !== expectedChecksum) {
      return { valid: false, error: 'Invalid checksum - QR code may be tampered' };
    }

    // Check if QR code is not too old (24 hours)
    const age = Date.now() - timestamp;
    if (age > 24 * 60 * 60 * 1000) {
      return { valid: false, error: 'QR code has expired' };
    }

    return { valid: true };
  },
};

// ============== ORDER QR CODE DISPLAY ==============
export const orderQRService = {
  // Get QR code data for order confirmation screen
  getOrderQRData: (orderId: string) => {
    return {
      value: qrCodeGenerator.generateOrderQR(orderId),
      size: 200,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      logo: null, // Can add Zora logo in center
      instructions: [
        'Show this QR code to the delivery driver',
        'Driver will scan to confirm delivery',
        'Keep this screen open until delivery is complete',
      ],
    };
  },

  // Get QR code for pickup orders
  getPickupQRData: (orderId: string, vendorName: string) => {
    return {
      value: qrCodeGenerator.generateOrderQR(orderId),
      size: 250,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      instructions: [
        `Show this QR code at ${vendorName}`,
        'Staff will scan to release your order',
        'Valid for 24 hours after order is ready',
      ],
    };
  },
};

// ============== PROMO QR CODE ==============
export const promoQRService = {
  // Generate shareable promo QR code
  getShareablePromoQR: (promoCode: string, description: string) => {
    return {
      value: qrCodeGenerator.generatePromoQR(promoCode),
      size: 180,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#C1272D',
      promoCode,
      description,
      shareText: `Use code ${promoCode} at Zora African Market! ${description}`,
    };
  },

  // Apply scanned promo code
  applyScannedPromo: async (scannedValue: string): Promise<{
    success: boolean;
    promoCode?: string;
    discount?: number;
    message: string;
  }> => {
    const result = qrCodeScanner.parseQRCode(scannedValue);

    if (!result.success || result.type !== 'promo') {
      return {
        success: false,
        message: 'Invalid promo code QR',
      };
    }

    const data = result.data as PromoQRData;
    const promoCode = data.promoCode;

    // This would normally validate against the backend
    // For demo, we'll return success with mock data
    return {
      success: true,
      promoCode,
      discount: 10,
      message: `Promo code ${promoCode} applied! You saved 10%`,
    };
  },
};

export default {
  generator: qrCodeGenerator,
  scanner: qrCodeScanner,
  order: orderQRService,
  promo: promoQRService,
};
