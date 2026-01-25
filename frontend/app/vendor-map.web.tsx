import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Star,
  Storefront,
  Clock,
  CaretRight,
  MapTrifold,
} from 'phosphor-react-native';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius } from '../constants/spacing';
import { FontSize, FontFamily } from '../constants/typography';
import { vendorService, type Vendor } from '../services/mockDataService';

// NOTE: Google Maps integration is available on native platforms only.
// On web, we show a vendor list with static map background.
// On iOS/Android with proper API key, use react-native-maps for full map experience.

export default function VendorMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  // Get all vendors
  const vendors = vendorService.getAll();
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Navigate to vendor page
  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendor/${vendor.id}`);
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Finding nearby vendors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Static Map Background */}
      <View style={styles.mapBackground}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        <View style={styles.mapOverlay} />
        
        {/* Map Unavailable Notice (Web) */}
        {Platform.OS === 'web' && (
          <View style={styles.webNotice}>
            <MapTrifold size={32} color={Colors.textMuted} weight="duotone" />
            <Text style={styles.webNoticeText}>
              Interactive map available on mobile app
            </Text>
          </View>
        )}
      </View>
      
      {/* Header */}
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <MapPin size={20} color={Colors.primary} weight="fill" />
            <Text style={styles.headerText}>Vendor Map</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>
      
      {/* Vendor Count Badge */}
      <View style={styles.vendorCountBadge}>
        <Storefront size={16} color="#FFFFFF" weight="fill" />
        <Text style={styles.vendorCountText}>{vendors.length} vendors nearby</Text>
      </View>
      
      {/* Vendor List */}
      <View style={styles.vendorListContainer}>
        <ScrollView 
          style={styles.vendorList}
          contentContainerStyle={styles.vendorListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Nearby Vendors</Text>
          
          {vendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.vendorCard}
              onPress={() => handleVendorPress(vendor)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: vendor.cover_image_url }}
                style={styles.vendorImage}
              />
              <View style={styles.vendorInfo}>
                <View style={styles.vendorHeader}>
                  <Text style={styles.vendorName} numberOfLines={1}>
                    {vendor.shop_name}
                  </Text>
                  {vendor.is_verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.vendorCategories} numberOfLines={1}>
                  {vendor.categories.join(' • ')}
                </Text>
                <View style={styles.vendorMeta}>
                  <View style={styles.metaItem}>
                    <Star size={14} color="#FFCC00" weight="fill" />
                    <Text style={styles.metaText}>{vendor.rating}</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <Clock size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {vendor.delivery_time_min}-{vendor.delivery_time_max} min
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaItem}>
                    <MapPin size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {vendor.coverage_radius_km}km
                    </Text>
                  </View>
                </View>
              </View>
              <CaretRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
          
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
  loadingText: {
    marginTop: 16,
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.body,
  },
  mapBackground: {
    height: '35%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  webNotice: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -30 }],
    alignItems: 'center',
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    width: 200,
  },
  webNoticeText: {
    color: Colors.textMuted,
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    textAlign: 'center',
    marginTop: 8,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  headerText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
  },
  vendorCountBadge: {
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(34, 23, 16, 0.9)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 10,
  },
  vendorCountText: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.small,
  },
  vendorListContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  vendorList: {
    flex: 1,
  },
  vendorListContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  vendorImage: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
  },
  vendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  vendorName: {
    flex: 1,
    fontFamily: FontFamily.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: '#10B981',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  vendorCategories: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.small,
    color: Colors.textMuted,
    marginTop: 2,
  },
  vendorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.caption,
    color: Colors.textMuted,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.sm,
  },
});
