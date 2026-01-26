import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, FlashlightOn, FlashlightOff, QrCode } from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { qrCodeScanner, promoQRService } from '../services/qrCodeService';

export default function QRScannerScreen() {
  const router = useRouter();
  
  // Check if CameraView is available (may not be on web)
  const isCameraAvailable = Platform.OS !== 'web' && CameraView !== undefined;
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    Vibration.vibrate(100);
    
    // Parse the QR code
    const result = qrCodeScanner.parseQRCode(data);
    
    if (result.success) {
      switch (result.type) {
        case 'order':
          Alert.alert(
            'Order Found',
            `Order #${result.data.orderId}`,
            [
              { text: 'View Order', onPress: () => router.push(`/order-tracking/${result.data.orderId}`) },
              { text: 'Scan Again', onPress: () => setScanned(false) },
            ]
          );
          break;
          
        case 'promo':
          const promoResult = await promoQRService.applyScannedPromo(data);
          Alert.alert(
            promoResult.success ? 'Promo Code Applied!' : 'Invalid Promo',
            promoResult.message,
            [
              { text: 'Continue Shopping', onPress: () => router.push('/(tabs)') },
              { text: 'Scan Again', onPress: () => setScanned(false) },
            ]
          );
          break;
          
        case 'vendor':
          Alert.alert(
            'Vendor Found',
            'View this vendor\'s shop?',
            [
              { text: 'View Shop', onPress: () => router.push(`/vendor/${result.data.vendorId}`) },
              { text: 'Scan Again', onPress: () => setScanned(false) },
            ]
          );
          break;
          
        case 'product':
          Alert.alert(
            'Product Found',
            'View this product?',
            [
              { text: 'View Product', onPress: () => router.push(`/product/${result.data.productId}`) },
              { text: 'Scan Again', onPress: () => setScanned(false) },
            ]
          );
          break;
          
        default:
          Alert.alert('Unknown QR Code', 'This QR code is not recognized.', [
            { text: 'Scan Again', onPress: () => setScanned(false) },
          ]);
      }
    } else {
      Alert.alert('Scan Error', result.error || 'Could not read QR code', [
        { text: 'Try Again', onPress: () => setScanned(false) },
      ]);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <QrCode size={64} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            To scan QR codes, please allow camera access
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // Web/Unavailable fallback - CameraView not available on web or if undefined
  if (!isCameraAvailable || !CameraView) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <QrCode size={64} color={Colors.textMuted} weight="duotone" />
          </View>
          <Text style={styles.permissionTitle}>QR Scanner</Text>
          <Text style={styles.permissionText}>
            QR code scanning is not available on this platform. Please use the mobile app to scan QR codes.
          </Text>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

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
        <SafeAreaView style={styles.header} edges={['top']}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <X size={24} color={Colors.textPrimary} weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <TouchableOpacity 
            style={styles.torchButton} 
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.cardDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  permissionTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  permissionButtonText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.body,
  },
  cancelButton: {
    paddingVertical: Spacing.md,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTitle: {
    fontFamily: FontFamily.display,
    fontSize: FontSize.h4,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  torchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
