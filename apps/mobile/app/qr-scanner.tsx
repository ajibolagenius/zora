import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, FlashlightOn, FlashlightOff, QrCode } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, Shadows } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { qrCodeScanner, promoQRService } from '../services/qrCodeService';
import { getProductRoute, getVendorRoute } from '../lib/navigationHelpers';
import { orderService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

type ScannerState = 'checking' | 'unavailable' | 'loading' | 'denied' | 'ready';

export default function QRScannerScreen() {
  const router = useRouter();
  
  // Platform check
  const isCameraAvailable = Platform.OS !== 'web' && CameraView !== undefined;
  
  // Camera permissions hook (always called)
  const [permission, requestPermission] = useCameraPermissions();
  
  // UI state
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const [scannerState, setScannerState] = useState<ScannerState>('checking');

  // Determine scanner state based on platform and permissions
  useEffect(() => {
    if (!isCameraAvailable || !CameraView) {
      setScannerState('unavailable');
      return;
    }

    if (!permission) {
      setScannerState('loading');
      return;
    }

    if (!permission.granted) {
      setScannerState('denied');
      return;
    }

    setScannerState('ready');
  }, [isCameraAvailable, permission]);

  // Auto-request permission when available
  useEffect(() => {
    if (permission && requestPermission && !permission.granted && scannerState === 'denied') {
      // Don't auto-request, let user click button
    }
  }, [permission, requestPermission, scannerState]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  const handleRequestPermission = async () => {
    if (requestPermission) {
      try {
        await requestPermission();
      } catch (error) {
        console.error('Permission request error:', error);
        Alert.alert(
          'Permission Required',
          'Camera access is required to scan QR codes. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    Vibration.vibrate(100);
    
    try {
      // Parse the QR code
      const result = qrCodeScanner.parseQRCode(data);
      
      if (result.success) {
        switch (result.type) {
          case 'order':
            // Verify order exists in database
            if (isSupabaseConfigured()) {
              try {
                const order = await orderService.verifyQRCode(data);
                if (order) {
                  Alert.alert(
                    'Order Found',
                    `Order #${order.id.substring(0, 8)} - ${order.status}`,
                    [
                      { 
                        text: 'View Order', 
                        onPress: () => {
                          router.push(`/order-tracking/${order.id}`);
                          setScanned(false);
                        }
                      },
                      { 
                        text: 'Scan Again', 
                        style: 'cancel',
                        onPress: () => setScanned(false) 
                      },
                    ]
                  );
                } else {
                  Alert.alert(
                    'Order Not Found',
                    'This QR code does not match any order in our system.',
                    [
                      { text: 'OK', onPress: () => setScanned(false) },
                    ]
                  );
                }
              } catch (error) {
                console.error('Error verifying order:', error);
                Alert.alert(
                  'Error',
                  'Could not verify order. Please try again.',
                  [
                    { text: 'OK', onPress: () => setScanned(false) },
                  ]
                );
              }
            } else {
              // Fallback for non-Supabase mode
              Alert.alert(
                'Order Found',
                `Order #${result.data.orderId}`,
                [
                  { 
                    text: 'View Order', 
                    onPress: () => {
                      router.push(`/order-tracking/${result.data.orderId}`);
                      setScanned(false);
                    }
                  },
                  { 
                    text: 'Scan Again', 
                    style: 'cancel',
                    onPress: () => setScanned(false) 
                  },
                ]
              );
            }
            break;
            
          case 'promo':
            try {
              const promoResult = await promoQRService.applyScannedPromo(data);
              Alert.alert(
                promoResult.success ? 'Promo Code Applied!' : 'Invalid Promo',
                promoResult.message,
                [
                  { 
                    text: 'Continue Shopping', 
                    onPress: () => {
                      router.push('/(tabs)');
                      setScanned(false);
                    }
                  },
                  { 
                    text: 'Scan Again', 
                    style: 'cancel',
                    onPress: () => setScanned(false) 
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to apply promo code. Please try again.', [
                { text: 'OK', onPress: () => setScanned(false) },
              ]);
            }
            break;
            
          case 'vendor':
            Alert.alert(
              'Vendor Found',
              'View this vendor\'s shop?',
              [
                { 
                  text: 'View Shop', 
                  onPress: () => {
                    router.push(getVendorRoute(undefined, result.data.vendorId));
                    setScanned(false);
                  }
                },
                { 
                  text: 'Scan Again', 
                  style: 'cancel',
                  onPress: () => setScanned(false) 
                },
              ]
            );
            break;
            
          case 'product':
            Alert.alert(
              'Product Found',
              'View this product?',
              [
                { 
                  text: 'View Product', 
                  onPress: () => {
                    router.push(getProductRoute(result.data.productId));
                    setScanned(false);
                  }
                },
                { 
                  text: 'Scan Again', 
                  style: 'cancel',
                  onPress: () => setScanned(false) 
                },
              ]
            );
            break;
            
          default:
            Alert.alert(
              'Unknown QR Code', 
              'This QR code is not recognized.',
              [
                { text: 'OK', onPress: () => setScanned(false) },
              ]
            );
        }
      } else {
        Alert.alert(
          'Scan Error', 
          result.error || 'Could not read QR code',
          [
            { text: 'Try Again', onPress: () => setScanned(false) },
          ]
        );
      }
    } catch (error) {
      console.error('QR scan error:', error);
      Alert.alert(
        'Error',
        'An error occurred while processing the QR code.',
        [
          { text: 'OK', onPress: () => setScanned(false) },
        ]
      );
    }
  };

  // Render based on scanner state
  if (scannerState === 'checking' || scannerState === 'loading') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centerContainer} edges={['top']}>
          <View style={styles.iconContainer}>
            <QrCode size={64} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.title}>QR Scanner</Text>
          <Text style={styles.subtitle}>
            {scannerState === 'checking' ? 'Checking camera availability...' : 'Requesting camera permission...'}
          </Text>
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        </SafeAreaView>
      </View>
    );
  }

  if (scannerState === 'unavailable') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centerContainer} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <X size={24} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
          
          <View style={styles.iconContainer}>
            <QrCode size={64} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.title}>QR Scanner Unavailable</Text>
          <Text style={styles.subtitle}>
            QR code scanning is not available on this platform.{'\n'}Please use the mobile app to scan QR codes.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  if (scannerState === 'denied') {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centerContainer} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <X size={24} color={Colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
          
          <View style={styles.iconContainer}>
            <QrCode size={64} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.subtitle}>
            To scan QR codes, please allow camera access in your device settings.
          </Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handleRequestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Ready state - render camera
  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        enableTorch={torch}
      />
      
      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <SafeAreaView style={styles.cameraHeader} edges={['top']}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <X size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.cameraHeaderTitle}>Scan QR Code</Text>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setTorch(!torch)}
            activeOpacity={0.8}
          >
            {torch ? (
              <FlashlightOff size={24} color={Colors.textPrimary} weight="fill" />
            ) : (
              <FlashlightOn size={24} color={Colors.textPrimary} weight="duotone" />
            )}
          </TouchableOpacity>
        </SafeAreaView>
        
        {/* Scanner Frame */}
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
          <Text style={styles.instructionSubtext}>
            Scan order confirmations, promo codes, or vendor QR codes
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  camera: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
    minWidth: 200,
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryButtonText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
  },
  secondaryButtonText: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.black50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  cameraHeaderTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
  },
  instructionText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  instructionSubtext: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
