import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  Check,
  Truck,
  MapPin,
  Package,
  QrCode,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { productService } from '../services/mockDataService';
import { orderQRService } from '../services/qrCodeService';

// Conditionally import QRCode (only works on native)
let QRCode: any = null;
try {
  QRCode = require('react-native-qrcode-svg').default;
} catch (e) {
  // QRCode not available on web
}

// Zora Brand Colors
const ZORA_RED = '#C1272D';
const ZORA_YELLOW = '#FFCC00';
const ZORA_CARD = '#3A2A21';
const SUCCESS_GREEN = '#22C55E';

// Confetti colors
const CONFETTI_COLORS = [ZORA_YELLOW, ZORA_RED, SUCCESS_GREEN, '#3B82F6', '#A855F7'];

// Generate random confetti positions
const generateConfetti = (count: number) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: Math.random() * 80 + 10,
      size: Math.random() * 8 + 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 45,
      isCircle: Math.random() > 0.5,
    });
  }
  return items;
};

const CONFETTI_ITEMS = generateConfetti(12);

// Sample recommended products
const RECOMMENDED_PRODUCTS = [
  {
    id: '1',
    name: 'Suya Spice Blend',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300',
  },
  {
    id: '2',
    name: 'Kente Table Runner',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300',
  },
  {
    id: '3',
    name: 'Plantain Chips',
    price: 4.25,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300',
  },
  {
    id: '4',
    name: 'Woven Basket',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1595408076683-5d0c29b4c3db?w=300',
  },
];

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  
  // Generate QR code data
  const orderNumber = orderId || 'ZAM-2024-1234';
  const qrData = orderQRService.getOrderQRData(orderNumber);

  // Get estimated delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${days[deliveryDate.getDay()]}, ${months[deliveryDate.getMonth()]} ${deliveryDate.getDate()}`;

  const handleTrackOrder = () => {
    router.push(`/order-tracking/${orderNumber}`);
  };

  const handleContinueShopping = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Gradient overlay at top */}
      <View style={styles.gradientOverlay} />
      
      {/* Confetti decoration */}
      {CONFETTI_ITEMS.map((item) => (
        <View
          key={item.id}
          style={[
            styles.confetti,
            {
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.isCircle ? item.size : item.size * 1.5,
              backgroundColor: item.color,
              borderRadius: item.isCircle ? item.size / 2 : 2,
              transform: [{ rotate: `${item.rotation}deg` }],
            },
          ]}
        />
      ))}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIcon}>
            <Check size={40} color="#FFFFFF" weight="bold" />
          </View>
        </View>

        {/* Header Text */}
        <View style={styles.headerText}>
          <Text style={styles.title}>Order Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>Thank you for supporting African vendors!</Text>
          <Text style={styles.orderNumber}>Order #ZAM-2024-1234</Text>
        </View>

        {/* Order Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>EST. DELIVERY</Text>
              <View style={styles.detailValue}>
                <Truck size={20} color={Colors.textPrimary} weight="fill" />
                <Text style={styles.detailValueText}>{formattedDate}</Text>
              </View>
            </View>
            <View style={[styles.detailItem, styles.detailItemRight]}>
              <Text style={styles.detailLabel}>SHIP TO</Text>
              <Text style={styles.detailValueText} numberOfLines={1}>123 Zora Lane, London</Text>
            </View>
          </View>
          
          <View style={styles.detailsDivider} />
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>ITEMS</Text>
              <Text style={styles.detailValueText}>3 items from 2 vendors</Text>
            </View>
            <View style={[styles.detailItem, styles.detailItemRight]}>
              <Text style={styles.detailLabel}>TOTAL PAID</Text>
              <Text style={styles.totalPaid}>£45.49</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleTrackOrder}
            activeOpacity={0.9}
          >
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueShopping}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

        {/* Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>You might also like</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsScroll}
          >
            {RECOMMENDED_PRODUCTS.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => router.push(`/product/${product.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.productImageContainer}>
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productPrice}>£{product.price.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom padding */}
        <View style={{ height: insets.bottom + 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(193, 39, 45, 0.05)',
  },
  confetti: {
    position: 'absolute',
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  
  // Success Icon
  successIconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SUCCESS_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: SUCCESS_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Header Text
  headerText: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: FontFamily.display,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.body,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  orderNumber: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.small,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 8,
  },
  
  // Order Details Card
  detailsCard: {
    width: '100%',
    backgroundColor: ZORA_CARD,
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 32,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailItemRight: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: 10,
    color: '#b99d9d',
    letterSpacing: 1,
    marginBottom: 6,
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailValueText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  totalPaid: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.h3,
    color: ZORA_YELLOW,
  },
  
  // Action Buttons
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  trackButton: {
    width: '100%',
    height: 56,
    backgroundColor: ZORA_RED,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ZORA_RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  trackButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(193, 39, 45, 0.3)',
  },
  continueButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: ZORA_RED,
  },
  
  // Recommendations Section
  recommendationsSection: {
    width: '100%',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  recommendationsTitle: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: ZORA_RED,
  },
  recommendationsScroll: {
    gap: 16,
  },
  
  // Product Card
  productCard: {
    width: 140,
    gap: 8,
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    gap: 2,
  },
  productName: {
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.textPrimary,
  },
  productPrice: {
    fontFamily: FontFamily.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
