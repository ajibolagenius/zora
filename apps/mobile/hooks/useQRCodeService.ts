import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QRCodeData {
  id: string;
  type: 'order' | 'product' | 'vendor' | 'coupon';
  data: any;
  timestamp: number;
}

interface ValidationResult {
  isValid: boolean;
  type?: string;
  data?: any;
}

export const useQRCodeService = () => {
  const [qrHistory, setQRHistory] = useState<QRCodeData[]>([]);

  // Load QR history from storage
  useState(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('qr_history');
        if (stored) {
          setQRHistory(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load QR history:', error);
      }
    })();
  }, []);

  const saveQRToHistory = useCallback(async (qrData: QRCodeData) => {
    try {
      const updated = [qrData, ...qrHistory];
      setQRHistory(updated);
      await AsyncStorage.setItem('qr_history', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save QR to history:', error);
    }
  }, [qrHistory]);

  const generateOrderQR = useCallback(async (orderData: any) => {
    const qrData: QRCodeData = {
      id: `order_${Date.now()}`,
      type: 'order',
      data: orderData,
      timestamp: Date.now()
    };

    await saveQRToHistory(qrData);
    return qrData;
  }, [saveQRToHistory]);

  const generateProductQR = useCallback(async (productData: any) => {
    const qrData: QRCodeData = {
      id: `product_${Date.now()}`,
      type: 'product',
      data: productData,
      timestamp: Date.now()
    };

    await saveQRToHistory(qrData);
    return qrData;
  }, [saveQRToHistory]);

  const validateQRCode = useCallback(async (qrData: string): Promise<ValidationResult> => {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(qrData);
      
      // Validate order QR codes
      if (parsed.orderNumber) {
        return {
          isValid: true,
          type: 'order',
          data: parsed
        };
      }

      // Validate product QR codes
      if (parsed.name && parsed.price && parsed.category) {
        return {
          isValid: true,
          type: 'product',
          data: parsed
        };
      }

      // Validate vendor QR codes
      if (parsed.storeName && parsed.vendorId) {
        return {
          isValid: true,
          type: 'vendor',
          data: parsed
        };
      }

      // Validate coupon QR codes
      if (parsed.code && parsed.discount && parsed.expiry) {
        return {
          isValid: true,
          type: 'coupon',
          data: parsed
        };
      }

      // Check if it's a Zora Market QR code
      if (typeof parsed === 'object' && parsed.source === 'zora-market') {
        return {
          isValid: true,
          type: parsed.type,
          data: parsed.data
        };
      }

      return {
        isValid: false,
        type: undefined,
        data: null
      };
    } catch (error) {
      // If JSON parsing fails, check if it's a simple string
      if (qrData.includes('zora-market://')) {
        return {
          isValid: true,
          type: 'product',
          data: { url: qrData }
        };
      }

      return {
        isValid: false,
        type: undefined,
        data: null
      };
    }
  }, []);

  const getQRHistory = useCallback(() => {
    return qrHistory;
  }, [qrHistory]);

  const clearQRHistory = useCallback(async () => {
    try {
      setQRHistory([]);
      await AsyncStorage.removeItem('qr_history');
    } catch (error) {
      console.error('Failed to clear QR history:', error);
    }
  }, []);

  const generateVendorQR = useCallback(async (vendorData: any) => {
    const qrData: QRCodeData = {
      id: `vendor_${Date.now()}`,
      type: 'vendor',
      data: vendorData,
      timestamp: Date.now()
    };

    await saveQRToHistory(qrData);
    return qrData;
  }, [saveQRToHistory]);

  const generateCouponQR = useCallback(async (couponData: any) => {
    const qrData: QRCodeData = {
      id: `coupon_${Date.now()}`,
      type: 'coupon',
      data: couponData,
      timestamp: Date.now()
    };

    await saveQRToHistory(qrData);
    return qrData;
  }, [saveQRToHistory]);

  return {
    generateOrderQR,
    generateProductQR,
    generateVendorQR,
    generateCouponQR,
    validateQRCode,
    getQRHistory,
    clearQRHistory,
    qrHistory
  };
};
